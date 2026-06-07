import { createClient } from './supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Opportunity {
  id: string;
  content_hash: string;
  title: string;
  category: string;
  type: string;
  location: string;
  relevance_score: number;
  description: string;
  proof_links: string[];
  url: string;
  provider_name: string;
  original_url: string;
  scraped_at: string;
  scoring: Record<string, unknown>;
  enrichment: Record<string, unknown>;
  explanation: Record<string, unknown>;
  ai_explanation?: string;
}

export interface Stats {
  sources: { total: number; active: number };
  data: { raw: number; processed: number };
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  onboarding_role: string | null;
  account_tier: string | null;
  interests: string[] | null;
  scan_credits: number;
  onboarding_completed: boolean;
  created_at: string;
  preferences?: Record<string, unknown> | null;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = 10000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(resource, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error: unknown) {
      clearTimeout(id);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timed out');
      }
      throw error;
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/health`, { timeout: 3000 });
      return res.ok;
    } catch { return false; }
  },

  /**
   * Fetches opportunities directly from Supabase.
   * Prioritizes personalized intelligence_feed for authenticated users.
   */
  async getOpportunities(category?: string, type?: string): Promise<Opportunity[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 1. Try personalized intelligence_feed
      const { data: feedData, error: feedError } = await supabase
        .from('intelligence_feed')
        .select(`
          relevance_score,
          why_surfaced,
          status,
          opportunities (*)
        `)
        .eq('user_id', user.id)
        .order('relevance_score', { ascending: false });

      if (!feedError && feedData && feedData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let results = (feedData as any[]).map((item) => {
          const opp = Array.isArray(item.opportunities) ? item.opportunities[0] : item.opportunities;
          return {
            ...opp,
            relevance_score: item.relevance_score,
            ai_explanation: item.why_surfaced,
          };
        });

        if (category && category !== 'all') {
          results = results.filter(r => r.category === category.toLowerCase());
        }
        if (type && type !== 'all') {
          const typeVal = type.toLowerCase();
          if (typeVal === 'job') {
            results = results.filter(r => ['job', 'internship', 'gig', 'volunteer'].includes(r.type));
          } else if (typeVal === 'entrepreneurial') {
            results = results.filter(r => ['entrepreneurial', 'entrepreneurial-signal', 'grant'].includes(r.type));
          } else {
            results = results.filter(r => r.type === typeVal);
          }
        }
        
        if (results.length > 0) return results as Opportunity[];
      }
    }

    // 2. Global fallback
    let query = supabase
      .from('opportunities')
      .select('*')
      .order('relevance_score', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category.toLowerCase());
    }
    
    if (type && type !== 'all') {
      const typeVal = type.toLowerCase();
      if (typeVal === 'job') {
        query = query.in('type', ['job', 'internship', 'gig', 'volunteer']);
      } else if (typeVal === 'entrepreneurial') {
        query = query.in('type', ['entrepreneurial', 'entrepreneurial-signal', 'grant']);
      } else {
        query = query.eq('type', typeVal);
      }
    }

    try {
      const { data, error } = await query;
      if (error) throw new ApiError(500, error.message);
      return (data as Opportunity[]) || [];
    } catch (error) {
      console.error('[Supabase] Fetch error:', error);
      throw new Error('Intelligence terminal offline');
    }
  },

  async getFavorites(): Promise<Opportunity[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          opportunity_id,
          opportunities (*)
        `)
        .eq('user_id', user.id);

      if (error) throw new ApiError(500, error.message);

      return (data as { opportunities: Opportunity | Opportunity[] | null }[])
        .map((b) => (Array.isArray(b.opportunities) ? b.opportunities[0] : b.opportunities) as Opportunity | null)
        .filter((o): o is Opportunity => o !== null);
    } catch (error) {
      console.error('[Supabase] Favorites fetch error:', error);
      return [];
    }
  },

  async getStats(): Promise<Stats> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/stats`);
      if (!res.ok) throw new ApiError(res.status, 'Failed to fetch stats');
      return await res.json();
    } catch {
      return {
        sources: { total: 0, active: 0 },
        data: { raw: 0, processed: 0 }
      };
    }
  },

  async getBookmarks(): Promise<string[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('bookmarks')
      .select('opportunity_id')
      .eq('user_id', user.id);
      
    if (error) return [];
    return data.map(b => b.opportunity_id);
  },

  async toggleBookmark(opportunityId: string, isBookmarked: boolean): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('opportunity_id', opportunityId);
      return !error;
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert({ user_id: user.id, opportunity_id: opportunityId });
      
      // Log high-intent activity
      if (!error) {
        await this.logActivity(opportunityId, 'save');
      }
      return !error;
    }
  },

  /**
   * Logs user behavioral signals for the Affinity Engine.
   */
  async logActivity(opportunityId: string, action: 'view' | 'click' | 'save' | 'ignore'): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase.from('scout_activity_logs').insert({
        user_id: user.id,
        opportunity_id: opportunityId,
        action_type: action
      });
    } catch (err) {
      console.warn('[Affinity] Failed to log activity:', err);
    }
  },

  async triggerScan(categories: string[], goals: string[]): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories, goals, userId: user?.id }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new ApiError(res.status, errData.error || 'Command execution failed');
      }
    } catch (error) { 
      if (error instanceof ApiError) throw error;
      throw new Error('Scan sequence interrupted'); 
    }
  },
};
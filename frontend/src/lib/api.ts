const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Opportunity {
  _id: string;
  title: string;
  category: string;
  type: string;
  location: string;
  relevanceScore: number;
  proofLinks: string[];
  providerName: string;
  originalUrl: string;
  description?: string;
}

export interface Stats {
  sources: { total: number; active: number };
  data: { raw: number; processed: number };
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

  async getOpportunities(category?: string, type?: string): Promise<Opportunity[]> {
    const url = new URL(`${API_BASE_URL}/opportunities`);
    if (category) url.searchParams.append('category', category);
    if (type) url.searchParams.append('type', type);
    
    try {
      const res = await this.fetchWithTimeout(url.toString());
      if (!res.ok) throw new ApiError(res.status, 'Critical: Could not retrieve intelligence feed');
      let data: Opportunity[] = await res.json();
      
      // Frontend fallback filtering if backend hasn't implemented 'type' filter yet
      if (type && data.length > 0) {
        data = data.filter(item => item.type?.toLowerCase() === type.toLowerCase());
      }
      
      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('Intelligence terminal offline');
    }
  },

  async getStats(): Promise<Stats> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/stats`);
      if (!res.ok) throw new ApiError(res.status, 'System diagnostics unavailable');
      return res.json();
    } catch { throw new Error('Metrics sync failure'); }
  },

  async triggerScan(categories: string[], goals: string[]): Promise<void> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories, goals }),
      });
      if (!res.ok) throw new ApiError(res.status, 'Command execution failed');
    } catch { throw new Error('Scan sequence interrupted'); }
  },
};

const API_BASE_URL = 'http://localhost:5000/api';

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
}

export interface Stats {
  sources: { total: number; active: number };
  data: { raw: number; processed: number };
}

export const api = {
  async getOpportunities(category?: string): Promise<Opportunity[]> {
    const url = new URL(`${API_BASE_URL}/opportunities`);
    if (category) url.searchParams.append('category', category);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return res.json();
  },

  async getStats(): Promise<Stats> {
    const res = await fetch(`${API_BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async triggerScan(categories: string[], goals: string[]): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories, goals }),
    });
    if (!res.ok) throw new Error('Failed to trigger scan');
  },
};

import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http');

  // Use placeholders during build/prerendering if env vars are missing
  // to prevent 'Invalid supabaseUrl' errors.
  return createBrowserClient(
    isUrlValid ? supabaseUrl : 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
  );
};

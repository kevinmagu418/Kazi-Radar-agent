import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (typeof window !== 'undefined') {
    if (!supabaseUrl || supabaseUrl === 'undefined') {
      console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing in the browser! Rebuild your app with the correct .env file.');
    }
  }

  const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http');

  // Use placeholders during build/prerendering if env vars are missing
  // to prevent 'Invalid supabaseUrl' errors.
  return createBrowserClient(
    isUrlValid ? supabaseUrl : 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
  );
};

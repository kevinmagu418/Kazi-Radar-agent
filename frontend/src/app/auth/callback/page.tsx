'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=callback_failed');
        return;
      }

      if (data.session) {
        const user = data.session.user;

        // Check if onboarding is completed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Fallback to dashboard if profile fetch fails
          router.push('/dashboard');
          return;
        }

        if (profile?.onboarding_completed) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        router.push('/login');
      }
    };

    handleAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Synchronizing with KaziRadar...</h2>
        <p className="text-muted/60 text-sm">Authenticating your intelligence terminal access.</p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Feedback } from '@/components/ui/feedback';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your AI intelligence terminal"
      backLink="/"
    >
      <div className="space-y-6">
        <SocialAuth />

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted/70 px-1">
              Email Address
            </label>
            <Input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-muted/70">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-xs font-bold text-primary hover:text-primary-glow transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-background/50"
            />
          </div>

          {error && <Feedback type="error" message={error} />}

          <Button 
            type="submit" 
            className="w-full h-12 font-bold" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In to KaziRadar"
            )}
          </Button>
        </form>

        <div className="text-center pt-4 text-sm font-medium text-muted/70">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Create one free
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

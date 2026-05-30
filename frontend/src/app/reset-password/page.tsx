'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout 
        title="Password updated" 
        subtitle="Your intelligence terminal is secure again"
      >
        <div className="text-center space-y-6">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <div className="h-2 w-2 bg-primary rounded-full" />
          </div>
          <p className="text-sm text-muted/70 leading-relaxed font-medium">
            Success! Redirecting you to login in a few seconds...
          </p>
          <Button 
            variant="secondary" 
            className="w-full font-bold"
            onClick={() => router.push('/login')}
          >
            Go to Login Now
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create new password" 
      subtitle="Secure your KaziRadar account with a new master key"
    >
      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted/70 px-1">
            New Password
          </label>
          <Input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted/70 px-1">
            Confirm Password
          </label>
          <Input 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12 bg-background/50"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 font-bold" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Feedback } from '@/components/ui/feedback';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setIsSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout 
        title="Check your email" 
        subtitle="Reset link on its way"
      >
        <div className="space-y-6">
          <Feedback 
            type="success"
            title="Reset Link Sent"
            message={`We've sent a password reset link to ${email}. Please check your inbox and spam folder.`}
          />
          <Button 
            variant="secondary" 
            className="w-full font-bold h-14"
            onClick={() => setIsSuccess(false)}
          >
            Try another email
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Lost your way?" 
      subtitle="Enter your email to reset your intelligence terminal access"
      backLink="/login"
    >
      <form onSubmit={handleResetRequest} className="space-y-6">
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

        {error && <Feedback type="error" message={error} />}

        <Button 
          type="submit" 
          className="w-full h-14 font-bold" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

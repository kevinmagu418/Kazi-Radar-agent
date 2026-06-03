'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialAuth } from '@/components/auth/SocialAuth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';
import { Feedback } from '@/components/ui/feedback';

function SignupForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get('role') ?? '';
  const plan = searchParams.get('plan') ?? '';

  const strength = usePasswordStrength(password);

  // Derived validation
  const passwordsMatch = password === confirmPassword;
  const confirmTouched = confirmPassword.length > 0;
  const canSubmit =
    fullName.trim() &&
    email.trim() &&
    strength.score >= 2 &&
    passwordsMatch &&
    confirmTouched;

  const strengthBarColor =
    strength.score <= 1
      ? 'bg-red-500'
      : strength.score === 2
      ? 'bg-amber-400'
      : strength.score === 3
      ? 'bg-yellow-400'
      : 'bg-emerald-400';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            onboarding_role: role || undefined,
            onboarding_plan: plan || undefined,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Clear any localStorage pending data
      localStorage.removeItem('kazi_pending_role');
      localStorage.removeItem('kazi_pending_plan');

      setIsSuccess(true);
    } catch (err: unknown) {
      const msg: string = err instanceof Error ? err.message : String(err);
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (msg.includes('Password should be')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError(msg || 'Signup failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout title="Verify your access" subtitle="Action required to activate your terminal">
        <div className="space-y-6">
          <Feedback 
            type="success"
            title="Activation Email Sent"
            message={`We've sent a secure verification link to ${email}. You must click this link to activate your AI scout and access the dashboard.`}
          />
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Next Steps:</h4>
            <ul className="text-xs text-muted/60 space-y-2 list-disc pl-4">
              <li>Check your inbox (and spam folder)</li>
              <li>Click the &quot;Confirm Email&quot; link</li>
              <li>Your scout will activate automatically</li>
            </ul>
          </div>
          <button
            className="w-full h-14 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold text-sm"
            onClick={() => router.push('/login')}
          >
            Back to Sign In
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join 2,000+ humans finding their next big thing"
      backLink="/"
    >
      <div className="space-y-5">
        <SocialAuth pendingRole={role} pendingPlan={plan} />

        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted/60 px-1">
              Full Name
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted/30 text-sm font-medium outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted/60 px-1">
              Email Address
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted/30 text-sm font-medium outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted/60 px-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted/30 text-sm font-medium outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted/80 transition-colors p-1"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          strength.score >= i ? strengthBarColor : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span className={`text-[11px] font-bold ml-3 ${strength.color}`}>
                      {strength.label}
                    </span>
                  )}
                </div>

                {/* Rules checklist */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-1">
                  {strength.rules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      {rule.met ? (
                        <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted/30 shrink-0" />
                      )}
                      <span className={`text-[10px] font-medium leading-tight ${rule.met ? 'text-muted/70' : 'text-muted/30'}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted/60 px-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full h-12 px-4 pr-12 rounded-xl bg-white/5 border text-foreground placeholder:text-muted/30 text-sm font-medium outline-none transition-all ${
                  confirmTouched && !passwordsMatch
                    ? 'border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20'
                    : confirmTouched && passwordsMatch
                    ? 'border-emerald-500/40 focus:border-emerald-500/60'
                    : 'border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted/80 transition-colors p-1"
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {confirmTouched && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <X className="h-4 w-4 text-red-400" />
                  )}
                </div>
              )}
            </div>
            {confirmTouched && !passwordsMatch && (
              <p className="text-[11px] text-red-400 font-semibold px-1 pt-0.5">
                Passwords don&apos;t match
              </p>
            )}
          </div>

          {/* Error */}
          {error && <Feedback type="error" message={error} />}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              'Get Started for Free'
            )}
          </button>

          <p className="text-[10px] text-center text-muted/30 font-medium px-4 leading-relaxed">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <div className="text-center pt-2 text-sm font-medium text-muted/60">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { WelcomeStep } from './components/WelcomeStep';
import { ProfileStep } from './components/ProfileStep';
import { RoleSelectionStep } from './components/RoleSelectionStep';
import { PlanSelectionStep } from './components/PlanSelectionStep';
import { PaymentStep } from './components/PaymentStep';

type Step = 'welcome' | 'profile' | 'role' | 'plan' | 'payment' | 'processing';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('welcome');
  const [isInitialized, setIsInitialized] = useState(false);
  const [userData, setUserData] = useState({
    role: '',
    plan: '',
  });

  const supabase = createClient();

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user wants to jump to plan selection
      const requestedStep = searchParams.get('step');
      if (requestedStep === 'plan') {
        setStep('plan');
      } else if (user) {
        // Regular flow check for logged in users
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
        
        if (profile?.onboarding_completed) {
          router.replace('/dashboard');
          return;
        }
      }
      setIsInitialized(true);
    };
    checkStatus();
  }, [searchParams, router, supabase]);

  const handleWelcomeNext = () => setStep('profile');
  
  const handleProfileNext = () => setStep('role');

  const handleRoleSelect = (role: string) => {
    setUserData((prev) => ({ ...prev, role }));
    setStep('plan');
  };

  const handlePlanSelect = async (plan: string) => {
    setUserData((prev) => ({ ...prev, plan }));
    
    // If premium plan, go to payment
    if (plan !== 'free') {
      setStep('payment');
      return;
    }

    // If free plan, finish onboarding
    await completeOnboarding(plan);
  };

  const completeOnboarding = async (plan: string) => {
    setStep('processing');
    
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // User is already logged in, update their profile directly
      const updateData: Record<string, string | boolean> = {
        onboarding_completed: true
      };
      
      // Only update role if it was selected in this flow
      if (userData.role) {
        updateData.onboarding_role = userData.role;
      }

      await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      router.push('/dashboard');
    } else {
      // Not logged in, proceed to signup with data
      const params = new URLSearchParams({
        role: userData.role,
        plan: plan
      });
      router.push(`/signup?${params.toString()}`);
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="w-full max-w-7xl mx-auto flex items-center justify-center min-h-[80vh]">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <WelcomeStep key="welcome" onNext={handleWelcomeNext} />
        )}
        {step === 'profile' && (
          <ProfileStep key="profile" onNext={handleProfileNext} />
        )}
        {step === 'role' && (
          <RoleSelectionStep key="role" onNext={handleRoleSelect} />
        )}
        {step === 'plan' && (
          <PlanSelectionStep key="plan" onNext={handlePlanSelect} />
        )}
        {step === 'payment' && (
          <PaymentStep 
            key="payment" 
            selectedPlanId={userData.plan} 
            onNext={() => completeOnboarding(userData.plan)} 
          />
        )}
        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Setting up your Scout...</h2>
              <p className="text-muted/60">Tailoring the discovery engine to your profile.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Step Indicator */}
      {step !== 'processing' && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {(['welcome', 'profile', 'role', 'plan', 'payment'] as Step[]).map((s) => (
            <div 
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                step === s ? 'w-8 bg-primary' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

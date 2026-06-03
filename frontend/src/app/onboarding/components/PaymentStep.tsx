'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, CheckCircle2, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { plans } from './PlanSelectionStep';
import { Feedback } from '@/components/ui/feedback';

interface PaymentStepProps {
  selectedPlanId: string;
  onNext: () => void;
}

export function PaymentStep({ selectedPlanId, onNext }: PaymentStepProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStkSent, setIsStkSent] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const plan = plans.find(p => p.id === selectedPlanId);
  const supabase = createClient();

  useEffect(() => {
    if (!transactionId || isConfirmed) return;

    // Listen for payment confirmation in Realtime
    const channel = supabase
      .channel(`payment-${transactionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payment_transactions',
          filter: `id=eq.${transactionId}`,
        },
        (payload) => {
          if (payload.new.status === 'completed') {
            setIsConfirmed(true);
            setIsStkSent(false);
          } else if (payload.new.status === 'failed') {
            setError('The payment request failed or was cancelled. Please try again.');
            setIsStkSent(false);
            setTransactionId(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [transactionId, isConfirmed, supabase]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please sign in to continue');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/payhero-stk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          amount: plan?.price,
          plan: selectedPlanId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to initiate payment');
      }

      setTransactionId(result.transaction_id);
      setIsStkSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce shadow-2xl shadow-green-500/20">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Payment Confirmed!</h2>
          <p className="text-muted/80 text-lg">
            Awesome! Your <strong>{plan?.name}</strong> is now active.
          </p>
          <Feedback 
            type="success" 
            message="Your account has been upgraded successfully. Welcome to the elite network." 
          />
        </div>
        <Button onClick={onNext} size="lg" className="w-full h-16 text-xl font-bold shadow-xl shadow-primary/20">
          Enter Dashboard <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  if (isStkSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Confirm on your phone</h2>
          <p className="text-muted/80">
            We&apos;ve sent an M-Pesa prompt to <strong>{phoneNumber}</strong>.
          </p>
          
          <Feedback 
            type="loading" 
            title="Waiting for M-Pesa"
            message="Please enter your PIN on your phone to complete the purchase. This window will update automatically."
          />
        </div>
        
        <div className="pt-4 flex flex-col gap-3">
          <Button variant="ghost" onClick={() => setIsStkSent(false)} className="text-muted/60 hover:text-foreground">
            Try a different number
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md w-full space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Complete your upgrade</h1>
        <p className="text-muted/80 leading-relaxed">
          Enter your M-Pesa phone number to pay <strong>{plan?.priceLabel}</strong> for the <strong>{plan?.name}</strong>.
        </p>
      </div>

      <Card className="p-8 border-2 border-primary/20 bg-surface/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-primary/5">
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted/60 ml-1">
              Safaricom Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted/40" />
              <Input
                type="text"
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-14 h-16 bg-background/50 border-white/10 rounded-2xl focus:border-primary/50 transition-all text-lg"
                required
              />
            </div>
            <p className="text-[10px] text-muted/40 ml-1">
              Format: 07... or 254...
            </p>
          </div>

          {error && <Feedback type="error" message={error} />}

          <Button 
            type="submit" 
            disabled={isLoading || !phoneNumber}
            className="w-full h-16 text-lg font-bold shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              `Pay ${plan?.priceLabel}`
            )}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-muted/40 font-medium">
        By clicking pay, you&apos;ll receive an STK push on your phone.
      </p>
    </motion.div>
  );
}

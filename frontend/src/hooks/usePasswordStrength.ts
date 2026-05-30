import { useMemo } from 'react';

export type StrengthScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordRule {
  label: string;
  met: boolean;
}

export interface PasswordStrength {
  score: StrengthScore;
  rules: PasswordRule[];
  label: string;
  color: string;
}

export const usePasswordStrength = (password: string): PasswordStrength => {
  const strength = useMemo(() => {
    const rules = [
      { label: '8+ characters', met: password.length >= 8 },
      { label: 'Uppercase', met: /[A-Z]/.test(password) },
      { label: 'Number', met: /\d/.test(password) },
      { label: 'Special char', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const score = rules.filter(r => r.met).length as StrengthScore;
    
    let label = '';
    let color = '';

    if (password.length > 0) {
      if (score <= 1) {
        label = 'Weak';
        color = 'text-red-400';
      } else if (score === 2) {
        label = 'Fair';
        color = 'text-amber-400';
      } else if (score === 3) {
        label = 'Good';
        color = 'text-yellow-400';
      } else {
        label = 'Strong';
        color = 'text-emerald-400';
      }
    }

    return { score, rules, label, color };
  }, [password]);

  return strength;
};

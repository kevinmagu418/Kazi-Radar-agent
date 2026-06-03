import { Metadata } from 'next';
import SignupClient from './SignupClient';

export const metadata: Metadata = {
  title: 'Create Account | KaziRadar',
  description: 'Join KaziRadar today and activate your personal AI scout to find the best jobs, grants, and funding opportunities.',
  alternates: {
    canonical: '/signup',
  },
};

export default function Page() {
  return <SignupClient />;
}

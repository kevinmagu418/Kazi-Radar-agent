import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign In | KaziRadar',
  description: 'Log in to your KaziRadar intelligence terminal and access your personalized opportunity feed.',
  alternates: {
    canonical: '/login',
  },
};

export default function Page() {
  return <LoginClient />;
}

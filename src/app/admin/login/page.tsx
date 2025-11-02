
import type { Metadata } from 'next';
import LoginForm from './login-form';
import { Logo } from '@/components/layout/Logo';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Admin login for Kopi Dua Darjat',
  robots: {
    index: false,
    follow: false,
  }
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center gap-4 mb-8">
            <Logo />
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">
                Kopi Dua Darjat
              </h1>
              <p className="text-zinc-400">
                Admin Panel
              </p>
            </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

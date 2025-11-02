
import type { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Admin login for Kopi Dua Darjat',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md p-8">
        <h1 className="text-4xl font-headline font-bold text-primary text-center mb-2">
          Kopi Dua Darjat
        </h1>
        <p className="text-center text-zinc-400 mb-8">
          Admin Panel Login
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

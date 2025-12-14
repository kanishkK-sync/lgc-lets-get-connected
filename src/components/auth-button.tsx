"use client";

import { useAuth } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function AuthButton() {
  const { user, login, loading, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</Button>
  }

  if (user) {
    return (
      <Link href="/dashboard">
        <Button>Dashboard</Button>
      </Link>
    );
  }

  return (
    <Button onClick={login} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="mr-2 h-4 w-4" />
      )}
      Login / Signup
    </Button>
  );
}

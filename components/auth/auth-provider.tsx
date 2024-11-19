'use client';

import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    // Handle token refresh
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;
      } else {
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        if (!pathname.startsWith('/auth') && pathname !== '/') {
          router.push('/auth');
        }
      }
    });

    // Set up periodic token refresh
    const refreshToken = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => {
      unsubscribe();
      clearInterval(refreshToken);
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setAuthToken } from '@/lib/api-client';

export function useAuth() {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken);
    } else {
      setAuthToken(null);
    }
  }, [session]);
  
  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
    token: session?.accessToken,
  };
}


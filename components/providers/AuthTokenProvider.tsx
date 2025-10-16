'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { setAuthToken } from '@/lib/api-client';

interface AuthTokenContextValue {
  isTokenReady: boolean;
}

const AuthTokenContext = createContext<AuthTokenContextValue>({ isTokenReady: false });

export function useAuthToken() {
  return useContext(AuthTokenContext);
}

export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isTokenReady, setIsTokenReady] = useState(false);
  
  useEffect(() => {
    if (status === 'loading') {
      setIsTokenReady(false);
      return;
    }

    if (session?.accessToken) {
      setAuthToken(session.accessToken);
      setIsTokenReady(true);
      console.log('✅ Auth token set for API requests');
    } else {
      setAuthToken(null);
      setIsTokenReady(false);
      console.log('⚠️ No auth token available');
    }
  }, [session, status]);
  
  return (
    <AuthTokenContext.Provider value={{ isTokenReady }}>
      {children}
    </AuthTokenContext.Provider>
  );
}


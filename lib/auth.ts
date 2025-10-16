import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { setAuthToken } from '@/lib/api-client';
import { AuthService } from '@/services/auth.service';

const authService = new AuthService();

interface ExtendedUser {
  id: string;
  email: string;
  accessToken?: string;
  isAnonymous?: boolean;
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 [NextAuth] Iniciando autorização...');
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [NextAuth] Credenciais ausentes');
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          console.log('📡 [NextAuth] Autenticando usuário:', credentials.email);
          
          // Call auth service directly (no HTTP request)
          const response = await authService.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          console.log('✅ [NextAuth] Usuário autenticado:', {
            hasToken: !!response.token,
            hasUser: !!response.user,
            userId: response.user?.id,
            userEmail: response.user?.email
          });

          const userObj = {
            id: response.user.id,
            email: response.user.email,
            isAnonymous: response.user.isAnonymous,
            accessToken: response.token,
          };
          
          console.log('✅ [NextAuth] Retornando usuário autorizado');
          return userObj;
        } catch (error) {
          console.error('❌ [NextAuth] Erro no authorize:', error);
          throw new Error('Email ou senha inválidos');
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎫 [NextAuth] JWT Callback - user:', user ? 'presente' : 'ausente');
      
      // Initial sign in
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.accessToken = extendedUser.accessToken;
        token.id = user.id;
        token.email = user.email;
        token.isAnonymous = extendedUser.isAnonymous;
        
        console.log('✅ [NextAuth] Token atualizado:', {
          hasAccessToken: !!token.accessToken,
          userId: token.id,
          email: token.email
        });
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log('📋 [NextAuth] Session Callback');
      
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAnonymous = token.isAnonymous as boolean;
        session.accessToken = token.accessToken as string;
        
        // Set token in API client for subsequent requests
        setAuthToken(token.accessToken as string);
        
        console.log('✅ [NextAuth] Session criada para:', session.user.email);
      }
      
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);


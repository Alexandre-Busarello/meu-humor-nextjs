'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api-client';
import { Brain, Check, X, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Password strength helpers
const hasLowerCase = (str: string) => /[a-z]/.test(str);
const hasUpperCase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /[0-9]/.test(str);
const hasSpecialChar = (str: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(str);
const isLongEnough = (str: string) => str.length >= 8;

const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  if (isLongEnough(password)) strength += 1;
  if (hasLowerCase(password)) strength += 1;
  if (hasUpperCase(password)) strength += 1;
  if (hasNumber(password)) strength += 1;
  if (hasSpecialChar(password)) strength += 1;
  
  return strength;
};

const getStrengthLabel = (strength: number): string => {
  if (strength === 0) return 'Muito fraca';
  if (strength === 1) return 'Fraca';
  if (strength === 2) return 'Razoável';
  if (strength === 3) return 'Boa';
  if (strength === 4) return 'Forte';
  return 'Muito forte';
};

const getStrengthColor = (strength: number): string => {
  if (strength === 0) return 'bg-red-500';
  if (strength === 1) return 'bg-red-500';
  if (strength === 2) return 'bg-yellow-500';
  if (strength === 3) return 'bg-yellow-500';
  if (strength === 4) return 'bg-green-500';
  return 'bg-green-500';
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = passwordStrength >= 3;
  const canSubmitNewAccount = email && password && passwordsMatch && isPasswordValid;

  useEffect(() => {
    // Check URL parameters for direct account creation
    if (searchParams.get('createAccount') === 'true') {
      setIsCreatingAccount(true);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Use NextAuth signIn
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou senha inválidos');
      } else if (result?.ok) {
        router.push('/home');
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    // Validate password strength
    if (passwordStrength < 3) {
      setError('A senha não é forte o suficiente. Ela deve ter pelo menos 8 caracteres, incluir letras maiúsculas, minúsculas, números e caracteres especiais.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Register user through Express backend
      await authAPI.register(email, password);
      
      // After successful registration, log in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Conta criada, mas erro ao fazer login. Tente fazer login manualmente.');
      } else if (result?.ok) {
        router.push('/home');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.');
      console.error('Create account error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-primary-100 p-2 rounded-full">
          <Brain className="h-5 w-5 text-primary-500" />
        </div>
        <Link href="/" className="text-xl font-semibold text-neutral-800">
          Meu Humor
        </Link>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          {isCreatingAccount ? 'Criar Conta' : 'Login'}
        </h1>
        
        <div className="bg-blue-50 p-3 rounded-lg mb-6 flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Sua privacidade é importante. Seus dados são protegidos e nunca serão compartilhados.
          </p>
        </div>
        
        <form onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => password === '' && setPasswordFocused(false)}
              required
              disabled={loading}
            />
            
            {isCreatingAccount && (passwordFocused || password !== '') && (
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Força da senha: {getStrengthLabel(passwordStrength)}
                  </span>
                  <div className="flex space-x-1 w-24">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div 
                        key={index}
                        className={`h-1 flex-1 rounded-full ${
                          index <= passwordStrength 
                            ? getStrengthColor(passwordStrength) 
                            : 'bg-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <ul className="text-xs space-y-1 text-neutral-600">
                  <li className="flex items-center">
                    {isLongEnough(password) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <X className="h-3 w-3 text-red-500 mr-1" />}
                    Pelo menos 8 caracteres
                  </li>
                  <li className="flex items-center">
                    {hasLowerCase(password) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <X className="h-3 w-3 text-red-500 mr-1" />}
                    Pelo menos uma letra minúscula
                  </li>
                  <li className="flex items-center">
                    {hasUpperCase(password) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <X className="h-3 w-3 text-red-500 mr-1" />}
                    Pelo menos uma letra maiúscula
                  </li>
                  <li className="flex items-center">
                    {hasNumber(password) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <X className="h-3 w-3 text-red-500 mr-1" />}
                    Pelo menos um número
                  </li>
                  <li className="flex items-center">
                    {hasSpecialChar(password) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <X className="h-3 w-3 text-red-500 mr-1" />}
                    Pelo menos um caractere especial
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          {isCreatingAccount && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={confirmPassword && (passwordsMatch ? 'border-green-500' : 'border-red-500')}
                required
                disabled={loading}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <X className="h-3 w-3 mr-1" /> As senhas não coincidem
                </p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="text-green-500 text-xs mt-1 flex items-center">
                  <Check className="h-3 w-3 mr-1" /> As senhas coincidem
                </p>
              )}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || (isCreatingAccount && !canSubmitNewAccount)}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 text-white animate-spin mr-2" />
                <span>{isCreatingAccount ? 'Criando...' : 'Entrando...'}</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                <span>{isCreatingAccount ? 'Criar Conta' : 'Entrar'}</span>
              </>
            )}
          </Button>
        </form>
        
        {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setError('');
            }}
            className="text-primary-600 hover:underline transition-colors"
            disabled={loading}
          >
            {isCreatingAccount ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Crie uma'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import { OnBoardingUserData } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { User, Phone, Mail } from 'lucide-react';

interface PersonalInfoStepProps {
  userData: Partial<OnBoardingUserData>;
  onNext: (data: Partial<OnBoardingUserData>) => void;
  isSubmitting: boolean;
}

export default function PersonalInfoStep({ userData, onNext, isSubmitting }: PersonalInfoStepProps) {
  const [name, setName] = useState(userData.name || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [isAnonymous, setIsAnonymous] = useState(userData.isAnonymous || false);
  const [recoveryEmail, setRecoveryEmail] = useState(userData.recoveryEmail || '');

  // Update state when userData changes (for edit mode)
  useEffect(() => {
    setName(userData.name || '');
    setPhone(userData.phone || '');
    setIsAnonymous(userData.isAnonymous || false);
    setRecoveryEmail(userData.recoveryEmail || '');
  }, [userData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onNext({
      name: isAnonymous ? undefined : name,
      phone: isAnonymous ? undefined : phone,
      isAnonymous,
      recoveryEmail: isAnonymous ? recoveryEmail : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          Bem-vindo ao Meu Humor! 👋
        </h3>
        <p className="text-neutral-600">
          Vamos começar conhecendo você um pouco melhor. Essas informações nos ajudam a personalizar sua experiência.
        </p>
      </div>
      
      {/* Anonymous Mode Toggle */}
      <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label htmlFor="anonymous" className="text-sm font-medium text-neutral-700 cursor-pointer">
              Modo Anônimo
            </label>
            <p className="text-xs text-neutral-500 mt-0.5">
              Use o app sem compartilhar informações pessoais
            </p>
          </div>
          <Switch
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
        </div>
      </div>
      
      {!isAnonymous ? (
        <>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Nome
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required={!isAnonymous}
            />
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Telefone (opcional)
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
        </>
      ) : (
        <>
          {/* Recovery Email for anonymous users */}
          <div>
            <label htmlFor="recoveryEmail" className="block text-sm font-medium text-neutral-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email de Recuperação (opcional)
            </label>
            <Input
              id="recoveryEmail"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="seu@email.com"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Caso você perca o acesso, poderemos usar este email para recuperar sua conta
            </p>
          </div>
        </>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Continuar'}
      </Button>
    </form>
  );
}


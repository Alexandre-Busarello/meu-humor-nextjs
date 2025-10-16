'use client';

import React from 'react';
import { OnBoardingUserData } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, TrendingUp, FileText } from 'lucide-react';

interface CompletionStepProps {
  userData: Partial<OnBoardingUserData>;
  onNext: (data: Partial<OnBoardingUserData>) => void;
  isSubmitting: boolean;
}

export default function CompletionStep({ userData, onNext, isSubmitting }: CompletionStepProps) {
  const handleFinish = () => {
    onNext({});
  };

  const userName = userData.isAnonymous ? 'Usuário' : userData.name || 'Usuário';

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="p-4 bg-accent-100 rounded-full">
          <CheckCircle className="h-16 w-16 text-accent-600" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">
          Tudo pronto, {userName}! 🎉
        </h3>
        <p className="text-neutral-600">
          Seu perfil foi configurado com sucesso. Agora você pode começar a usar o Meu Humor!
        </p>
      </div>
      
      <div className="bg-primary-50 p-6 rounded-lg text-left space-y-4">
        <h4 className="font-semibold text-primary-900 mb-3">
          O que você pode fazer agora:
        </h4>
        
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-primary-900">Registrar seu humor diariamente</p>
            <p className="text-sm text-primary-700">
              Acompanhe como você se sente ao longo do tempo
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-primary-900">Receber análises por IA</p>
            <p className="text-sm text-primary-700">
              Suas notas serão enriquecidas com insights personalizados
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-primary-900">Gerar prontuários</p>
            <p className="text-sm text-primary-700">
              Crie relatórios detalhados sobre seu bem-estar emocional
            </p>
          </div>
        </div>
      </div>
      
      <Button
        onClick={handleFinish}
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Finalizando...' : 'Começar a usar'}
      </Button>
      
      <p className="text-xs text-neutral-500">
        Você pode atualizar suas informações a qualquer momento no seu perfil
      </p>
    </div>
  );
}


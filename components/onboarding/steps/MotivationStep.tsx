import React, { useState, useEffect } from 'react';
import { OnBoardingUserData } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Target, Check } from 'lucide-react';

interface MotivationStepProps {
  userData: Partial<OnBoardingUserData>;
  onNext: (data: Partial<OnBoardingUserData>) => void;
  isSubmitting: boolean;
}

interface MotivationOption {
  value: string;
  label: string;
  description: string;
}

const allOptions: MotivationOption[] = [
  {
    value: 'melhorar-humor',
    label: 'Melhorar meu humor',
    description: 'Trabalhar em ter dias melhores',
  },
  {
    value: 'gerenciar-estresse',
    label: 'Gerenciar estresse',
    description: 'Aprender a lidar com pressão do dia a dia',
  },
  {
    value: 'acompanhar-emocoes',
    label: 'Acompanhar emoções',
    description: 'Entender melhor meus padrões emocionais',
  },
  {
    value: 'recomendacao-profissional',
    label: 'Recomendação profissional',
    description: 'Indicado por terapeuta ou médico',
  },
  {
    value: 'curiosidade',
    label: 'Curiosidade',
    description: 'Quero conhecer e explorar o app',
  },
  {
    value: 'outro',
    label: 'Outro motivo',
    description: 'Tenho uma motivação diferente',
  },
];

const MotivationStep: React.FC<MotivationStepProps> = ({
  userData,
  onNext,
  isSubmitting,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(userData.goals || []);
  const [otherOption, setOtherOption] = useState(userData.motivationOther || '');
  const [additionalInfo, setAdditionalInfo] = useState(userData.additionalInfo || '');
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(!!userData.additionalInfo);

  // Update state when userData changes (for edit mode)
  useEffect(() => {
    setSelectedOptions(userData.goals || []);
    setOtherOption(userData.motivationOther || '');
    setAdditionalInfo(userData.additionalInfo || '');
    setShowAdditionalInfo(!!userData.additionalInfo);
  }, [userData]);

  const handleOptionToggle = (value: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      const data: Partial<OnBoardingUserData> = {};

      // Set primary motivation if only one is selected
      if (
        selectedOptions.length === 1 &&
        [
          'melhorar-humor',
          'gerenciar-estresse',
          'acompanhar-emocoes',
          'recomendacao-profissional',
          'curiosidade',
          'outro',
        ].includes(selectedOptions[0])
      ) {
        data.motivation = selectedOptions[0] as
          | 'melhorar-humor'
          | 'gerenciar-estresse'
          | 'acompanhar-emocoes'
          | 'recomendacao-profissional'
          | 'curiosidade'
          | 'outro';
      }

      // Store all selected options in goals
      data.goals = selectedOptions;

      if (selectedOptions.includes('outro') && otherOption) {
        data.motivationOther = otherOption;
      }

      if (showAdditionalInfo && additionalInfo.trim()) {
        data.additionalInfo = additionalInfo.trim();
      }

      onNext(data);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-2">
          O que te trouxe aqui?
        </h3>
        <p className="text-neutral-600">
          Selecione uma ou mais opções que descrevem seus objetivos
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {allOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => handleOptionToggle(option.value)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedOptions.includes(option.value)
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  selectedOptions.includes(option.value)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-neutral-300'
                }`}
              >
                {selectedOptions.includes(option.value) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-800">{option.label}</p>
                <p className="text-sm text-neutral-600 mt-0.5">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Other motivation details */}
      {selectedOptions.includes('outro') && (
        <div className="mb-6">
          <label
            htmlFor="other-motivation"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Descreva seu motivo
          </label>
          <Input
            id="other-motivation"
            value={otherOption}
            onChange={(e) => setOtherOption(e.target.value)}
            placeholder="Qual é sua motivação?"
            maxLength={100}
          />
        </div>
      )}

      {/* Additional info toggle */}
      {!showAdditionalInfo && (
        <div className="mb-6 text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAdditionalInfo(true)}
            className="text-primary-600 hover:text-primary-700"
          >
            + Adicionar informações extras (opcional)
          </Button>
        </div>
      )}

      {/* Additional info textarea */}
      {showAdditionalInfo && (
        <div className="mb-6">
          <label
            htmlFor="additional-info"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Informações adicionais (opcional)
          </label>
          <Textarea
            id="additional-info"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Há algo mais que gostaria de compartilhar sobre seus objetivos ou expectativas?"
            maxLength={500}
            className="h-24 resize-none"
          />
          <p className="text-xs text-neutral-500 text-right mt-1">
            {additionalInfo.length}/500 caracteres
          </p>
        </div>
      )}

      <div className="pt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0 || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </div>
  );
};

export default MotivationStep;


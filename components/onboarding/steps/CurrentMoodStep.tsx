'use client';

import React, { useState } from 'react';
import { OnBoardingUserData } from '@/types';
import MoodSelector from '@/components/mood/MoodSelector';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CurrentMoodStepProps {
  userData: Partial<OnBoardingUserData>;
  onNext: (data: Partial<OnBoardingUserData>) => void;
  isSubmitting: boolean;
}

export default function CurrentMoodStep({ userData, onNext, isSubmitting }: CurrentMoodStepProps) {
  const [currentMood, setCurrentMood] = useState<number | null>(
    userData.currentMood !== undefined ? userData.currentMood : null
  );
  const [moodNote, setMoodNote] = useState(userData.moodNote || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentMood === null) {
      alert('Por favor, selecione como você está se sentindo agora.');
      return;
    }
    
    onNext({
      currentMood,
      moodNote: moodNote.trim(),
    });
  };

  const handleMoodSelect = (score: number) => {
    setCurrentMood(score);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          Como você está se sentindo agora? 💭
        </h3>
        <p className="text-neutral-600">
          Vamos fazer seu primeiro registro de humor. Selecione abaixo como você está se sentindo neste momento.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Meu humor agora está...
        </label>
        <MoodSelector
          selectedMood={currentMood ?? -1}
          onSelect={handleMoodSelect}
        />
      </div>
      
      {currentMood !== null && (
        <div>
          <label htmlFor="moodNote" className="block text-sm font-medium text-neutral-700 mb-2">
            Quer adicionar algum detalhe? (opcional)
          </label>
          <Textarea
            id="moodNote"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="Ex: Estou me sentindo bem porque..."
            className="h-24 resize-none"
            maxLength={1024}
          />
          <p className="text-xs text-neutral-500 text-right mt-1">
            {moodNote.length}/1024 caracteres
          </p>
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || currentMood === null}
      >
        {isSubmitting ? 'Salvando...' : 'Continuar'}
      </Button>
    </form>
  );
}


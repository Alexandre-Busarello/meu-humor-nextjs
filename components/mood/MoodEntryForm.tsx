'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import MoodSelector from './MoodSelector';
import { moodAPI } from '@/lib/api-client';
import { dateToTimestamp } from '@/lib/utils/timezone';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

interface MoodEntryFormProps {
  onComplete: () => void;
}

const MoodEntryForm: React.FC<MoodEntryFormProps> = ({ onComplete }) => {
  const [selectedMood, setSelectedMood] = useState<number>(-1);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [usePastDate, setUsePastDate] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>(
    format(new Date(), 'HH:mm')
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMood === -1) {
      setError('Por favor, selecione seu humor');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      let timestamp: number;
      
      if (usePastDate) {
        // Combine date and time
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const dateTime = new Date(selectedDate);
        dateTime.setHours(hours, minutes, 0, 0);
        
        // Validate: no future dates
        if (dateTime.getTime() > Date.now()) {
          setError('Não é possível registrar humor para datas futuras.');
          setIsSubmitting(false);
          return;
        }
        
        timestamp = dateToTimestamp(dateTime);
      } else {
        timestamp = Date.now();
      }
      
      await moodAPI.create({
        timestamp,
        score: selectedMood,
        note: note.trim()
      });
      
      // Reset form and notify parent
      setSelectedMood(-1);
      setNote('');
      setUsePastDate(false);
      setSelectedDate(new Date());
      setSelectedTime(format(new Date(), 'HH:mm'));
      onComplete();
    } catch (error) {
      console.error('Error saving mood entry:', error);
      setError('Erro ao salvar registro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
      
      {selectedMood !== -1 && (
        <>
          {/* Past date toggle */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label htmlFor="past-date" className="text-sm font-medium text-neutral-700 cursor-pointer">
                  Registrar para data/hora passada
                </label>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Ative para escolher uma data e horário específico
                </p>
              </div>
              <Switch
                id="past-date"
                checked={usePastDate}
                onCheckedChange={setUsePastDate}
              />
            </div>
            
            {usePastDate && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Data
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => date && setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    locale={ptBR}
                    className="input w-full"
                    wrapperClassName="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Horário
                  </label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 mb-6">
            <label htmlFor="note" className="block text-sm font-medium text-neutral-700 mb-1">
              Quer adicionar algum detalhe? (opcional)
            </label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1024}
              placeholder="Ex: Estou ansioso com uma reunião..."
              className="h-24 resize-none"
            />
            <p className="text-xs text-neutral-500 text-right mt-1">
              {note.length}/1024 caracteres
            </p>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar registro'}
          </Button>
        </>
      )}
    </form>
  );
};

export default MoodEntryForm;


'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoodEntry } from '@/types';
import { timestampToDate, dateToTimestamp } from '@/lib/utils/timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MoodSelector from './MoodSelector';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, X, Calendar, Clock, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface EditableMoodEntryCardProps {
  entry: MoodEntry;
  onSave: (id: string, updatedEntry: Partial<MoodEntry>) => void;
  onCancel: () => void;
}

const EditableMoodEntryCard: React.FC<EditableMoodEntryCardProps> = ({
  entry,
  onSave,
  onCancel,
}) => {
  const entryDate = timestampToDate(entry.timestamp);
  
  const [score, setScore] = useState(entry.score);
  const [note, setNote] = useState(entry.note);
  const [selectedDate, setSelectedDate] = useState<Date>(entryDate);
  const [selectedTime, setSelectedTime] = useState(
    format(entryDate, 'HH:mm')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState(false);
  
  // Check if score or note changed (will trigger AI regeneration)
  const scoreChanged = score !== entry.score;
  const noteChanged = note !== entry.note;
  const willRegenerateAI = (scoreChanged || noteChanged) && note.trim().length > 0;

  const handleSave = async () => {
    setIsSaving(true);
    
    // Combine date and time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0);
    
    // Validate: no future dates
    if (newDate.getTime() > Date.now()) {
      alert('Não é possível registrar humor para datas futuras.');
      setIsSaving(false);
      return;
    }
    
    const timestamp = dateToTimestamp(newDate);
    
    await onSave(entry.id, {
      score,
      note,
      timestamp,
    });
    
    setIsSaving(false);
  };

  return (
    <div className="card border-2 border-primary-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-800">Editando Humor</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || score === -1}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Como você estava se sentindo?
          </label>
          <MoodSelector selectedMood={score} onSelect={setScore} showLabel={false} />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Nota (opcional)
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Adicione detalhes sobre como você estava se sentindo..."
            className="h-24 resize-none"
            maxLength={1024}
          />
          <p className="text-xs text-neutral-500 text-right mt-1">
            {note.length}/1024 caracteres
          </p>
        </div>

        {/* Regeneration Warning */}
        {willRegenerateAI && entry.ai_analysis && (
          <div className="pt-4 border-t border-neutral-200">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Brain className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Análise de IA será regerada
                </p>
                <p className="text-xs text-amber-700">
                  Como você alterou o {scoreChanged && noteChanged ? 'humor e a nota' : scoreChanged ? 'humor' : 'nota'}, 
                  a análise complementar por IA será atualizada automaticamente após salvar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Section (Read-only) */}
        {entry.ai_analysis !== undefined && (
          <div className="pt-4 border-t border-neutral-200">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <Brain size={14} className="text-indigo-600" />
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                    Análise complementar por IA
                  </span>
                </div>
                {entry.ai_analysis && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedAnalysis(!expandedAnalysis)}
                    className="h-6 px-2 text-indigo-700 hover:text-indigo-900"
                  >
                    {expandedAnalysis ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              
              {entry.ai_analysis ? (
                <div className={`text-sm text-neutral-700 leading-relaxed ${!expandedAnalysis ? 'line-clamp-3' : ''}`}>
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:my-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {entry.ai_analysis}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-indigo-600">
                  <div className="animate-pulse flex items-center gap-2">
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2">Análise sendo gerada...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableMoodEntryCard;


'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoodEntry } from '@/types';
import { getMoodEmoji, getMoodText } from '@/lib/utils/moodUtils';
import { timestampToDate } from '@/lib/utils/timezone';
import { Trash2, Edit, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MoodEntryCardProps {
  entry: MoodEntry;
  onEdit?: (entry: MoodEntry) => void;
  onDelete?: (id: string) => void;
}

const MoodEntryCard: React.FC<MoodEntryCardProps> = ({ entry, onEdit, onDelete }) => {
  const [expandedAnalysis, setExpandedAnalysis] = useState(false);
  const date = timestampToDate(entry.timestamp);
  const formattedDate = format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
  const formattedTime = format(date, 'HH:mm', { locale: ptBR });

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-3xl">{getMoodEmoji(entry.score)}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-neutral-800">{getMoodText(entry.score)}</h3>
              <span className="text-sm text-neutral-500">({entry.score}/5)</span>
            </div>
            <p className="text-sm text-neutral-500 mb-2">
              {formattedDate} às {formattedTime}
            </p>
            {entry.note && (
              <p className="text-neutral-700 mt-2">{entry.note}</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry)}
              aria-label="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry.id)}
              className="text-red-500 hover:text-red-600"
              aria-label="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* AI Analysis Section */}
      {entry.ai_analysis !== undefined && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
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
  );
};

export default MoodEntryCard;


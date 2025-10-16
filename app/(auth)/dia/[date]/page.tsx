'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { moodAPI } from '@/lib/api-client';
import { MoodEntry } from '@/types';
import { getStartOfDay, getEndOfDay } from '@/lib/utils/timezone';
import MoodEntryCard from '@/components/mood/MoodEntryCard';
import EditableMoodEntryCard from '@/components/mood/EditableMoodEntryCard';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuthToken } from '@/components/providers/AuthTokenProvider';

export default function DayViewPage() {
  const { isTokenReady } = useAuthToken();
  const params = useParams();
  const router = useRouter();
  const dateParam = params.date as string;
  
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Parse date from URL parameter (format: YYYY-MM-DD)
  // Add 'T00:00:00' to avoid timezone issues with date-only strings
  const currentDate = new Date(dateParam + 'T00:00:00');
  const isToday = format(new Date(), 'yyyy-MM-dd') === dateParam;
  const isFuture = currentDate > new Date();
  
  const fetchDayEntries = useCallback(async () => {
    try {
      setLoading(true);
      // Parse date in local timezone to avoid day shift
      const [year, month, day] = dateParam.split('-').map(Number);
      const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      const timestamp = localDate.getTime();
      const startTimestamp = getStartOfDay(timestamp);
      const endTimestamp = getEndOfDay(timestamp);
      
      const data = await moodAPI.getByDateRange(startTimestamp, endTimestamp);
      // Sort by timestamp descending (most recent first)
      const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
      setEntries(sorted);
    } catch (err) {
      console.error('Error fetching day entries:', err);
      setError('Erro ao carregar humores do dia');
    } finally {
      setLoading(false);
    }
  }, [dateParam]);
  
  useEffect(() => {
    // Wait for token to be ready
    if (isTokenReady) {
      fetchDayEntries();
    }
  }, [dateParam, isTokenReady, fetchDayEntries]);
  
  const handleEdit = (entry: MoodEntry) => {
    setEditingId(entry.id);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  const handleSaveEdit = async (id: string, updatedEntry: Partial<MoodEntry>) => {
    try {
      await moodAPI.update(id, updatedEntry);
      // Update local state
      setEntries(entries.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      ));
      setEditingId(null);
      toast.success('Humor atualizado com sucesso!');
    } catch (err) {
      console.error('Error updating mood entry:', err);
      toast.error('Erro ao atualizar registro. Tente novamente.');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }
    
    try {
      await moodAPI.delete(id);
      setEntries(entries.filter(entry => entry.id !== id));
      toast.success('Humor excluído com sucesso!');
    } catch (err) {
      console.error('Error deleting mood entry:', err);
      toast.error('Erro ao excluir registro. Tente novamente.');
    }
  };
  
  const navigateToPreviousDay = () => {
    const prevDay = subDays(currentDate, 1);
    router.push(`/dia/${format(prevDay, 'yyyy-MM-dd')}`);
  };
  
  const navigateToNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    // Don't allow navigation to future dates
    if (nextDay <= new Date()) {
      router.push(`/dia/${format(nextDay, 'yyyy-MM-dd')}`);
    }
  };
  
  const navigateToToday = () => {
    router.push(`/dia/${format(new Date(), 'yyyy-MM-dd')}`);
  };
  
  // Calculate average mood for the day
  const averageMood = entries.length > 0
    ? (entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length).toFixed(1)
    : null;
  
  const formattedDate = format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  if (loading) {
    return (
      <div className="container-responsive py-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
          <p className="text-neutral-600">Carregando humores do dia...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-responsive py-6">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToPreviousDay}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Dia anterior
          </Button>
          
          {!isToday && (
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToToday}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Hoje
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToNextDay}
            disabled={isFuture || isToday}
          >
            Próximo dia
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 capitalize">
            {formattedDate}
          </h1>
          {averageMood && (
            <p className="text-neutral-600 mt-2">
              Humor médio do dia: <span className="font-semibold text-primary-600">{averageMood}/5</span>
            </p>
          )}
        </div>
      </div>
      
      {/* Add Mood Button */}
      <div className="mb-6">
        <Link href="/registrar">
          <Button className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar humor neste dia
          </Button>
        </Link>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="card mb-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={fetchDayEntries} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      )}
      
      {/* Entries List */}
      {!error && entries.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-neutral-400 mb-4">
            <Calendar className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800 mb-2">
            Nenhum humor registrado neste dia
          </h3>
          <p className="text-neutral-600 mb-4">
            Adicione um registro para começar a acompanhar seu humor.
          </p>
          <Link href="/registrar">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Registrar humor
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {editingId === entry.id ? (
                <EditableMoodEntryCard
                  entry={entry}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <MoodEntryCard
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Back to History Link */}
      <div className="mt-8 text-center">
        <Link href="/historico">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar ao histórico completo
          </Button>
        </Link>
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { moodAPI } from '@/lib/api-client';
import { MoodEntry } from '@/types';
import MoodEntryCard from '@/components/mood/MoodEntryCard';
import EditableMoodEntryCard from '@/components/mood/EditableMoodEntryCard';
import { Loader2, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuthToken } from '@/components/providers/AuthTokenProvider';
import { timestampToDate } from '@/lib/utils/timezone';

export default function HistoryPage() {
  const { isTokenReady } = useAuthToken();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Wait for token to be ready
    if (isTokenReady) {
      fetchEntries();
    }
  }, [isTokenReady]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await moodAPI.getAll();
      // Sort by timestamp descending (most recent first)
      const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
      setEntries(sorted);
    } catch (err) {
      console.error('Error fetching mood entries:', err);
      setError('Erro ao carregar histórico de humor');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="container-responsive py-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Histórico</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
          <p className="text-neutral-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Histórico</h1>
        <div className="card">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <Button onClick={fetchEntries} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // Group entries by day (using timezone-aware functions)
  const entriesByDay = entries.reduce((acc, entry) => {
    const entryDate = timestampToDate(entry.timestamp);
    const dayKey = format(entryDate, 'yyyy-MM-dd');
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(entry);
    return acc;
  }, {} as Record<string, MoodEntry[]>);

  const days = Object.keys(entriesByDay).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="container-responsive py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Histórico</h1>
        <p className="text-neutral-600">{entries.length} registros</p>
      </div>

      {entries.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-neutral-600 mb-4">
            Você ainda não tem registros de humor.
          </p>
          <Button onClick={() => window.location.href = '/registrar'}>
            Registrar agora
          </Button>
        </div>
      ) : (
        <>
          {/* Days Summary */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              <Calendar className="inline h-5 w-5 mr-2" />
              Visualizar por dia
            </h2>
            <div className="space-y-2">
              {days.slice(0, 7).map((day) => {
                const dayEntries = entriesByDay[day];
                const avgMood = (
                  dayEntries.reduce((sum, e) => sum + e.score, 0) / dayEntries.length
                ).toFixed(1);
                // Parse date correctly to avoid timezone issues
                const [year, month, dayNum] = day.split('-').map(Number);
                const dayDate = new Date(year, month - 1, dayNum);
                const isToday = format(new Date(), 'yyyy-MM-dd') === day;
                
                return (
                  <Link key={day} href={`/dia/${day}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer">
                      <div>
                        <p className="font-medium text-neutral-800">
                          {isToday ? 'Hoje' : format(dayDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {dayEntries.length} {dayEntries.length === 1 ? 'registro' : 'registros'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-primary-600">
                          {avgMood}/5
                        </span>
                        <ChevronRight className="h-5 w-5 text-neutral-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {days.length > 7 && (
              <p className="text-sm text-neutral-500 mt-4 text-center">
                Mostrando os últimos 7 dias com registros
              </p>
            )}
          </div>

          {/* All Entries */}
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Todos os registros
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
        </>
      )}
    </div>
  );
}


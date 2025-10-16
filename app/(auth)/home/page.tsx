'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { moodAPI, onboardingAPI } from '@/lib/api-client';
import { MoodEntry } from '@/types';
import MoodChart from '@/components/mood/MoodChart';
import WeeklySummary from '@/components/shared/WeeklySummary';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, FileText, History } from 'lucide-react';
import { useAuthToken } from '@/components/providers/AuthTokenProvider';

export default function HomePage() {
  const { data: session } = useSession();
  const { isTokenReady } = useAuthToken();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingRequired, setOnboardingRequired] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const status = await onboardingAPI.getStatus();
        // Show onboarding if user hasn't completed it
        if (!status.isComplete) {
          setShowOnboarding(true);
          setOnboardingRequired(!status.hasSeenOnBoarding);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
      }
    };

    // Wait for token to be ready
    if (isTokenReady) {
      checkOnboarding();
    }
  }, [isTokenReady]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const startDate = Date.now() - (7 * 24 * 60 * 60 * 1000); // Last 7 days
        const endDate = Date.now();
        const data = await moodAPI.getByDateRange(startDate, endDate);
        setEntries(data);
      } catch (err) {
        console.error('Error fetching mood entries:', err);
        setError('Erro ao carregar seus registros de humor');
      } finally {
        setLoading(false);
      }
    };

    // Wait for token to be ready
    if (isTokenReady) {
      fetchEntries();
    }
  }, [isTokenReady]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    // Refresh entries after onboarding (might have initial mood)
    window.location.reload();
  };

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        isRequired={onboardingRequired}
      />
      
      <div className="container-responsive py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
              Olá, {session?.user?.email?.split('@')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-neutral-600 mt-1">Como está seu humor hoje?</p>
          </div>
        </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6"
      >
        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/registrar" className="block">
              <Button className="w-full" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Registrar Humor
              </Button>
            </Link>
            <Link href="/historico" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <History className="h-5 w-5 mr-2" />
                Ver Histórico
              </Button>
            </Link>
            <Link href="/prontuarios" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <FileText className="h-5 w-5 mr-2" />
                Prontuários
              </Button>
            </Link>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Seu humor na semana</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : entries && entries.length > 0 ? (
            <MoodChart entries={entries} loading={loading} />
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 mb-4">
                Você ainda não registrou seu humor esta semana.
              </p>
              <Link href="/registrar">
                <Button>Registrar agora</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Weekly Summary */}
        {!loading && entries.length > 0 && (
          <WeeklySummary entries={entries} />
        )}
      </motion.div>
      </div>
    </>
  );
}


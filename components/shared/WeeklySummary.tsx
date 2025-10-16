'use client';

import React, { useEffect, useState } from 'react';
import { MoodEntry } from '@/types';
import { generateWeeklySummary } from '@/lib/utils/moodUtils';
import { recommendationsAPI } from '@/lib/api-client';
import { TrendingUp, TrendingDown, Calendar, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WeeklySummaryProps {
  entries: MoodEntry[];
}

interface CachedRecommendation {
  recommendation: string;
  timestamp: number;
  entriesCount: number;
  lastEntryTimestamp: number;
}

const CACHE_KEY = 'weekly-recommendation-cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ entries }) => {
  const summary = generateWeeklySummary(entries);
  const [recommendation, setRecommendation] = useState<string>(summary.recommendation);
  const [isLoadingRec, setIsLoadingRec] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAIRecommendation, setIsAIRecommendation] = useState(false);

  useEffect(() => {
    // Fetch AI recommendation on mount with caching
    const fetchRecommendation = async () => {
      if (entries.length < 7) return;

      try {
        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        const lastEntryTimestamp = entries.length > 0 
          ? Math.max(...entries.map(e => e.timestamp))
          : 0;

        if (cachedData) {
          const cached: CachedRecommendation = JSON.parse(cachedData);
          const now = Date.now();
          const cacheAge = now - cached.timestamp;
          
          // Use cache if:
          // 1. Cache is less than 24h old AND
          // 2. No new entries since cache was created
          if (
            cacheAge < CACHE_DURATION &&
            cached.lastEntryTimestamp >= lastEntryTimestamp
          ) {
            setRecommendation(cached.recommendation);
            setIsAIRecommendation(true);
            return;
          }
        }

        // Cache miss or expired - fetch new recommendation
        setIsLoadingRec(true);
        const { recommendation: aiRec } = await recommendationsAPI.get();
        setRecommendation(aiRec);
        setIsAIRecommendation(true);

        // Save to cache
        const cacheData: CachedRecommendation = {
          recommendation: aiRec,
          timestamp: Date.now(),
          entriesCount: entries.length,
          lastEntryTimestamp,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (error) {
        console.error('Error fetching recommendation:', error);
        // Keep the static recommendation
      } finally {
        setIsLoadingRec(false);
      }
    };

    fetchRecommendation();
  }, [entries.length, entries]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const { recommendation: newRec } = await recommendationsAPI.refresh();
      setRecommendation(newRec);
      setIsAIRecommendation(true);

      // Update cache with new recommendation
      const lastEntryTimestamp = entries.length > 0 
        ? Math.max(...entries.map(e => e.timestamp))
        : 0;
      const cacheData: CachedRecommendation = {
        recommendation: newRec,
        timestamp: Date.now(),
        entriesCount: entries.length,
        lastEntryTimestamp,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      toast.success('Recomendação atualizada!');
    } catch (error) {
      console.error('Error refreshing recommendation:', error);
      toast.error('Erro ao atualizar recomendação.');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (summary.averageMood === -1) {
    return null;
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">Resumo da Semana</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-primary-50 p-4 rounded-lg">
          <p className="text-sm text-neutral-600 mb-1">Humor Médio</p>
          <p className="text-2xl font-bold text-primary-600">
            {summary.averageMood.toFixed(1)}/5
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-neutral-600">Melhor Dia</p>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-lg font-bold text-green-600">
            {summary.bestDay.date}
          </p>
          <p className="text-sm text-neutral-500">
            {summary.bestDay.score.toFixed(1)}/5
          </p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-neutral-600">Pior Dia</p>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-lg font-bold text-red-600">
            {summary.worstDay.date}
          </p>
          <p className="text-sm text-neutral-500">
            {summary.worstDay.score.toFixed(1)}/5
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-blue-900">Recomendação</p>
                {isAIRecommendation && (
                  <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    <Sparkles className="h-3 w-3" />
                    IA
                  </span>
                )}
              </div>
              {isLoadingRec ? (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-pulse flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2">Gerando recomendação...</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-blue-800">{recommendation}</p>
              )}
            </div>
          </div>
          {isAIRecommendation && !isLoadingRec && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="ml-2 h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              title="Atualizar recomendação"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;


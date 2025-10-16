import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoodEntry, WeeklySummary } from '@/types';
import { timestampToDate, getStartOfDay, getEndOfDay } from './timezone';

// Get emoji for mood score
export const getMoodEmoji = (score: number): string => {
  const emojis = ['😢', '😔', '😐', '🙂', '😊', '🥰'];
  return emojis[score] || '😐';
};

// Get text description for mood score
export const getMoodText = (score: number): string => {
  const descriptions = [
    'Muito mal',
    'Mal',
    'Neutro',
    'Bem',
    'Muito bem',
    'Excelente'
  ];
  return descriptions[score] || 'Neutro';
};

// Get color for mood score
export const getMoodColor = (score: number): string => {
  const colors = [
    'rgb(239, 68, 68)', // red-500
    'rgb(249, 115, 22)', // orange-500
    'rgb(234, 179, 8)', // yellow-500
    'rgb(34, 197, 94)', // green-500
    'rgb(59, 130, 246)', // blue-500
    'rgb(139, 92, 246)' // purple-500
  ];
  return colors[score] || colors[2];
};

// Generate data for the weekly mood chart
export const getWeeklyChartData = (entries: MoodEntry[]): {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
  }[];
} => {
  const labels: string[] = [];
  const data: number[] = [];
  const backgroundColors: string[] = [];
  const hasDataForDay: boolean[] = [];
  
  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, 'EEE', { locale: ptBR });
    labels.push(formattedDate);
    
    // Get average mood for this day (using timezone-aware functions)
    const dayTimestamp = date.getTime();
    const dayStart = getStartOfDay(dayTimestamp);
    const dayEnd = getEndOfDay(dayTimestamp);
    
    const dayEntries = entries.filter(entry => {
      return entry.timestamp >= dayStart && entry.timestamp <= dayEnd;
    });
    
    if (dayEntries.length === 0) {
      data.push(0);
      backgroundColors.push('rgba(203, 213, 225, 0.5)');
      hasDataForDay.push(false);
    } else {
      const sum = dayEntries.reduce((acc, entry) => acc + entry.score, 0);
      const average = sum / dayEntries.length;
      
      // Shift scale: score + 1 (0 -> 1, 1 -> 2, ..., 5 -> 6)
      data.push(average + 1);
      
      const roundedAverage = Math.round(average);
      backgroundColors.push(getMoodColor(roundedAverage));
      hasDataForDay.push(true);
    }
  }
  
  const hasValidData = data.some((value, index) => hasDataForDay[index]);
  
  if (!hasValidData) {
    return {
      labels,
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: Array(7).fill('rgba(203, 213, 225, 0.5)'),
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 1
        }
      ]
    };
  }
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1
      }
    ]
  };
};

// Generate weekly summary
export const generateWeeklySummary = (entries: MoodEntry[]): WeeklySummary => {
  if (entries.length === 0) {
    return {
      averageMood: -1,
      bestDay: { date: '', score: -1 },
      worstDay: { date: '', score: -1 },
      recommendation: 'Comece a registrar seu humor para receber recomendações personalizadas.'
    };
  }
  
  // Calculate average mood
  const sum = entries.reduce((acc, entry) => acc + entry.score, 0);
  const averageMood = sum / entries.length;
  
  // Group entries by day
  const entriesByDay: Record<string, MoodEntry[]> = {};
  
  entries.forEach(entry => {
    const date = format(timestampToDate(entry.timestamp), 'yyyy-MM-dd');
    if (!entriesByDay[date]) {
      entriesByDay[date] = [];
    }
    entriesByDay[date].push(entry);
  });
  
  // Calculate daily averages
  const dailyAverages = Object.keys(entriesByDay).map(date => {
    const dayEntries = entriesByDay[date];
    const daySum = dayEntries.reduce((acc, entry) => acc + entry.score, 0);
    const average = daySum / dayEntries.length;
    return {
      date,
      score: average
    };
  });
  
  // Find best and worst days
  let bestDay = dailyAverages[0];
  let worstDay = dailyAverages[0];
  
  dailyAverages.forEach(day => {
    if (day.score > bestDay.score) {
      bestDay = day;
    }
    if (day.score < worstDay.score) {
      worstDay = day;
    }
  });
  
  // Format dates - Add time to avoid timezone issues
  const formatDate = (dateStr: string) => {
    // Add T12:00:00 to force local time interpretation at noon
    const date = new Date(dateStr + 'T12:00:00');
    return format(date, 'dd/MM', { locale: ptBR });
  };
  
  // Generate recommendation based on average mood
  let recommendation = '';
  if (averageMood < 2) {
    recommendation = 'Sua semana foi desafiadora. Considere praticar técnicas de respiração profunda e buscar apoio de amigos ou familiares.';
  } else if (averageMood < 3) {
    recommendation = 'Tente incluir pequenos momentos de alegria no seu dia. Uma caminhada de 15 minutos pode ajudar a melhorar seu humor.';
  } else if (averageMood < 4) {
    recommendation = 'Você está indo bem! Continue com suas práticas atuais e considere adicionar meditação mindfulness para fortalecer seu bem-estar.';
  } else {
    recommendation = 'Excelente semana! Aproveite esse momento positivo para fortalecer hábitos saudáveis e compartilhar sua energia com os outros.';
  }
  
  return {
    averageMood,
    bestDay: {
      date: formatDate(bestDay.date),
      score: bestDay.score
    },
    worstDay: {
      date: formatDate(worstDay.date),
      score: worstDay.score
    },
    recommendation
  };
};


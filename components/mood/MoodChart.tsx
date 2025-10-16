'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MoodEntry } from '@/types';
import { getWeeklyChartData } from '@/lib/utils/moodUtils';
import { Loader2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MoodChartProps {
  entries: MoodEntry[];
  loading?: boolean;
}

const MoodChart: React.FC<MoodChartProps> = ({ entries, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const chartData = getWeeklyChartData(entries);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { y: number | null } }) {
            const value = context.parsed.y;
            if (value === null || value === 0) return 'Sem registro';
            // Subtract 1 because we added 1 to shift the scale
            const originalValue = Math.round(value - 1);
            const labels = ['Muito mal', 'Mal', 'Neutro', 'Bem', 'Muito bem', 'Excelente'];
            return labels[originalValue] || 'Neutro';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 7, // 6 + 1 (shifted scale)
        ticks: {
          stepSize: 1,
          callback: function(value: string | number) {
            // Don't show ticks for the shifted scale
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            if (numValue === 0) return 'Sem registro';
            if (numValue === 1) return 'Muito mal';
            if (numValue === 2) return 'Mal';
            if (numValue === 3) return 'Neutro';
            if (numValue === 4) return 'Bem';
            if (numValue === 5) return 'Muito bem';
            if (numValue === 6) return 'Excelente';
            return '';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="w-full" style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MoodChart;


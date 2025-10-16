import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to locale string
 */
export function formatDate(date: Date | number | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date to short locale string
 */
export function formatDateShort(date: Date | number | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Format a timestamp to time string
 */
export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get mood label from score
 */
export function getMoodLabel(score: number): string {
  if (score <= 1) return 'Muito ruim';
  if (score <= 2) return 'Ruim';
  if (score <= 3) return 'Neutro';
  if (score <= 4) return 'Bom';
  return 'Muito bom';
}

/**
 * Get mood emoji from score
 */
export function getMoodEmoji(score: number): string {
  if (score <= 1) return '😢';
  if (score <= 2) return '😕';
  if (score <= 3) return '😐';
  if (score <= 4) return '🙂';
  return '😄';
}

/**
 * Get mood color from score (Tailwind classes)
 */
export function getMoodColor(score: number): string {
  if (score <= 1) return 'text-red-500';
  if (score <= 2) return 'text-orange-500';
  if (score <= 3) return 'text-yellow-500';
  if (score <= 4) return 'text-green-500';
  return 'text-emerald-500';
}

/**
 * Calculate average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}


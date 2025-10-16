import { prisma } from '@/lib/prisma';
import { getCached, invalidateCache } from '@/lib/redis';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface CreateMoodEntryData {
  score: number; // 0-5
  note: string;
  timestamp?: number; // Optional, defaults to now
}

export interface UpdateMoodEntryData {
  score?: number;
  note?: string;
  timestamp?: number;
  aiAnalysis?: string;
}

export interface DateRangeQuery {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export class MoodService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. AI enrichment will be disabled.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }
  /**
   * Get all mood entries for a user
   */
  async getAllEntries(userId: string) {
    const cacheKey = `mood:entries:${userId}`;
    
    return getCached(cacheKey, 300, async () => {
      // Cache for 5 minutes
      return prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
      });
    });
  }
  
  /**
   * Get mood entries for a specific date range
   */
  async getEntriesByDateRange(
    userId: string,
      startDate: string | number,
    endDate: string | number
  ) {
    // Convert to timestamps (handle both string dates and timestamps)
    let startTimestamp: number;
    let endTimestamp: number;
    
    if (typeof startDate === 'number') {
      startTimestamp = startDate;
    } else {
      startTimestamp = new Date(startDate).getTime();
    }
    
    if (typeof endDate === 'number') {
      endTimestamp = endDate;
    } else {
      const date = new Date(endDate);
      date.setHours(23, 59, 59, 999);
      endTimestamp = date.getTime();
    }
    
    // Validate timestamps
    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      throw new Error('Invalid date range provided');
    }
    
    const cacheKey = `mood:entries:${userId}:${startTimestamp}:${endTimestamp}`;
    
    return getCached(cacheKey, 300, async () => {
      return prisma.moodEntry.findMany({
        where: {
          userId,
          timestamp: {
            gte: BigInt(startTimestamp),
            lte: BigInt(endTimestamp),
          },
        },
        orderBy: { timestamp: 'desc' },
      });
    });
  }
  
  /**
   * Get a single mood entry by ID
   */
  async getEntryById(entryId: string, userId: string) {
    const entry = await prisma.moodEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
    });
    
    if (!entry) {
      throw new Error('Mood entry not found');
    }
    
    return entry;
  }
  
  /**
   * Create a new mood entry
   */
  async createEntry(userId: string, data: CreateMoodEntryData) {
    const { score, note, timestamp = Date.now() } = data;
    
    // Validation
    if (score < 0 || score > 5) {
      throw new Error('Score must be between 0 and 5');
    }
    
    const entry = await prisma.moodEntry.create({
      data: {
        userId,
        score,
        note,
        timestamp: BigInt(timestamp),
      },
    });
    
    // Invalidate cache
    await this.invalidateUserCache(userId);
    
    // Enrich note with AI asynchronously (don't wait for it)
    if (note && note.trim().length > 0) {
      this.enrichNoteWithAI(entry.id, note, score).catch(err => {
        console.error('Error enriching note with AI:', err);
      });
    }
    
    return entry;
  }
  
  /**
   * Update a mood entry
   */
  async updateEntry(
    entryId: string,
    userId: string,
    data: UpdateMoodEntryData
  ) {
    // Verify ownership and get current entry
    const currentEntry = await this.getEntryById(entryId, userId);
    
    // Validation
    if (data.score !== undefined && (data.score < 0 || data.score > 5)) {
      throw new Error('Score must be between 0 and 5');
    }
    
    const updateData: any = {};
    if (data.score !== undefined) updateData.score = data.score;
    if (data.note !== undefined) updateData.note = data.note;
    if (data.timestamp !== undefined) updateData.timestamp = BigInt(data.timestamp);
    if (data.aiAnalysis !== undefined) updateData.aiAnalysis = data.aiAnalysis;
    
    // Check if score or note changed (need to regenerate AI analysis)
    const scoreChanged = data.score !== undefined && data.score !== currentEntry.score;
    const noteChanged = data.note !== undefined && data.note !== currentEntry.note;
    
    if (scoreChanged || noteChanged) {
      // Clear AI analysis - it will be regenerated
      updateData.aiAnalysis = null;
      console.log(`🔄 Score or note changed for entry ${entryId}, clearing AI analysis for regeneration`);
    }
    
    const entry = await prisma.moodEntry.update({
      where: { id: entryId },
      data: updateData,
    });
    
    // Invalidate cache
    await this.invalidateUserCache(userId);
    
    // Regenerate AI analysis asynchronously if score or note changed
    if ((scoreChanged || noteChanged) && entry.note && entry.note.trim().length > 0) {
      const newScore = data.score !== undefined ? data.score : currentEntry.score;
      const newNote = data.note !== undefined ? data.note : currentEntry.note;
      
      console.log(`🤖 Regenerating AI analysis for entry ${entryId}`);
      this.enrichNoteWithAI(entry.id, newNote, newScore).catch(err => {
        console.error('Error regenerating AI analysis:', err);
      });
    }
    
    return entry;
  }
  
  /**
   * Delete a mood entry
   */
  async deleteEntry(entryId: string, userId: string) {
    // Verify ownership
    await this.getEntryById(entryId, userId);
    
    await prisma.moodEntry.delete({
      where: { id: entryId },
    });
    
    // Invalidate cache
    await this.invalidateUserCache(userId);
  }
  
  /**
   * Get daily average for a specific day
   */
  async getDailyAverage(userId: string, date: string) {
    const startTimestamp = new Date(date).getTime();
    const endTimestamp = new Date(date).setHours(23, 59, 59, 999);
    
    const entries = await prisma.moodEntry.findMany({
      where: {
        userId,
        timestamp: {
          gte: BigInt(startTimestamp),
          lte: BigInt(endTimestamp),
        },
      },
    });
    
    if (entries.length === 0) {
      return 0;
    }
    
    const sum = entries.reduce((acc, entry) => acc + entry.score, 0);
    return sum / entries.length;
  }
  
  /**
   * Check for concerning patterns (low mood for consecutive days)
   */
  async hasConcerningPattern(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startTimestamp = startDate.getTime();
    
    const entries = await prisma.moodEntry.findMany({
      where: {
        userId,
        timestamp: {
          gte: BigInt(startTimestamp),
        },
      },
      orderBy: { timestamp: 'asc' },
    });
    
    if (entries.length < 5) {
      return false; // Not enough data
    }
    
    // Check if average score is below 2 (concerning threshold)
    const averageScore =
      entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length;
    
    if (averageScore < 2) {
      return true;
    }
    
    // Check for 3+ consecutive days with score <= 2
    let consecutiveLowDays = 0;
    for (const entry of entries) {
      if (entry.score <= 2) {
        consecutiveLowDays++;
        if (consecutiveLowDays >= 3) {
          return true;
        }
      } else {
        consecutiveLowDays = 0;
      }
    }
    
    return false;
  }
  
  /**
   * Enrich a mood note with AI analysis
   */
  private async enrichNoteWithAI(entryId: string, note: string, score: number): Promise<void> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return; // Skip if no API key
      }
      
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
      
      const moodDescriptions = [
        'muito mal',
        'mal',
        'neutro/ok',
        'bem',
        'muito bem',
        'excelente'
      ];
      const moodText = moodDescriptions[score] || 'neutro';
      
      const prompt = `Você é um psicólogo empático e experiente. Um paciente registrou seu humor como "${moodText}" (${score}/5) com a seguinte nota:

"${note}"

Expanda esta nota em uma análise complementar mais detalhada e estruturada (máximo 200 palavras). Inclua:
- Validação do sentimento expresso
- Insights sobre possíveis causas ou contextos
- Uma observação construtiva ou encorajadora

Use tom empático e profissional. Escreva em primeira pessoa falando com o paciente (use "você"). Use markdown para formatação se necessário.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiAnalysis = response.text();
      
      // Update the entry with AI analysis
      await prisma.moodEntry.update({
        where: { id: entryId },
        data: { aiAnalysis },
      });
      
      console.log(`AI analysis generated for entry ${entryId}`);
    } catch (error) {
      console.error('Error in enrichNoteWithAI:', error);
      throw error;
    }
  }
  
  /**
   * Invalidate all cache for a user
   */
  private async invalidateUserCache(userId: string) {
    await invalidateCache(`mood:entries:${userId}*`);
  }
}


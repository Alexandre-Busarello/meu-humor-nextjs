import { Request, Response, NextFunction } from 'express';
import { MoodService } from '../services/mood.service';
import { AppError } from '../middleware/error-handler';

const moodService = new MoodService();

export class MoodController {
  /**
   * GET /api/mood-entries
   * Get all mood entries for the authenticated user
   */
  async getAllEntries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const entries = await moodService.getAllEntries(req.userId);
      
      // Convert BigInt to number for JSON serialization
      const serialized = entries.map((entry) => ({
        ...entry,
        timestamp: Number(entry.timestamp),
        ai_analysis: entry.aiAnalysis, // Map to snake_case for frontend
      }));
      
      res.json(serialized);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/mood-entries/date-range
   * Get mood entries for a specific date range
   */
  async getEntriesByDateRange(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        throw new AppError(400, 'startDate and endDate query parameters are required');
      }
      
      // Convert to number if it's a numeric string (timestamp)
      const parseDate = (date: string): string | number => {
        const num = Number(date);
        return isNaN(num) ? date : num;
      };
      
      const entries = await moodService.getEntriesByDateRange(
        req.userId,
        parseDate(startDate as string),
        parseDate(endDate as string)
      );
      
      // Convert BigInt to number for JSON serialization
      const serialized = entries.map((entry) => ({
        ...entry,
        timestamp: Number(entry.timestamp),
        ai_analysis: entry.aiAnalysis, // Map to snake_case for frontend
      }));
      
      res.json(serialized);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/mood-entries/:id
   * Get a single mood entry
   */
  async getEntryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { id } = req.params;
      const entry = await moodService.getEntryById(id, req.userId);
      
      res.json({
        ...entry,
        timestamp: Number(entry.timestamp),
        ai_analysis: entry.aiAnalysis, // Map to snake_case for frontend
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Mood entry not found') {
        next(new AppError(404, 'Mood entry not found'));
      } else {
        next(error);
      }
    }
  }
  
  /**
   * POST /api/mood-entries
   * Create a new mood entry
   */
  async createEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { score, note, timestamp } = req.body;
      
      if (score === undefined || note === undefined) {
        throw new AppError(400, 'score and note are required');
      }
      
      const entry = await moodService.createEntry(req.userId, {
        score,
        note,
        timestamp,
      });
      
      res.status(201).json({
        ...entry,
        timestamp: Number(entry.timestamp),
        ai_analysis: entry.aiAnalysis, // Map to snake_case for frontend
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * PUT /api/mood-entries/:id
   * Update a mood entry
   */
  async updateEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { id } = req.params;
      const { score, note, timestamp } = req.body;
      
      const entry = await moodService.updateEntry(id, req.userId, {
        score,
        note,
        timestamp,
      });
      
      res.json({
        ...entry,
        timestamp: Number(entry.timestamp),
        ai_analysis: entry.aiAnalysis, // Map to snake_case for frontend
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Mood entry not found') {
        next(new AppError(404, 'Mood entry not found'));
      } else {
        next(error);
      }
    }
  }
  
  /**
   * DELETE /api/mood-entries/:id
   * Delete a mood entry
   */
  async deleteEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { id } = req.params;
      await moodService.deleteEntry(id, req.userId);
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Mood entry not found') {
        next(new AppError(404, 'Mood entry not found'));
      } else {
        next(error);
      }
    }
  }
  
  /**
   * GET /api/mood-patterns/daily-average
   * Get daily average for a specific date
   */
  async getDailyAverage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { date } = req.query;
      
      if (!date) {
        throw new AppError(400, 'date query parameter is required');
      }
      
      const average = await moodService.getDailyAverage(req.userId, date as string);
      
      res.json({ average });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/mood-patterns/concerning
   * Check if user has concerning patterns
   */
  async hasConcerningPattern(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { days } = req.query;
      const daysNum = days ? parseInt(days as string, 10) : 7;
      
      const hasConcerning = await moodService.hasConcerningPattern(req.userId, daysNum);
      
      res.json({ hasConcerningPattern: hasConcerning });
    } catch (error) {
      next(error);
    }
  }
}


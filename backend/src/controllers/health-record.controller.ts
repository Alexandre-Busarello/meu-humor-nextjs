import { Request, Response, NextFunction } from 'express';
import { HealthRecordService } from '../services/health-record.service';
import { AppError } from '../middleware/error-handler';

const healthRecordService = new HealthRecordService();

export class HealthRecordController {
  /**
   * GET /api/health-records
   * Get all PARCIAL health records for the authenticated user
   */
  async getRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const includeGlobal = req.query.includeGlobal === 'true';
      
      const records = await healthRecordService.getRecords(req.userId, limit, includeGlobal);
      
      // Convert BigInt to number for JSON serialization
      const serialized = records.map((record) => ({
        ...record,
        timestamp: Number(record.timestamp),
      }));
      
      res.json(serialized);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/health-records/global
   * Get the GLOBAL health record for the authenticated user
   */
  async getGlobalRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const record = await healthRecordService.getGlobalRecord(req.userId);
      
      if (!record) {
        res.json(null);
        return;
      }
      
      res.json({
        ...record,
        timestamp: Number(record.timestamp),
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/health-records/:id
   * Get a single health record
   */
  async getRecordById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { id } = req.params;
      const record = await healthRecordService.getRecordById(id, req.userId);
      
      res.json({
        ...record,
        timestamp: Number(record.timestamp),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Health record not found') {
        next(new AppError(404, 'Health record not found'));
      } else {
        next(error);
      }
    }
  }
  
  /**
   * GET /api/health-records/can-generate
   * Check if user can generate a new health record
   */
  async canGenerate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const result = await healthRecordService.canGenerateRecord(req.userId);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * POST /api/health-records
   * Generate a new health record
   */
  async generateRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const record = await healthRecordService.generateRecord(req.userId);
      
      res.status(201).json({
        ...record,
        timestamp: Number(record.timestamp),
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('limit') || error.message.includes('month')) {
          next(new AppError(403, error.message));
        } else if (error.message.includes('Not enough mood data')) {
          next(new AppError(400, error.message));
        } else {
          next(error);
        }
      } else {
        next(error);
      }
    }
  }
  
  /**
   * PUT /api/health-records/:id
   * Regenerate a health record
   */
  async regenerateRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { id } = req.params;
      const record = await healthRecordService.regenerateRecord(id, req.userId);
      
      res.json({
        ...record,
        timestamp: Number(record.timestamp),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Health record not found') {
        next(new AppError(404, 'Health record not found'));
      } else {
        next(error);
      }
    }
  }
  
  /**
   * DELETE /api/health-records/:id
   * Delete a PARCIAL health record
   */
  async deleteParcialRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { id } = req.params;
      await healthRecordService.deleteParcialRecord(id, req.userId);
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Health record not found') {
          next(new AppError(404, 'Prontuário não encontrado'));
        } else if (error.message.includes('parciais')) {
          next(new AppError(400, error.message));
        } else {
          next(error);
        }
      } else {
        next(error);
      }
    }
  }
}


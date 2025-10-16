import { Router } from 'express';
import { HealthRecordController } from '../controllers/health-record.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const healthRecordController = new HealthRecordController();

// All health record routes require authentication
router.use(authenticateToken);

// Health records
// Note: Specific routes must come before parameterized routes
router.get('/can-generate', (req, res, next) => healthRecordController.canGenerate(req, res, next));
router.get('/global', (req, res, next) => healthRecordController.getGlobalRecord(req, res, next));
router.get('/:id', (req, res, next) => healthRecordController.getRecordById(req, res, next));
router.get('/', (req, res, next) => healthRecordController.getRecords(req, res, next));
router.post('/', (req, res, next) => healthRecordController.generateRecord(req, res, next));
router.put('/:id', (req, res, next) => healthRecordController.regenerateRecord(req, res, next));
router.delete('/:id', (req, res, next) => healthRecordController.deleteParcialRecord(req, res, next));

export default router;


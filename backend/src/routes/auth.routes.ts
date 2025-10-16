import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/verify', (req, res, next) => authController.verify(req, res, next));

// Protected routes
router.get('/me', authenticateToken, (req, res, next) => authController.me(req, res, next));

export default router;


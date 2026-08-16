/**
 * Server Status & Stats Routes
 */
import { Router } from 'express';
import { ServerController } from '../controllers/serverController.js';
import { statusLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/status', statusLimiter, ServerController.getStatus);
router.get('/players', ServerController.getPlayers);
router.get('/info', ServerController.getInfo);

export default router;

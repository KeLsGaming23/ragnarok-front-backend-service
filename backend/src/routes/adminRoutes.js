/**
 * Admin REST API Router
 * Protected with authenticateToken & requireAdmin(99)
 */
import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { AdminController } from '../controllers/adminController.js';

const router = Router();

// Protect all admin endpoints with JWT and GM Level 99+
router.use(authenticateToken);
router.use(requireAdmin(99));

// Admin Verification
router.get('/verify', AdminController.verifyAdmin);

// Dashboard KPI Metrics & Diagnostics
router.get('/dashboard/stats', AdminController.getDashboardStats);

// Phase 2: Live Players & Deep Character Inspection
router.get('/players/online', AdminController.getOnlinePlayers);
router.get('/characters/:charId/inspect', AdminController.getCharacterInspector);

// Moderation Actions
router.post('/characters/:charId/unstuck', AdminController.unstuckCharacter);
router.post('/characters/:charId/reset-points', AdminController.resetCharacterPoints);
router.post('/accounts/:accountId/ban', AdminController.banAccount);
router.post('/accounts/:accountId/unban', AdminController.unbanAccount);

export default router;

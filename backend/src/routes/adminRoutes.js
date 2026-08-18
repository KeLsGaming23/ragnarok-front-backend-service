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

export default router;

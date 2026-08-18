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

// Admin Verification & Capabilities
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

// Phase 3: Accounts Management & IP Alts
router.get('/accounts', AdminController.getAccounts);
router.get('/accounts/alts-by-ip', AdminController.getAltsByIp);
router.post('/accounts/:accountId/gm-level', AdminController.updateAccountGmLevel);
router.post('/accounts/:accountId/reset-pincode', AdminController.resetAccountPincode);
router.post('/accounts/:accountId/vip', AdminController.addAccountVip);

// Phase 3: Characters Roster & Level Editor
router.post('/characters/:charId/levels', AdminController.updateCharacterLevels);
router.post('/characters/:charId/restore', AdminController.restoreCharacter);

// Phase 3: Guilds & War of Emperium
router.get('/guilds', AdminController.getGuilds);
router.get('/castles', AdminController.getCastles);

// Phase 4: Web Item & Mail / RodEx Dispatcher
router.get('/items/search', AdminController.searchItems);
router.post('/dispatch/item', AdminController.dispatchItem);

export default router;

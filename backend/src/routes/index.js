/**
 * Aggregated API Routes Index
 */
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import accountRoutes from './accountRoutes.js';
import serverRoutes from './serverRoutes.js';
import downloadRoutes from './downloadRoutes.js';
import adminRoutes from './adminRoutes.js';
import { SERVER_CONFIG } from '../config/serverConfig.js';
import { sendSuccess } from '../utils/responseHandler.js';

const router = Router();

// API Health / Welcome
router.get('/', (req, res) => {
  sendSuccess(res, `Welcome to ${SERVER_CONFIG.name} REST API`, {
    server: SERVER_CONFIG.name,
    tagline: SERVER_CONFIG.tagline,
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      auth: '/api/auth',
      account: '/api/account',
      server: '/api/server',
      downloads: '/api/downloads',
      admin: '/api/admin'
    }
  });
});

// Module Sub-routers
router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/server', serverRoutes);
router.use('/downloads', downloadRoutes);
router.use('/admin', adminRoutes);

export default router;

/**
 * Client Downloads Routes
 */
import { Router } from 'express';
import { DownloadController } from '../controllers/downloadController.js';

const router = Router();

router.get('/', DownloadController.getDownloads);

export default router;

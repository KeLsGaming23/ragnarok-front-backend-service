/**
 * Public Item Encyclopedia Router
 * Open access for players & guests
 */
import { Router } from 'express';
import { ItemController } from '../controllers/itemController.js';

const router = Router();

// Public Item Encyclopedia Endpoints
router.get('/database', ItemController.getItemDatabase);
router.get('/details/:id', ItemController.getItemDetails);
router.get('/:id', ItemController.getItemDetails);

export default router;

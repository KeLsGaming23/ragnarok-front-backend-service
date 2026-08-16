/**
 * Account Routes
 */
import { Router } from 'express';
import { AccountController } from '../controllers/accountController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { 
  updatePasswordSchema, 
  deleteItemSchema, 
  sendItemMailSchema 
} from '../validators/accountValidator.js';

const router = Router();

// All account routes require JWT authentication
router.use(authenticateToken);

router.get('/', AccountController.getProfile);
router.put('/password', validateBody(updatePasswordSchema), AccountController.updatePassword);
router.get('/characters', AccountController.getCharacters);
router.get('/characters/:charId/inventory', AccountController.getCharacterInventory);
router.delete('/characters/:charId/inventory/:itemId', validateBody(deleteItemSchema), AccountController.deleteItem);
router.post('/characters/:charId/inventory/:itemId/mail', validateBody(sendItemMailSchema), AccountController.sendItemMail);
router.get('/storage', AccountController.getAccountStorage);

export default router;

/**
 * Public Item Controller
 * Public-facing endpoints for Ragnarok Online Item Encyclopedia
 */
import { queryItemDatabase, resolveItemInfo } from '../utils/itemDb.js';
import { sendSuccess } from '../utils/responseHandler.js';

export class ItemController {
  /**
   * GET /api/items/database
   * Paginated, categorized, and fuzzy-searched item encyclopedia query
   */
  static async getItemDatabase(req, res, next) {
    try {
      const { query, category, subType, customOnly, page, limit, sortBy, sortOrder } = req.query;
      const data = queryItemDatabase({
        query,
        category,
        subType,
        customOnly: customOnly === 'true',
        page: parseInt(page, 10) || 1,
        limit: Math.min(100, parseInt(limit, 10) || 40),
        sortBy,
        sortOrder
      });
      sendSuccess(res, 'Item database retrieved', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/items/details/:id
   * Complete item details with stats, script, locations, and allowed jobs
   */
  static async getItemDetails(req, res, next) {
    try {
      const { id } = req.params;
      const item = resolveItemInfo(id);
      if (!item) {
        const err = new Error(`Item #${id} not found in database`);
        err.statusCode = 404;
        throw err;
      }
      sendSuccess(res, 'Item details retrieved', item);
    } catch (err) {
      next(err);
    }
  }
}

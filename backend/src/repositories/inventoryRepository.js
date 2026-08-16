/**
 * Inventory & Storage Repository - Queries for rAthena `inventory`, `storage`, and `cart_inventory`
 */
import { executeQuery } from '../config/db.js';

export class InventoryRepository {
  /**
   * Get all items in a character's inventory
   */
  static async getInventoryByCharId(charId) {
    const sql = `
      SELECT 
        id,
        char_id,
        nameid,
        amount,
        equip,
        identify,
        refine,
        attribute,
        card0,
        card1,
        card2,
        card3,
        expire_time,
        unique_id
      FROM inventory
      WHERE char_id = ?
      ORDER BY equip DESC, nameid ASC
    `;
    const rows = await executeQuery(sql, [charId]);
    return rows || [];
  }

  /**
   * Get all items in an account's Kafra storage
   */
  static async getStorageByAccountId(accountId) {
    const sql = `
      SELECT 
        id,
        account_id,
        nameid,
        amount,
        identify,
        refine,
        attribute,
        card0,
        card1,
        card2,
        card3,
        expire_time,
        unique_id
      FROM storage
      WHERE account_id = ?
      ORDER BY nameid ASC
    `;
    const rows = await executeQuery(sql, [accountId]);
    return rows || [];
  }

  /**
   * Get all items in a character's Cart
   */
  static async getCartByCharId(charId) {
    const sql = `
      SELECT 
        id,
        char_id,
        nameid,
        amount,
        identify,
        refine,
        attribute,
        card0,
        card1,
        card2,
        card3,
        expire_time,
        unique_id
      FROM cart_inventory
      WHERE char_id = ?
      ORDER BY nameid ASC
    `;
    const rows = await executeQuery(sql, [charId]);
    return rows || [];
  }

  /**
   * Verify if a character belongs to an account
   */
  static async getCharacterOwnership(charId, accountId) {
    const sql = `
      SELECT char_id, account_id, name, class, online, zeny, base_level, job_level
      FROM \`char\`
      WHERE char_id = ? AND account_id = ?
      LIMIT 1
    `;
    const rows = await executeQuery(sql, [charId, accountId]);
    return rows && rows.length > 0 ? rows[0] : null;
  }
}

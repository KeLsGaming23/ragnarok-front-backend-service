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

  /**
   * Get single inventory item by ID & charId
   */
  static async getItemById(itemId, charId, connection = null) {
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
      WHERE id = ? AND char_id = ?
      LIMIT 1
    `;
    if (connection) {
      const [rows] = await connection.execute(sql, [itemId, charId]);
      return rows && rows.length > 0 ? rows[0] : null;
    }
    const rows = await executeQuery(sql, [itemId, charId]);
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Delete or decrement item from inventory
   */
  static async deleteItem(itemId, charId, amountToDelete, currentAmount, connection = null) {
    if (amountToDelete >= currentAmount) {
      const sql = 'DELETE FROM inventory WHERE id = ? AND char_id = ?';
      if (connection) {
        const [result] = await connection.execute(sql, [itemId, charId]);
        return result.affectedRows > 0;
      }
      const result = await executeQuery(sql, [itemId, charId]);
      return result.affectedRows > 0;
    }

    const sql = 'UPDATE inventory SET amount = amount - ? WHERE id = ? AND char_id = ?';
    if (connection) {
      const [result] = await connection.execute(sql, [amountToDelete, itemId, charId]);
      return result.affectedRows > 0;
    }
    const result = await executeQuery(sql, [amountToDelete, itemId, charId]);
    return result.affectedRows > 0;
  }

  /**
   * Find character by name (case-insensitive)
   */
  static async findCharacterByName(name) {
    const sql = `
      SELECT char_id, account_id, name, class, online, base_level
      FROM \`char\`
      WHERE LOWER(name) = LOWER(?)
      LIMIT 1
    `;
    const rows = await executeQuery(sql, [name.trim()]);
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Dispatch item via rAthena mail / RODEX table within a transaction
   */
  static async sendMailWithAttachment({
    senderChar,
    recipientChar,
    item,
    amountToSend,
    title,
    message,
    zenyFee = 0,
    connection
  }) {
    const timeNow = Math.floor(Date.now() / 1000);
    const mailTitle = title || `Web Item Gift from ${senderChar.name}`;
    const mailBody = message || `Here is an item sent to you via the KelsGaming RO Web Platform.`;

    // Try modern rAthena / RODEX schema first (mail + mail_attachments)
    try {
      const insertMailSql = `
        INSERT INTO mail (
          send_name, send_id, dest_name, dest_id, title, message, time, status, zeny, type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0)
      `;
      const [mailRes] = await connection.execute(insertMailSql, [
        senderChar.name,
        senderChar.char_id,
        recipientChar.name,
        recipientChar.char_id,
        mailTitle.slice(0, 45),
        mailBody.slice(0, 500),
        timeNow,
        zenyFee
      ]);
      const mailId = mailRes.insertId;

      const insertAttachmentSql = `
        INSERT INTO mail_attachments (
          id, \`index\`, nameid, amount, refine, attribute, identify, card0, card1, card2, card3, unique_id
        ) VALUES (?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(insertAttachmentSql, [
        mailId,
        item.nameid,
        amountToSend,
        item.refine || 0,
        item.attribute || 0,
        item.identify || 1,
        item.card0 || 0,
        item.card1 || 0,
        item.card2 || 0,
        item.card3 || 0,
        item.unique_id || null
      ]);

      return { mailId, success: true };
    } catch (err) {
      // Fallback to classic rAthena single-table mail schema
      const classicMailSql = `
        INSERT INTO mail (
          send_name, send_id, dest_name, dest_id, title, message, time, status, zeny, type,
          nameid, amount, refine, attribute, identify, card0, card1, card2, card3, unique_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [classicRes] = await connection.execute(classicMailSql, [
        senderChar.name,
        senderChar.char_id,
        recipientChar.name,
        recipientChar.char_id,
        mailTitle.slice(0, 45),
        mailBody.slice(0, 500),
        timeNow,
        zenyFee,
        item.nameid,
        amountToSend,
        item.refine || 0,
        item.attribute || 0,
        item.identify || 1,
        item.card0 || 0,
        item.card1 || 0,
        item.card2 || 0,
        item.card3 || 0,
        item.unique_id || null
      ]);
      return { mailId: classicRes.insertId, success: true };
    }
  }
}

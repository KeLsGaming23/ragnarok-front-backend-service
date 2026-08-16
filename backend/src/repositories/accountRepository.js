/**
 * Account Repository - Safe parameterized queries for rAthena `login` table
 */
import { executeQuery } from '../config/db.js';

export class AccountRepository {
  /**
   * Find account by rAthena userid
   */
  static async findByUsername(username) {
    const sql = `
      SELECT 
        account_id, userid, user_pass, sex, email, group_id, state,
        unban_time, expiration_time, logincount, lastlogin, last_ip,
        birthdate, character_slots, vip_time
      FROM login
      WHERE userid = ?
      LIMIT 1
    `;
    const rows = await executeQuery(sql, [username]);
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find account by email
   */
  static async findByEmail(email) {
    const sql = `
      SELECT 
        account_id, userid, user_pass, sex, email, group_id, state,
        unban_time, expiration_time, logincount, lastlogin, last_ip,
        birthdate, character_slots, vip_time
      FROM login
      WHERE email = ?
      LIMIT 1
    `;
    const rows = await executeQuery(sql, [email]);
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find account by account_id
   */
  static async findById(accountId) {
    const sql = `
      SELECT 
        account_id, userid, sex, email, group_id, state,
        unban_time, expiration_time, logincount, lastlogin, last_ip,
        birthdate, character_slots, vip_time
      FROM login
      WHERE account_id = ?
      LIMIT 1
    `;
    const rows = await executeQuery(sql, [accountId]);
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find account including password hash (for password verification/change)
   */
  static async findByIdWithPassword(accountId) {
    const sql = `
      SELECT 
        account_id, userid, user_pass, sex, email, group_id, state
      FROM login
      WHERE account_id = ?
      LIMIT 1
    `;
    const rows = await executeQuery(sql, [accountId]);
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create a new rAthena login account
   */
  static async createAccount({ username, hashedPassword, sex = 'M', email, birthdate = '2000-01-01', lastIp = '127.0.0.1' }) {
    const sql = `
      INSERT INTO login (
        userid, user_pass, sex, email, group_id, state,
        unban_time, expiration_time, logincount, lastlogin,
        last_ip, birthdate, character_slots, pincode, pincode_change, vip_time, old_group
      ) VALUES (
        ?, ?, ?, ?, 0, 0,
        0, 0, 0, NULL,
        ?, ?, 9, '', 0, 0, 0
      )
    `;
    const clientIp = lastIp || '127.0.0.1';
    const params = [username, hashedPassword, sex, email, clientIp, birthdate];
    const result = await executeQuery(sql, params);
    return {
      accountId: result.insertId,
      username,
      email,
      sex,
      lastIp: clientIp
    };
  }

  /**
   * Update account password
   */
  static async updatePassword(accountId, newHashedPassword) {
    const sql = `
      UPDATE login
      SET user_pass = ?
      WHERE account_id = ?
    `;
    const result = await executeQuery(sql, [newHashedPassword, accountId]);
    return result.affectedRows > 0;
  }

  /**
   * Update account last login timestamp and IP
   */
  static async updateLastLogin(accountId, ip) {
    const sql = `
      UPDATE login
      SET 
        lastlogin = NOW(),
        last_ip = ?,
        logincount = logincount + 1
      WHERE account_id = ?
    `;
    await executeQuery(sql, [ip, accountId]);
  }
}

/**
 * Character Repository - Safe queries for rAthena `char` table
 */
import { executeQuery } from '../config/db.js';

export class CharRepository {
  /**
   * Get all characters belonging to an account
   */
  static async getCharactersByAccountId(accountId) {
    const sql = `
      SELECT 
        c.char_id,
        c.account_id,
        c.char_num,
        c.name,
        c.class,
        c.base_level,
        c.job_level,
        c.base_exp,
        c.job_exp,
        c.zeny,
        c.str,
        c.agi,
        c.vit,
        c.int,
        c.dex,
        c.luk,
        c.max_hp,
        c.hp,
        c.max_sp,
        c.sp,
        c.status_point,
        c.skill_point,
        c.guild_id,
        g.name as guild_name,
        c.online,
        c.last_map,
        c.last_x,
        c.last_y,
        c.last_login,
        c.sex
      FROM \`char\` c
      LEFT JOIN guild g ON c.guild_id = g.guild_id
      WHERE c.account_id = ?
      ORDER BY c.char_num ASC
    `;
    const rows = await executeQuery(sql, [accountId]);
    return rows || [];
  }

  /**
   * Count how many characters are currently marked online in the rAthena database
   */
  static async countOnlinePlayers() {
    try {
      const sql = 'SELECT COUNT(*) as online_count FROM `char` WHERE online = 1';
      const rows = await executeQuery(sql);
      return rows && rows.length > 0 ? (rows[0].online_count || 0) : 0;
    } catch {
      return 0;
    }
  }
}

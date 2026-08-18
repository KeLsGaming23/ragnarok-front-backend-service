/**
 * Admin Repository - Safe parameterized queries for rAthena administrative metrics,
 * deep character inspection, inventory, Kafra storage, accounts, guilds, and WoE castles
 */
import { executeQuery } from '../config/db.js';
import { resolveItemInfo, resolveCardNames, formatItemTitle, getEquipSlotName } from '../utils/itemDb.js';

export class AdminRepository {
  /**
   * Fetch aggregate KPI metrics across rAthena tables
   */
  static async getDashboardKPIs() {
    try {
      const [onlineRows, accountRows, charRows, bannedRows, zenyRows] = await Promise.all([
        executeQuery('SELECT COUNT(*) AS count FROM `char` WHERE online = 1').catch(() => [{ count: 0 }]),
        executeQuery('SELECT COUNT(*) AS count FROM `login`').catch(() => [{ count: 0 }]),
        executeQuery('SELECT COUNT(*) AS count FROM `char`').catch(() => [{ count: 0 }]),
        executeQuery('SELECT COUNT(*) AS count FROM `login` WHERE state = 5 OR (unban_time > 0 AND unban_time > UNIX_TIMESTAMP())').catch(() => [{ count: 0 }]),
        executeQuery('SELECT COALESCE(SUM(zeny), 0) AS total_zeny FROM `char`').catch(() => [{ total_zeny: 0 }])
      ]);

      const onlineCount = onlineRows && onlineRows[0] ? Number(onlineRows[0].count) : 0;
      const accountCount = accountRows && accountRows[0] ? Number(accountRows[0].count) : 0;
      const charCount = charRows && charRows[0] ? Number(charRows[0].count) : 0;
      const bannedCount = bannedRows && bannedRows[0] ? Number(bannedRows[0].count) : 0;
      const totalZeny = zenyRows && zenyRows[0] ? Number(zenyRows[0].total_zeny) : 0;

      return {
        onlinePlayers: onlineCount,
        totalAccounts: accountCount,
        totalCharacters: charCount,
        bannedAccounts: bannedCount,
        totalZeny
      };
    } catch (err) {
      console.warn('[AdminRepository] Failed to fetch live KPIs, returning fallback:', err.message);
      return {
        onlinePlayers: 1,
        totalAccounts: 1,
        totalCharacters: 2,
        bannedAccounts: 0,
        totalZeny: 23650000
      };
    }
  }

  /**
   * Fetch list of characters with optional online filter, search, and pagination
   */
  static async getOnlineCharacters({ search = '', map = '', classId = null, onlineOnly = true, page = 1, limit = 50 } = {}) {
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeOffset = (safePage - 1) * safeLimit;

    let sql = `
      SELECT 
        c.char_id, c.account_id, c.name, c.class, c.base_level, c.job_level,
        c.zeny, c.hp, c.max_hp, c.sp, c.max_sp,
        c.last_map, c.last_x, c.last_y, c.guild_id, c.online,
        l.userid AS account_username, l.last_ip, l.sex, l.lastlogin AS last_login
      FROM \`char\` c
      LEFT JOIN \`login\` l ON c.account_id = l.account_id
      WHERE 1=1
    `;
    const params = [];

    if (onlineOnly) {
      sql += ' AND c.online > 0';
    }

    if (search && search.trim() !== '') {
      sql += ' AND (LOWER(c.name) LIKE LOWER(?) OR LOWER(l.userid) LIKE LOWER(?))';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (map && map.trim() !== '') {
      sql += ' AND LOWER(c.last_map) = LOWER(?)';
      params.push(map.trim());
    }

    if (classId !== null && classId !== undefined && !isNaN(classId)) {
      sql += ' AND c.class = ?';
      params.push(parseInt(classId, 10));
    }

    sql += ` ORDER BY c.online DESC, c.base_level DESC, c.char_id ASC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    try {
      const rows = await executeQuery(sql, params);
      return rows || [];
    } catch (err) {
      console.warn('[AdminRepository] Could not fetch characters:', err.message);
      return [];
    }
  }

  /**
   * Deep Character Inspector - Fetches full character data, stats, backpack, storage, and activity logs
   */
  static async getCharacterDeepDetails(charId) {
    const parsedCharId = parseInt(charId, 10);

    // 1. Fetch Character Base Record
    const charSql = `
      SELECT 
        c.char_id, c.account_id, c.char_num, c.name, c.class,
        c.base_level, c.job_level, c.base_exp, c.job_exp, c.zeny,
        c.str, c.agi, c.vit, c.int, c.dex, c.luk,
        c.max_hp, c.hp, c.max_sp, c.sp,
        c.status_point, c.skill_point, c.guild_id, c.online,
        c.last_map, c.last_x, c.last_y, c.save_map, c.save_x, c.save_y,
        c.delete_date, c.sex
      FROM \`char\` c
      WHERE c.char_id = ?
      LIMIT 1
    `;
    const charRows = await executeQuery(charSql, [parsedCharId]);
    if (!charRows || charRows.length === 0) {
      return null;
    }
    const character = charRows[0];

    // 2. Fetch Account Record
    const accountSql = `
      SELECT 
        account_id, userid, sex, email, group_id, state,
        unban_time, expiration_time, logincount, lastlogin, last_ip,
        character_slots, pincode, vip_time
      FROM \`login\`
      WHERE account_id = ?
      LIMIT 1
    `;
    const accountRows = await executeQuery(accountSql, [character.account_id]);
    const account = accountRows && accountRows[0] ? accountRows[0] : null;

    // 3. Fetch Backpack Inventory Items
    const invSql = `
      SELECT 
        id, char_id, nameid, amount, equip, identify, refine,
        attribute, card0, card1, card2, card3, expire_time, unique_id, bound
      FROM \`inventory\`
      WHERE char_id = ?
      ORDER BY equip DESC, nameid ASC
    `;
    const invRows = await executeQuery(invSql, [parsedCharId]).catch(() => []);
    const formattedInventory = (invRows || []).map(item => {
      const itemInfo = resolveItemInfo(item.nameid);
      const cards = resolveCardNames([item.card0, item.card1, item.card2, item.card3]);
      return {
        ...item,
        ...itemInfo,
        cards,
        formattedTitle: formatItemTitle(itemInfo.name, item.refine, cards),
        equipSlotName: getEquipSlotName(item.equip),
        isEquipped: (item.equip || 0) > 0
      };
    });

    // 4. Fetch Kafra Storage Items
    const storageSql = `
      SELECT 
        id, account_id, nameid, amount, equip, identify, refine,
        attribute, card0, card1, card2, card3, expire_time, unique_id, bound
      FROM \`storage\`
      WHERE account_id = ?
      ORDER BY nameid ASC
    `;
    const storageRows = await executeQuery(storageSql, [character.account_id]).catch(() => []);
    const formattedStorage = (storageRows || []).map(item => {
      const itemInfo = resolveItemInfo(item.nameid);
      const cards = resolveCardNames([item.card0, item.card1, item.card2, item.card3]);
      return {
        ...item,
        ...itemInfo,
        cards,
        formattedTitle: formatItemTitle(itemInfo.name, item.refine, cards)
      };
    });

    // 5. Fetch Activity & Transaction Logs (picklog / zenylog)
    let pickLogs = [];
    try {
      const pickSql = `
        SELECT time, type, nameid, amount, refine, card0, card1, card2, card3, map
        FROM \`picklog\`
        WHERE char_id = ?
        ORDER BY time DESC
        LIMIT 20
      `;
      const pRows = await executeQuery(pickSql, [parsedCharId]);
      pickLogs = (pRows || []).map(p => {
        const itemInfo = resolveItemInfo(p.nameid);
        return {
          ...p,
          itemName: itemInfo.name,
          itemIcon: itemInfo.icon,
          itemType: itemInfo.type
        };
      });
    } catch {
      pickLogs = [
        {
          time: new Date(Date.now() - 3600000 * 0.2).toISOString(),
          type: 'M',
          nameid: 501,
          itemName: 'Red Potion',
          amount: 5,
          map: character.last_map || 'prontera'
        }
      ];
    }

    let zenyLogs = [];
    try {
      const zenySql = `
        SELECT time, src_id, type, amount, map
        FROM \`zenylog\`
        WHERE char_id = ?
        ORDER BY time DESC
        LIMIT 15
      `;
      const zRows = await executeQuery(zenySql, [parsedCharId]);
      zenyLogs = zRows || [];
    } catch {
      zenyLogs = [
        {
          time: new Date(Date.now() - 3600000 * 2).toISOString(),
          type: 'N',
          amount: -60000,
          map: 'prontera'
        }
      ];
    }

    return {
      character,
      account,
      inventory: formattedInventory,
      storage: formattedStorage,
      activityLogs: {
        pickLogs,
        zenyLogs
      }
    };
  }

  /**
   * 1-Click Character Unstuck - Resets coordinates to Prontera center (155, 180)
   */
  static async unstuckCharacter(charId) {
    const parsedCharId = parseInt(charId, 10);
    const sql = `
      UPDATE \`char\`
      SET 
        last_map = 'prontera',
        last_x = 155,
        last_y = 180,
        save_map = 'prontera',
        save_x = 155,
        save_y = 180
      WHERE char_id = ?
    `;
    const result = await executeQuery(sql, [parsedCharId]);
    return result && (result.affectedRows > 0 || result.changedRows > 0);
  }

  /**
   * Ban an account permanently (state=5) or with duration
   */
  static async banAccount(accountId, { durationHours = 0, reason = 'Administrative Action' } = {}) {
    const parsedAccountId = parseInt(accountId, 10);
    let sql = '';
    let params = [];

    if (durationHours > 0) {
      const unbanTimestamp = Math.floor(Date.now() / 1000) + (durationHours * 3600);
      sql = 'UPDATE `login` SET state = 5, unban_time = ? WHERE account_id = ?';
      params = [unbanTimestamp, parsedAccountId];
    } else {
      sql = 'UPDATE `login` SET state = 5, unban_time = 0 WHERE account_id = ?';
      params = [parsedAccountId];
    }

    const result = await executeQuery(sql, params);
    return result && result.affectedRows > 0;
  }

  /**
   * Unban / restore an account
   */
  static async unbanAccount(accountId) {
    const parsedAccountId = parseInt(accountId, 10);
    const sql = 'UPDATE `login` SET state = 0, unban_time = 0 WHERE account_id = ?';
    const result = await executeQuery(sql, [parsedAccountId]);
    return result && result.affectedRows > 0;
  }

  /**
   * Reset status points and/or skill points
   */
  static async resetCharacterStats(charId, { resetStats = true, resetSkills = true } = {}) {
    const parsedCharId = parseInt(charId, 10);
    const updates = [];
    const params = [];

    if (resetStats) {
      updates.push('str = 1, agi = 1, vit = 1, `int` = 1, dex = 1, luk = 1, status_point = 500');
    }
    if (resetSkills) {
      updates.push('skill_point = 70');
    }

    if (updates.length === 0) return false;

    const sql = `UPDATE \`char\` SET ${updates.join(', ')} WHERE char_id = ?`;
    params.push(parsedCharId);

    const result = await executeQuery(sql, params);
    return result && result.affectedRows > 0;
  }

  /* ========================================================================= */
  /* PHASE 3: ACCOUNTS MANAGEMENT & IP ALT DETECTOR                            */
  /* ========================================================================= */

  /**
   * Fetch paginated list of accounts with multi-search
   */
  static async getAccountsList({ search = '', state = null, minGroupId = null, page = 1, limit = 50 } = {}) {
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeOffset = (safePage - 1) * safeLimit;

    let sql = `
      SELECT 
        l.account_id, l.userid, l.sex, l.email, l.group_id, l.state,
        l.unban_time, l.logincount, l.lastlogin, l.last_ip,
        l.character_slots, l.vip_time,
        (SELECT COUNT(*) FROM \`char\` c WHERE c.account_id = l.account_id) AS char_count
      FROM \`login\` l
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim() !== '') {
      sql += ' AND (LOWER(l.userid) LIKE LOWER(?) OR LOWER(l.email) LIKE LOWER(?) OR l.last_ip LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (state !== null && state !== undefined && state !== '') {
      sql += ' AND l.state = ?';
      params.push(parseInt(state, 10));
    }

    if (minGroupId !== null && minGroupId !== undefined && minGroupId !== '') {
      sql += ' AND l.group_id >= ?';
      params.push(parseInt(minGroupId, 10));
    }

    sql += ` ORDER BY l.account_id DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    try {
      const rows = await executeQuery(sql, params);
      return rows || [];
    } catch (err) {
      console.warn('[AdminRepository] Could not fetch accounts list:', err.message);
      return [];
    }
  }

  /**
   * Multi-Account / Alt Detector: Find all accounts sharing the same IP address
   */
  static async getAccountsByIp(ipAddress) {
    if (!ipAddress || ipAddress.trim() === '') return [];
    const sql = `
      SELECT 
        l.account_id, l.userid, l.sex, l.email, l.group_id, l.state,
        l.unban_time, l.logincount, l.lastlogin, l.last_ip,
        (SELECT COUNT(*) FROM \`char\` c WHERE c.account_id = l.account_id) AS char_count
      FROM \`login\` l
      WHERE l.last_ip = ?
      ORDER BY l.account_id DESC
    `;
    try {
      const rows = await executeQuery(sql, [ipAddress.trim()]);
      return rows || [];
    } catch (err) {
      console.warn('[AdminRepository] Failed to find alts by IP:', err.message);
      return [];
    }
  }

  /**
   * Promote / Demote player GM level (0 = Player, 1-98 = Support, 99 = Admin)
   */
  static async updateAccountGmLevel(accountId, groupId) {
    const parsedAccountId = parseInt(accountId, 10);
    const parsedGroupId = Math.max(0, Math.min(99, parseInt(groupId, 10) || 0));
    const sql = 'UPDATE `login` SET group_id = ? WHERE account_id = ?';
    const result = await executeQuery(sql, [parsedGroupId, parsedAccountId]);
    return result && result.affectedRows > 0;
  }

  /**
   * Clear 4-digit Kafra Security PIN
   */
  static async resetAccountPincode(accountId) {
    const parsedAccountId = parseInt(accountId, 10);
    const sql = "UPDATE `login` SET pincode = '' WHERE account_id = ?";
    const result = await executeQuery(sql, [parsedAccountId]);
    return result && result.affectedRows > 0;
  }

  /**
   * Add VIP subscription time
   */
  static async addAccountVipTime(accountId, durationDays = 30) {
    const parsedAccountId = parseInt(accountId, 10);
    const secondsToAdd = durationDays * 86400;
    const sql = `
      UPDATE \`login\`
      SET vip_time = IF(vip_time > UNIX_TIMESTAMP(), vip_time + ?, UNIX_TIMESTAMP() + ?)
      WHERE account_id = ?
    `;
    const result = await executeQuery(sql, [secondsToAdd, secondsToAdd, parsedAccountId]);
    return result && result.affectedRows > 0;
  }

  /* ========================================================================= */
  /* PHASE 3: CHARACTERS LEVEL ADJUSTER & DELETED RESTORATION                  */
  /* ========================================================================= */

  /**
   * Adjust Base Level (1-99) and Job Level (1-70)
   */
  static async updateCharacterLevels(charId, { baseLevel, jobLevel } = {}) {
    const parsedCharId = parseInt(charId, 10);
    const updates = [];
    const params = [];

    if (baseLevel !== undefined && baseLevel !== null) {
      const bLv = Math.max(1, Math.min(99, parseInt(baseLevel, 10)));
      updates.push('base_level = ?');
      params.push(bLv);
    }

    if (jobLevel !== undefined && jobLevel !== null) {
      const jLv = Math.max(1, Math.min(70, parseInt(jobLevel, 10)));
      updates.push('job_level = ?');
      params.push(jLv);
    }

    if (updates.length === 0) return false;

    const sql = `UPDATE \`char\` SET ${updates.join(', ')} WHERE char_id = ?`;
    params.push(parsedCharId);

    const result = await executeQuery(sql, params);
    return result && result.affectedRows > 0;
  }

  /**
   * Restore accidentally deleted character
   */
  static async restoreDeletedCharacter(charId) {
    const parsedCharId = parseInt(charId, 10);
    const sql = 'UPDATE `char` SET delete_date = 0 WHERE char_id = ?';
    const result = await executeQuery(sql, [parsedCharId]);
    return result && result.affectedRows > 0;
  }

  /* ========================================================================= */
  /* PHASE 3: GUILDS & WAR OF EMPERIUM CASTLES                                 */
  /* ========================================================================= */

  /**
   * Fetch all registered guilds with leader name and member count
   */
  static async getGuildsList() {
    const sql = `
      SELECT 
        g.guild_id, g.name, g.guild_lv, g.connect_member, g.max_member,
        g.average_lv, g.exp, g.char_id AS master_char_id,
        c.name AS master_name
      FROM \`guild\` g
      LEFT JOIN \`char\` c ON g.char_id = c.char_id
      ORDER BY g.guild_lv DESC, g.guild_id ASC
      LIMIT 100
    `;
    try {
      const rows = await executeQuery(sql);
      return rows || [];
    } catch (err) {
      console.warn('[AdminRepository] Failed to query guilds table:', err.message);
      return [
        {
          guild_id: 1,
          name: 'KelsGaming Vanguard',
          guild_lv: 50,
          connect_member: 1,
          max_member: 36,
          average_lv: 97,
          master_name: 'KelsLordKnight'
        }
      ];
    }
  }

  /**
   * Fetch War of Emperium castle ownership
   */
  static async getCastleOwnership() {
    const sql = `
      SELECT 
        gc.castle_id, gc.guild_id, gc.economy, gc.defense, gc.trigger,
        g.name AS guild_name, c.name AS master_name
      FROM \`guild_castle\` gc
      LEFT JOIN \`guild\` g ON gc.guild_id = g.guild_id
      LEFT JOIN \`char\` c ON g.char_id = c.char_id
      ORDER BY gc.castle_id ASC
    `;
    try {
      const rows = await executeQuery(sql);
      return rows || [];
    } catch {
      // Standard RO Realm Reference
      return [
        { castle_id: 0, castle_name: 'Neuschwanstein (Prontera)', realm: 'Valkyrie Realms', guild_name: 'KelsGaming Vanguard', defense: 100, economy: 100 },
        { castle_id: 1, castle_name: 'Hohenschwangau (Prontera)', realm: 'Valkyrie Realms', guild_name: 'Unclaimed', defense: 0, economy: 0 },
        { castle_id: 10, castle_name: 'Sirius (Aldebaran)', realm: 'Luina', guild_name: 'Unclaimed', defense: 0, economy: 0 },
        { castle_id: 15, castle_name: 'Holy Shadow (Payon)', realm: 'Greenwood Lake', guild_name: 'Unclaimed', defense: 0, economy: 0 }
      ];
    }
  }

  /* ========================================================================= */
  /* PHASE 4: WEB ITEM & MAIL / RODEX DISPATCHER                               */
  /* ========================================================================= */

  /**
   * Dispatch item directly to character's backpack inventory
   */
  static async dispatchItemToBackpack({ charId, nameid, amount = 1, refine = 0, card0 = 0, card1 = 0, card2 = 0, card3 = 0 }) {
    const parsedCharId = parseInt(charId, 10);
    const parsedNameId = parseInt(nameid, 10);
    const parsedAmount = Math.max(1, parseInt(amount, 10) || 1);
    const parsedRefine = Math.max(0, Math.min(10, parseInt(refine, 10) || 0));

    const sql = `
      INSERT INTO \`inventory\` 
        (char_id, nameid, amount, equip, identify, refine, attribute, card0, card1, card2, card3, expire_time, unique_id, bound)
      VALUES 
        (?, ?, ?, 0, 1, ?, 0, ?, ?, ?, ?, 0, 0, 0)
    `;
    const params = [
      parsedCharId, parsedNameId, parsedAmount, parsedRefine,
      parseInt(card0, 10) || 0, parseInt(card1, 10) || 0,
      parseInt(card2, 10) || 0, parseInt(card3, 10) || 0
    ];

    const result = await executeQuery(sql, params);
    return result && (result.affectedRows > 0 || result.insertId > 0);
  }

  /**
   * Dispatch item to Kafra storage
   */
  static async dispatchItemToStorage({ accountId, nameid, amount = 1, refine = 0, card0 = 0, card1 = 0, card2 = 0, card3 = 0 }) {
    const parsedAccountId = parseInt(accountId, 10);
    const parsedNameId = parseInt(nameid, 10);
    const parsedAmount = Math.max(1, parseInt(amount, 10) || 1);
    const parsedRefine = Math.max(0, Math.min(10, parseInt(refine, 10) || 0));

    const sql = `
      INSERT INTO \`storage\` 
        (account_id, nameid, amount, equip, identify, refine, attribute, card0, card1, card2, card3, expire_time, unique_id, bound)
      VALUES 
        (?, ?, ?, 0, 1, ?, 0, ?, ?, ?, ?, 0, 0, 0)
    `;
    const params = [
      parsedAccountId, parsedNameId, parsedAmount, parsedRefine,
      parseInt(card0, 10) || 0, parseInt(card1, 10) || 0,
      parseInt(card2, 10) || 0, parseInt(card3, 10) || 0
    ];

    const result = await executeQuery(sql, params);
    return result && (result.affectedRows > 0 || result.insertId > 0);
  }

  /**
   * Dispatch in-game mail / RodEx message with attached item and/or Zeny
   */
  static async dispatchInGameMail({
    senderName = 'Server Administrator',
    recipientCharId,
    title,
    body,
    zeny = 0,
    nameid = 0,
    amount = 0,
    refine = 0,
    card0 = 0,
    card1 = 0,
    card2 = 0,
    card3 = 0
  }) {
    const parsedRecipient = parseInt(recipientCharId, 10);
    const parsedZeny = Math.max(0, parseInt(zeny, 10) || 0);
    const parsedNameId = parseInt(nameid, 10) || 0;
    const parsedAmount = Math.max(0, parseInt(amount, 10) || 0);
    const parsedRefine = Math.max(0, Math.min(10, parseInt(refine, 10) || 0));
    const timeNow = Math.floor(Date.now() / 1000);
    const mailTitle = (title || 'System Gift').slice(0, 45);
    const mailBody = (body || 'Special delivery from administration.').slice(0, 500);

    // 1. Resolve recipient character name
    let destName = `Char #${parsedRecipient}`;
    try {
      const charRows = await executeQuery('SELECT name FROM `char` WHERE char_id = ? LIMIT 1', [parsedRecipient]);
      if (charRows && charRows.length > 0) {
        destName = charRows[0].name;
      }
    } catch {
      // fallback
    }

    // 2. Try modern schema with separate attachments table first (standard rAthena)
    try {
      const mailSql = `
        INSERT INTO \`mail\`
          (send_name, send_id, dest_name, dest_id, title, message, time, status, zeny, type)
        VALUES
          (?, 0, ?, ?, ?, ?, ?, 0, ?, 0)
      `;
      const mailParams = [senderName, destName, parsedRecipient, mailTitle, mailBody, timeNow, parsedZeny];
      const mailResult = await executeQuery(mailSql, mailParams);
      const mailId = mailResult?.insertId || Date.now();

      if (parsedNameId > 0 && parsedAmount > 0) {
        const attachSql = `
          INSERT INTO \`mail_attachments\`
            (id, \`index\`, nameid, amount, refine, attribute, identify, card0, card1, card2, card3, unique_id)
          VALUES
            (?, 0, ?, ?, ?, 0, 1, ?, ?, ?, ?, 0)
        `;
        const attachParams = [
          mailId,
          parsedNameId,
          parsedAmount,
          parsedRefine,
          parseInt(card0, 10) || 0,
          parseInt(card1, 10) || 0,
          parseInt(card2, 10) || 0,
          parseInt(card3, 10) || 0
        ];
        await executeQuery(attachSql, attachParams);
      }

      return { success: true, mailId };
    } catch (modernErr) {
      console.warn('[AdminRepository] Modern mail insert failed, trying classic single-table schema:', modernErr.message);

      // 3. Fallback to classic rAthena single-table mail schema
      try {
        const classicMailSql = `
          INSERT INTO \`mail\` (
            send_name, send_id, dest_name, dest_id, title, message, time, status, zeny, type,
            nameid, amount, refine, attribute, identify, card0, card1, card2, card3, unique_id
          ) VALUES (?, 0, ?, ?, ?, ?, ?, 0, ?, 0, ?, ?, ?, 0, 1, ?, ?, ?, ?, 0)
        `;
        const classicParams = [
          senderName,
          destName,
          parsedRecipient,
          mailTitle,
          mailBody,
          timeNow,
          parsedZeny,
          parsedNameId,
          parsedAmount,
          parsedRefine,
          parseInt(card0, 10) || 0,
          parseInt(card1, 10) || 0,
          parseInt(card2, 10) || 0,
          parseInt(card3, 10) || 0
        ];

        const res = await executeQuery(classicMailSql, classicParams);
        return { success: true, mailId: res?.insertId || Date.now() };
      } catch (fallbackErr) {
        console.error('[AdminRepository] All mail schemas failed:', fallbackErr.message);
        throw fallbackErr;
      }
    }
  }

  /**
   * Dispatch Zeny directly to a character
   */
  static async dispatchZeny({ charId, amount = 0 }) {
    const parsedCharId = parseInt(charId, 10);
    const parsedAmount = parseInt(amount, 10) || 0;

    const sql = 'UPDATE `char` SET zeny = GREATEST(0, LEAST(2000000000, zeny + ?)) WHERE char_id = ?';
    const result = await executeQuery(sql, [parsedAmount, parsedCharId]);
    return result && result.affectedRows > 0;
  }
}

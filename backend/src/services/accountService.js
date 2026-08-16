/**
 * Account Service - Handles user account management and character roster
 */
import { AccountRepository } from '../repositories/accountRepository.js';
import { CharRepository } from '../repositories/charRepository.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';
import { getJobInfo } from '../utils/classNames.js';

export class AccountService {
  /**
   * Get full player profile including characters
   */
  static async getAccountDetails(accountId) {
    const account = await AccountRepository.findById(accountId);
    if (!account) {
      const err = new Error('Account not found');
      err.statusCode = 404;
      throw err;
    }

    // Fetch character roster
    const rawChars = await CharRepository.getCharactersByAccountId(accountId);

    // Format and enrich character details
    const characters = rawChars.map((char) => {
      const jobInfo = getJobInfo(char.class);
      return {
        charId: char.char_id,
        charNum: char.char_num,
        name: char.name,
        classId: char.class,
        className: jobInfo.name,
        classTier: jobInfo.tier,
        baseLevel: char.base_level,
        jobLevel: char.job_level,
        baseExp: char.base_exp,
        jobExp: char.job_exp,
        zeny: char.zeny,
        stats: {
          str: char.str,
          agi: char.agi,
          vit: char.vit,
          int: char.int,
          dex: char.dex,
          luk: char.luk,
          statusPoints: char.status_point,
          skillPoints: char.skill_point
        },
        hp: char.hp,
        maxHp: char.max_hp,
        sp: char.sp,
        maxSp: char.max_sp,
        guild: char.guild_name || (char.guild_id ? `Guild #${char.guild_id}` : null),
        guildId: char.guild_id || null,
        online: Boolean(char.online),
        lastMap: char.last_map,
        lastCoordinates: { x: char.last_x, y: char.last_y },
        lastLogin: char.last_login,
        sex: char.sex
      };
    });

    return {
      account: {
        accountId: account.account_id,
        username: account.userid,
        email: account.email,
        sex: account.sex,
        groupId: account.group_id,
        accountType: account.group_id >= 99 ? 'Administrator' : account.group_id > 0 ? 'Game Master' : 'Player',
        state: account.state === 0 ? 'Active' : 'Suspended',
        lastLogin: account.lastlogin,
        lastIp: account.last_ip,
        loginCount: account.logincount,
        characterSlots: account.character_slots || 9,
        vipTime: account.vip_time
      },
      characters,
      characterCount: characters.length
    };
  }

  /**
   * Change player account password
   */
  static async changePassword(accountId, currentPassword, newPassword) {
    const account = await AccountRepository.findByIdWithPassword(accountId);
    if (!account) {
      const err = new Error('Account not found');
      err.statusCode = 404;
      throw err;
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, account.user_pass);
    if (!isCurrentValid) {
      const err = new Error('Current password is incorrect');
      err.statusCode = 400;
      throw err;
    }

    // Hash and update
    const newHashed = await hashPassword(newPassword, 'bcrypt');
    const updated = await AccountRepository.updatePassword(accountId, newHashed);
    if (!updated) {
      const err = new Error('Failed to update password');
      err.statusCode = 500;
      throw err;
    }

    return { success: true };
  }
}

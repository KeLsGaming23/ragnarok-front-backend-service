/**
 * Account Service - Handles user account management and character roster
 */
import { AccountRepository } from '../repositories/accountRepository.js';
import { CharRepository } from '../repositories/charRepository.js';
import { InventoryRepository } from '../repositories/inventoryRepository.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';
import { getJobInfo } from '../utils/classNames.js';
import { 
  resolveItemInfo, 
  resolveCardNames, 
  getEquipSlotName, 
  formatItemTitle 
} from '../utils/itemDb.js';

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

    // Hash and update using rAthena VARCHAR(32) MD5 format
    const newHashed = await hashPassword(newPassword, 'md5');
    const updated = await AccountRepository.updatePassword(accountId, newHashed);
    if (!updated) {
      const err = new Error('Failed to update password');
      err.statusCode = 500;
      throw err;
    }

    return { success: true };
  }

  /**
   * Get character inventory and cart items
   */
  static async getCharacterInventory(accountId, charId) {
    const character = await InventoryRepository.getCharacterOwnership(charId, accountId);
    if (!character) {
      const err = new Error('Character not found or does not belong to this account');
      err.statusCode = 404;
      throw err;
    }

    const jobInfo = getJobInfo(character.class);
    const rawInventory = await InventoryRepository.getInventoryByCharId(charId);
    const rawCart = await InventoryRepository.getCartByCharId(charId);

    const mapItem = (item) => {
      const itemInfo = resolveItemInfo(item.nameid);
      const cards = resolveCardNames(item.card0, item.card1, item.card2, item.card3);
      const equipSlotName = getEquipSlotName(item.equip);
      const title = formatItemTitle(item);

      return {
        id: item.id,
        nameId: item.nameid,
        name: itemInfo.name,
        title,
        amount: item.amount,
        type: itemInfo.type,
        slots: itemInfo.slots,
        weight: itemInfo.weight,
        isEquipped: Boolean(item.equip && item.equip > 0),
        equipSlot: item.equip,
        equipSlotName,
        isIdentified: Boolean(item.identify),
        refine: item.refine || 0,
        cards,
        expireTime: item.expire_time || 0,
        uniqueId: item.unique_id || null
      };
    };

    const inventory = rawInventory.map(mapItem);
    const cart = rawCart.map(mapItem);

    // Group equipped items
    const equipment = inventory.filter(i => i.isEquipped);

    return {
      character: {
        charId: character.char_id,
        name: character.name,
        className: jobInfo.name,
        baseLevel: character.base_level,
        jobLevel: character.job_level,
        zeny: character.zeny,
        online: Boolean(character.online)
      },
      inventory,
      cart,
      equipment,
      totalInventoryItems: inventory.length,
      totalCartItems: cart.length
    };
  }

  /**
   * Get account Kafra storage items
   */
  static async getAccountStorage(accountId) {
    const account = await AccountRepository.findById(accountId);
    if (!account) {
      const err = new Error('Account not found');
      err.statusCode = 404;
      throw err;
    }

    const rawStorage = await InventoryRepository.getStorageByAccountId(accountId);
    const storage = rawStorage.map((item) => {
      const itemInfo = resolveItemInfo(item.nameid);
      const cards = resolveCardNames(item.card0, item.card1, item.card2, item.card3);
      const title = formatItemTitle(item);

      return {
        id: item.id,
        nameId: item.nameid,
        name: itemInfo.name,
        title,
        amount: item.amount,
        type: itemInfo.type,
        slots: itemInfo.slots,
        weight: itemInfo.weight,
        isIdentified: Boolean(item.identify),
        refine: item.refine || 0,
        cards,
        expireTime: item.expire_time || 0,
        uniqueId: item.unique_id || null
      };
    });

    return {
      storage,
      totalStorageItems: storage.length
    };
  }
}

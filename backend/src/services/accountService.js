/**
 * Account Service - Handles user account management and character roster
 */
import { AccountRepository } from '../repositories/accountRepository.js';
import { CharRepository } from '../repositories/charRepository.js';
import { InventoryRepository } from '../repositories/inventoryRepository.js';
import { withTransaction } from '../config/db.js';
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

    // Update password using rAthena format (raw plaintext by default)
    const newStoredPassword = await hashPassword(newPassword);
    const updated = await AccountRepository.updatePassword(accountId, newStoredPassword);
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

  /**
   * Delete / Destroy an item from character inventory (Must be offline & unequipped)
   */
  static async deleteCharacterItem(accountId, charId, itemId, amountToDelete = 1) {
    const character = await InventoryRepository.getCharacterOwnership(charId, accountId);
    if (!character) {
      const err = new Error('Character not found or does not belong to this account');
      err.statusCode = 404;
      throw err;
    }

    if (character.online) {
      const err = new Error('Character is currently online in-game. Please log out your character before modifying inventory.');
      err.statusCode = 409;
      throw err;
    }

    const item = await InventoryRepository.getItemById(itemId, charId);
    if (!item) {
      const err = new Error('Item not found in character inventory');
      err.statusCode = 404;
      throw err;
    }

    if (item.equip && item.equip > 0) {
      const err = new Error('Cannot delete an equipped item. Please unequip the item in-game first.');
      err.statusCode = 400;
      throw err;
    }

    const validAmount = Math.max(1, Math.min(amountToDelete, item.amount));
    const itemTitle = formatItemTitle(item);

    const deleted = await InventoryRepository.deleteItem(itemId, charId, validAmount, item.amount);
    if (!deleted) {
      const err = new Error('Failed to delete item from inventory');
      err.statusCode = 500;
      throw err;
    }

    return {
      success: true,
      message: `Successfully destroyed ${validAmount > 1 ? `${validAmount}x ` : ''}${itemTitle}.`,
      deletedAmount: validAmount
    };
  }

  /**
   * Send item to another player via in-game Mail / RODEX (Must be offline & unequipped)
   */
  static async sendCharacterItemMail(accountId, charId, itemId, { recipientName, amount = 1, title, message }) {
    const senderChar = await InventoryRepository.getCharacterOwnership(charId, accountId);
    if (!senderChar) {
      const err = new Error('Sender character not found or does not belong to this account');
      err.statusCode = 404;
      throw err;
    }

    if (senderChar.online) {
      const err = new Error('Your character is currently online in-game. Please log out before dispatching in-game mail.');
      err.statusCode = 409;
      throw err;
    }

    // Find recipient character
    const recipientChar = await InventoryRepository.findCharacterByName(recipientName);
    if (!recipientChar) {
      const err = new Error(`Recipient character "${recipientName}" does not exist in Midgard.`);
      err.statusCode = 404;
      throw err;
    }

    if (recipientChar.char_id === senderChar.char_id) {
      const err = new Error('You cannot send mail to yourself. Use Kafra Storage instead.');
      err.statusCode = 400;
      throw err;
    }

    const item = await InventoryRepository.getItemById(itemId, charId);
    if (!item) {
      const err = new Error('Item not found in character inventory');
      err.statusCode = 404;
      throw err;
    }

    if (item.equip && item.equip > 0) {
      const err = new Error('Cannot send equipped items. Please unequip the item in-game first.');
      err.statusCode = 400;
      throw err;
    }

    const validAmount = Math.max(1, Math.min(amount, item.amount));
    const itemTitle = formatItemTitle(item);

    // Execute atomic transfer
    const result = await withTransaction(async (conn) => {
      // Deduct or remove from sender inventory
      await InventoryRepository.deleteItem(itemId, charId, validAmount, item.amount, conn);

      // Insert mail and attachment
      return await InventoryRepository.sendMailWithAttachment({
        senderChar,
        recipientChar,
        item,
        amountToSend: validAmount,
        title: title || `Web Gift: ${itemTitle}`,
        message: message || `Sent to you from ${senderChar.name} via KelsGaming RO Web Platform.`,
        zenyFee: 0,
        connection: conn
      });
    });

    return {
      success: true,
      message: `Successfully sent ${validAmount > 1 ? `${validAmount}x ` : ''}${itemTitle} to ${recipientChar.name} via in-game mail!`,
      mailId: result.mailId
    };
  }
}

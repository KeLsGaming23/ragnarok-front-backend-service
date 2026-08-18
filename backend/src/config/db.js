/**
 * MariaDB / MySQL Connection Pool for rAthena Integration
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || '3.107.209.130',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'ragnarok',
  password: process.env.DB_PASSWORD || 'ragnarok',
  database: process.env.DB_NAME || 'ragnarok',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 5000
};

let pool = null;
let isConnected = false;
let fallbackMode = false;

// In-memory fallback mock store for development / offline testing when DB port is firewalled
const mockStore = {
  accounts: [
    {
      account_id: 2000001,
      userid: 'testplayer',
      user_pass: '482c811da5d5b4bc6d497ffa98491e38', // MD5 (VARCHAR(32)) for 'password123'
      sex: 'M',
      email: 'player@kelsgaming.ro',
      group_id: 0,
      state: 0,
      unban_time: 0,
      expiration_time: 0,
      logincount: 12,
      lastlogin: new Date().toISOString().slice(0, 19).replace('T', ' '),
      last_ip: '127.0.0.1',
      birthdate: '2000-01-01',
      character_slots: 9,
      pincode: '',
      pincode_change: 0,
      vip_time: 0,
      old_group: 0
    }
  ],
  chars: [
    {
      char_id: 150001,
      account_id: 2000001,
      char_num: 0,
      name: 'KelsLordKnight',
      class: 4008, // Lord Knight
      base_level: 99,
      job_level: 70,
      base_exp: 99999999,
      job_exp: 50000000,
      zeny: 15250000,
      str: 99,
      agi: 70,
      vit: 85,
      int: 25,
      dex: 60,
      luk: 1,
      max_hp: 22450,
      hp: 22450,
      max_sp: 1120,
      sp: 1120,
      status_point: 0,
      skill_point: 0,
      guild_id: 1,
      guild_name: 'KelsGaming Vanguard',
      online: 1,
      last_map: 'prontera',
      last_x: 155,
      last_y: 180,
      last_login: new Date().toISOString().slice(0, 19).replace('T', ' '),
      sex: 'M'
    },
    {
      char_id: 150002,
      account_id: 2000001,
      char_num: 1,
      name: 'KelsHighWizard',
      class: 4010, // High Wizard
      base_level: 95,
      job_level: 65,
      base_exp: 75000000,
      job_exp: 42000000,
      zeny: 8400000,
      str: 1,
      agi: 9,
      vit: 60,
      int: 99,
      dex: 90,
      luk: 9,
      max_hp: 9800,
      hp: 9800,
      max_sp: 2450,
      sp: 2450,
      status_point: 12,
      skill_point: 2,
      guild_id: 1,
      guild_name: 'KelsGaming Vanguard',
      online: 0,
      last_map: 'geffen',
      last_x: 120,
      last_y: 110,
      last_login: new Date(Date.now() - 3600000 * 5).toISOString().slice(0, 19).replace('T', ' '),
      sex: 'M'
    }
  ],
  inventory: [
    {
      id: 9001,
      char_id: 150002, // KelsHighWizard (Offline)
      nameid: 501, // Red Potion
      amount: 50,
      equip: 0,
      identify: 1,
      refine: 0,
      attribute: 0,
      card0: 0,
      card1: 0,
      card2: 0,
      card3: 0,
      expire_time: 0,
      unique_id: null
    },
    {
      id: 9002,
      char_id: 150002,
      nameid: 1161, // Dragon Slayer
      amount: 1,
      equip: 0,
      identify: 1,
      refine: 8,
      attribute: 0,
      card0: 4006, // Hydra Card
      card1: 4006, // Hydra Card
      card2: 0,
      card3: 0,
      expire_time: 0,
      unique_id: null
    },
    {
      id: 9003,
      char_id: 150001, // KelsLordKnight (Online)
      nameid: 1201, // Knife
      amount: 1,
      equip: 2, // Right Hand (Equipped)
      identify: 1,
      refine: 0,
      attribute: 0,
      card0: 0,
      card1: 0,
      card2: 0,
      card3: 0,
      expire_time: 0,
      unique_id: null
    }
  ],
  mail: [],
  mail_attachments: []
};

export async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    fallbackMode = false;
    console.log(`[Database] Successfully connected to MariaDB at ${dbConfig.host}:${dbConfig.port} (database: ${dbConfig.database})`);
    return true;
  } catch (error) {
    isConnected = false;
    fallbackMode = true;
    console.warn(`[Database] Warning: Could not connect to MariaDB at ${dbConfig.host}:${dbConfig.port} (${error.code || error.message}).`);
    console.warn(`[Database] Switching to Local Fallback Store mode for API resilience.`);
    return false;
  }
}

/**
 * Execute a callback within an atomic SQL transaction
 */
export async function withTransaction(callback) {
  if (pool && isConnected && !fallbackMode) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Fallback mode transaction simulation
  return callback({
    execute: async (sql, params) => [executeMockQuery(sql, params)]
  });
}

/**
 * Execute parameterized query on MariaDB or fallback store
 */
export async function executeQuery(sql, params = []) {
  if (pool && isConnected && !fallbackMode) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      console.error('[Database Query Error]:', err.message);
      throw err;
    }
  }

  // Fallback memory emulator for development if MariaDB is firewalled
  return executeMockQuery(sql, params);
}

function executeMockQuery(sql, params) {
  const normalizedSql = sql.trim().toLowerCase();

  // SELECT login WHERE userid = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `login`') || normalizedSql.includes('from login')) && (normalizedSql.includes('where userid =') || normalizedSql.includes('where `userid` =') || normalizedSql.includes('where lower(userid) ='))) {
    const userid = params[0]?.toLowerCase();
    const found = mockStore.accounts.filter(a => a.userid.toLowerCase() === userid);
    return found;
  }

  // SELECT login WHERE email = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `login`') || normalizedSql.includes('from login')) && (normalizedSql.includes('where email =') || normalizedSql.includes('where `email` =') || normalizedSql.includes('where lower(email) ='))) {
    const email = params[0]?.toLowerCase();
    const found = mockStore.accounts.filter(a => a.email.toLowerCase() === email);
    return found;
  }

  // SELECT login WHERE account_id = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `login`') || normalizedSql.includes('from login')) && (normalizedSql.includes('where account_id = ?') || normalizedSql.includes('where `account_id` = ?') || normalizedSql.includes('where l.account_id = ?'))) {
    const accountId = parseInt(params[0], 10);
    const found = mockStore.accounts.filter(a => a.account_id === accountId);
    return found;
  }

  // INSERT INTO login
  if (normalizedSql.includes('insert into login') || normalizedSql.includes('insert into `login`')) {
    const newId = (mockStore.accounts.length > 0)
      ? Math.max(...mockStore.accounts.map(a => a.account_id)) + 1
      : 2000001;
    
    // Params order in accountRepository: [userid, user_pass, sex, email, last_ip, birthdate]
    const newAccount = {
      account_id: newId,
      userid: params[0],
      user_pass: params[1],
      sex: params[2] || 'M',
      email: params[3],
      group_id: 0,
      state: 0,
      unban_time: 0,
      expiration_time: 0,
      logincount: 0,
      lastlogin: null,
      last_ip: params[4] || '127.0.0.1',
      birthdate: params[5] || '2000-01-01',
      character_slots: 9,
      pincode: '',
      pincode_change: 0,
      vip_time: 0,
      old_group: 0
    };
    mockStore.accounts.push(newAccount);
    return { insertId: newId, affectedRows: 1 };
  }

  // UPDATE login (user_pass, state, group_id, pincode, vip_time)
  if (normalizedSql.includes('update login') || normalizedSql.includes('update `login`')) {
    const accId = parseInt(params[params.length - 1], 10);
    const acc = mockStore.accounts.find(a => a.account_id === accId);
    if (acc) {
      if (normalizedSql.includes('user_pass = ?')) acc.user_pass = params[0];
      if (normalizedSql.includes('state = 0')) acc.state = 0;
      else if (normalizedSql.includes('state = 5') || normalizedSql.includes('state = ?')) acc.state = 5;
      if (normalizedSql.includes('group_id = ?')) acc.group_id = params[0];
      if (normalizedSql.includes('pincode =')) acc.pincode = '';
      if (normalizedSql.includes('vip_time =')) acc.vip_time = Math.floor(Date.now() / 1000) + 86400 * 30;
      return { affectedRows: 1, changedRows: 1 };
    }
    return { affectedRows: 1, changedRows: 1 };
  }

  // SELECT FROM char WHERE char_id = ? AND account_id = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char')) && normalizedSql.includes('char_id = ?') && normalizedSql.includes('account_id = ?')) {
    const charId = parseInt(params[0], 10);
    const accountId = parseInt(params[1], 10);
    const found = mockStore.chars.filter(c => c.char_id === charId && c.account_id === accountId);
    return found;
  }

  // SELECT FROM char WHERE account_id = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char')) && (normalizedSql.includes('where account_id = ?') || normalizedSql.includes('where `account_id` = ?') || normalizedSql.includes('where c.account_id = ?'))) {
    const accountId = parseInt(params[0], 10);
    const found = mockStore.chars.filter(c => c.account_id === accountId);
    return found;
  }

  // SELECT FROM char WHERE lower(name) = lower(?)
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char')) && normalizedSql.includes('lower(name) = lower(?)')) {
    const name = String(params[0] || '').toLowerCase();
    const found = mockStore.chars.filter(c => c.name.toLowerCase() === name);
    return found;
  }

  // SELECT FROM char WHERE char_id = ? or c.char_id = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char')) && (normalizedSql.includes('char_id = ?') || normalizedSql.includes('c.char_id = ?'))) {
    const charId = parseInt(params[0], 10);
    const found = mockStore.chars.filter(c => c.char_id === charId);
    return found;
  }

  // SELECT FROM inventory WHERE id = ? AND char_id = ?
  if (normalizedSql.includes('select') && normalizedSql.includes('inventory') && (normalizedSql.includes('where id = ?') || normalizedSql.includes('and id = ?'))) {
    const id = parseInt(params[0], 10);
    const charId = parseInt(params[1], 10);
    return mockStore.inventory.filter(i => i.id === id && i.char_id === charId);
  }

  // SELECT FROM inventory WHERE char_id = ?
  if (normalizedSql.includes('select') && normalizedSql.includes('inventory') && normalizedSql.includes('char_id = ?')) {
    const charId = parseInt(params[0], 10);
    return mockStore.inventory.filter(i => i.char_id === charId);
  }

  // DELETE FROM inventory WHERE id = ? AND char_id = ?
  if (normalizedSql.includes('delete from inventory') && normalizedSql.includes('id = ?') && normalizedSql.includes('char_id = ?')) {
    const id = parseInt(params[0], 10);
    const charId = parseInt(params[1], 10);
    const idx = mockStore.inventory.findIndex(i => i.id === id && i.char_id === charId);
    if (idx !== -1) {
      mockStore.inventory.splice(idx, 1);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // UPDATE inventory SET amount = amount - ? WHERE id = ? AND char_id = ?
  if (normalizedSql.includes('update inventory set amount = amount - ?')) {
    const decr = parseInt(params[0], 10);
    const id = parseInt(params[1], 10);
    const charId = parseInt(params[2], 10);
    const item = mockStore.inventory.find(i => i.id === id && i.char_id === charId);
    if (item) {
      item.amount -= decr;
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // INSERT INTO mail
  if (normalizedSql.includes('insert into mail') || normalizedSql.includes('insert into `mail`')) {
    const newMailId = mockStore.mail.length + 1;
    mockStore.mail.push({ id: newMailId, params });
    return { insertId: newMailId, affectedRows: 1 };
  }

  // INSERT INTO mail_attachments
  if (normalizedSql.includes('insert into mail_attachments') || normalizedSql.includes('insert into `mail_attachments`')) {
    mockStore.mail_attachments.push({ params });
    return { affectedRows: 1 };
  }

  // SELECT online/all characters with join
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `char` c') || normalizedSql.includes('from char c')) && (normalizedSql.includes('left join `login`') || normalizedSql.includes('left join login'))) {
    let list = mockStore.chars;
    if (normalizedSql.includes('c.online > 0') || normalizedSql.includes('c.online = 1') || normalizedSql.includes('online = 1')) {
      list = list.filter(c => c.online === 1);
    }
    return list.map(c => {
      const acc = mockStore.accounts.find(a => a.account_id === c.account_id) || {};
      return {
        ...c,
        account_username: acc.userid || 'testplayer',
        last_ip: acc.last_ip || '127.0.0.1',
        sex: acc.sex || 'M'
      };
    });
  }

  // SELECT FROM storage WHERE account_id = ?
  if (normalizedSql.includes('select') && normalizedSql.includes('storage') && normalizedSql.includes('account_id = ?')) {
    const accId = parseInt(params[0], 10);
    return [
      {
        id: 8001,
        account_id: accId,
        nameid: 607, // Yggdrasil Berry
        amount: 25,
        equip: 0,
        refine: 0,
        card0: 0, card1: 0, card2: 0, card3: 0
      },
      {
        id: 8002,
        account_id: accId,
        nameid: 2357, // Valkyrian Armor
        amount: 1,
        equip: 0,
        refine: 7,
        card0: 4006, card1: 0, card2: 0, card3: 0
      }
    ];
  }

  // UPDATE char SET last_map = 'prontera'... (Unstuck)
  if (normalizedSql.includes('update `char`') || normalizedSql.includes('update char')) {
    if (normalizedSql.includes('last_map = \'prontera\'') || normalizedSql.includes('last_map = ?') || normalizedSql.includes('status_point')) {
      const charId = parseInt(params[params.length - 1], 10);
      const ch = mockStore.chars.find(c => c.char_id === charId);
      if (ch) {
        ch.last_map = 'prontera';
        ch.last_x = 155;
        ch.last_y = 180;
        ch.save_map = 'prontera';
        ch.save_x = 155;
        ch.save_y = 180;
        return { affectedRows: 1, changedRows: 1 };
      }
    }
    return { affectedRows: 1, changedRows: 1 };
  }

  // UPDATE login SET state = ? (Ban / Unban)
  if ((normalizedSql.includes('update `login`') || normalizedSql.includes('update login')) && normalizedSql.includes('state =')) {
    const accId = parseInt(params[params.length - 1], 10);
    const acc = mockStore.accounts.find(a => a.account_id === accId);
    if (acc) {
      acc.state = normalizedSql.includes('state = 0') ? 0 : 5;
      return { affectedRows: 1, changedRows: 1 };
    }
    return { affectedRows: 1, changedRows: 1 };
  }

  // SELECT COUNT(*) FROM char WHERE online = 1
  if (normalizedSql.includes('count') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char')) && normalizedSql.includes('online = 1')) {
    const count = mockStore.chars.filter(c => c.online === 1).length;
    return [{ count, online_count: count }];
  }

  // SELECT FROM login l (Accounts List)
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `login` l') || normalizedSql.includes('from login l'))) {
    if (normalizedSql.includes('l.last_ip = ?')) {
      const ip = params[0];
      return mockStore.accounts.filter(a => (a.last_ip || '127.0.0.1') === ip).map(a => ({
        ...a,
        char_count: mockStore.chars.filter(c => c.account_id === a.account_id).length
      }));
    }
    return mockStore.accounts.map(a => ({
      ...a,
      char_count: mockStore.chars.filter(c => c.account_id === a.account_id).length
    }));
  }

  // UPDATE login SET group_id = ? / pincode / vip_time
  if ((normalizedSql.includes('update `login`') || normalizedSql.includes('update login')) && (normalizedSql.includes('group_id =') || normalizedSql.includes('pincode =') || normalizedSql.includes('vip_time ='))) {
    const accId = parseInt(params[params.length - 1], 10);
    const acc = mockStore.accounts.find(a => a.account_id === accId);
    if (acc) {
      if (normalizedSql.includes('group_id = ?')) acc.group_id = params[0];
      if (normalizedSql.includes('pincode =')) acc.pincode = '';
      if (normalizedSql.includes('vip_time =')) acc.vip_time = Math.floor(Date.now() / 1000) + 86400 * 30;
      return { affectedRows: 1, changedRows: 1 };
    }
    return { affectedRows: 1, changedRows: 1 };
  }

  // SELECT FROM guild
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `guild`') || normalizedSql.includes('from guild'))) {
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

  // SELECT FROM guild_castle
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `guild_castle`') || normalizedSql.includes('from guild_castle'))) {
    return [
      { castle_id: 0, castle_name: 'Neuschwanstein', realm: 'Valkyrie Realms', guild_name: 'KelsGaming Vanguard', defense: 100, economy: 100 },
      { castle_id: 1, castle_name: 'Hohenschwangau', realm: 'Valkyrie Realms', guild_name: 'Unclaimed', defense: 0, economy: 0 },
      { castle_id: 5, castle_name: 'Repherion', realm: 'Britoniah', guild_name: 'Unclaimed', defense: 0, economy: 0 },
      { castle_id: 10, castle_name: 'Sirius', realm: 'Luina', guild_name: 'Unclaimed', defense: 0, economy: 0 },
      { castle_id: 15, castle_name: 'Holy Shadow', realm: 'Greenwood Lake', guild_name: 'Unclaimed', defense: 0, economy: 0 }
    ];
  }

  // SELECT COUNT(*) FROM login WHERE state = 5 or unban_time
  if (normalizedSql.includes('count') && (normalizedSql.includes('from `login`') || normalizedSql.includes('from login')) && (normalizedSql.includes('state = 5') || normalizedSql.includes('unban_time'))) {
    const count = mockStore.accounts.filter(a => a.state === 5).length;
    return [{ count }];
  }

  // SELECT COUNT(*) FROM login
  if (normalizedSql.includes('count') && (normalizedSql.includes('from `login`') || normalizedSql.includes('from login'))) {
    return [{ count: mockStore.accounts.length }];
  }

  // SELECT COUNT(*) FROM char
  if (normalizedSql.includes('count') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char'))) {
    return [{ count: mockStore.chars.length }];
  }

  // SELECT COALESCE(SUM(zeny), 0) FROM char
  if (normalizedSql.includes('sum(zeny)') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char'))) {
    const total = mockStore.chars.reduce((acc, c) => acc + (c.zeny || 0), 0);
    return [{ total_zeny: total }];
  }

  return [];
}

export function getDatabaseStatus() {
  return {
    connected: isConnected && !fallbackMode,
    fallbackMode: fallbackMode,
    host: dbConfig.host,
    database: dbConfig.database
  };
}

export default {
  initDatabase,
  executeQuery,
  getDatabaseStatus
};

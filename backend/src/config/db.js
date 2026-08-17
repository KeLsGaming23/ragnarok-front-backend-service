/**
 * MariaDB / MySQL Connection Pool for rAthena Integration
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || '32.236.113.36',
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
  if (normalizedSql.includes('select') && normalizedSql.includes('login') && normalizedSql.includes('userid =')) {
    const userid = params[0]?.toLowerCase();
    const found = mockStore.accounts.filter(a => a.userid.toLowerCase() === userid);
    return found;
  }

  // SELECT login WHERE email = ?
  if (normalizedSql.includes('select') && normalizedSql.includes('login') && normalizedSql.includes('email =')) {
    const email = params[0]?.toLowerCase();
    const found = mockStore.accounts.filter(a => a.email.toLowerCase() === email);
    return found;
  }

  // SELECT login WHERE account_id = ?
  if (normalizedSql.includes('select') && normalizedSql.includes('login') && normalizedSql.includes('account_id =')) {
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

  // UPDATE login SET user_pass = ? WHERE account_id = ?
  if (normalizedSql.includes('update login') || normalizedSql.includes('update `login`')) {
    if (normalizedSql.includes('user_pass = ?')) {
      const newPass = params[0];
      const accountId = parseInt(params[1], 10);
      const acc = mockStore.accounts.find(a => a.account_id === accountId);
      if (acc) {
        acc.user_pass = newPass;
        return { affectedRows: 1 };
      }
    }
    return { affectedRows: 0 };
  }

  // SELECT FROM char WHERE char_id = ? AND account_id = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char')) && normalizedSql.includes('char_id = ?') && normalizedSql.includes('account_id = ?')) {
    const charId = parseInt(params[0], 10);
    const accountId = parseInt(params[1], 10);
    const found = mockStore.chars.filter(c => c.char_id === charId && c.account_id === accountId);
    return found;
  }

  // SELECT FROM char WHERE account_id = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char')) && normalizedSql.includes('account_id =')) {
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

  // SELECT FROM char WHERE char_id = ?
  if (normalizedSql.includes('select') && (normalizedSql.includes('from `char`') || normalizedSql.includes('from char')) && normalizedSql.includes('char_id = ?')) {
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

  // SELECT COUNT(*) online FROM char WHERE online = 1
  if (normalizedSql.includes('count') && normalizedSql.includes('char') && normalizedSql.includes('online = 1')) {
    const count = mockStore.chars.filter(c => c.online === 1).length;
    return [{ online_count: count }];
  }

  // Generic count
  if (normalizedSql.includes('count(*) as count') && normalizedSql.includes('login')) {
    return [{ count: mockStore.accounts.length }];
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

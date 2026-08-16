/**
 * Authentication Service - Handles registration, login & JWT issuance
 */
import jwt from 'jsonwebtoken';
import { AccountRepository } from '../repositories/accountRepository.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';
import { JWT_CONFIG } from '../config/jwt.js';

export class AuthService {
  /**
   * Register a new player account into rAthena
   */
  static async register({ username, email, password, sex = 'M', ip = '127.0.0.1' }) {
    // 1. Check if username already exists
    const existingUser = await AccountRepository.findByUsername(username);
    if (existingUser) {
      const err = new Error('Username is already taken');
      err.statusCode = 409;
      throw err;
    }

    // 2. Check if email already exists
    const existingEmail = await AccountRepository.findByEmail(email);
    if (existingEmail) {
      const err = new Error('Email address is already in use');
      err.statusCode = 409;
      throw err;
    }

    // 3. Hash password using rAthena-compatible Bcrypt
    const hashedPassword = await hashPassword(password, 'bcrypt');

    // 4. Create account in rAthena database
    const newAccount = await AccountRepository.createAccount({
      username,
      hashedPassword,
      sex,
      email,
      birthdate: '2000-01-01'
    });

    // 5. Generate JWT token for web session
    const payload = {
      accountId: newAccount.accountId,
      username: newAccount.username,
      groupId: 0
    };

    const token = jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expiresIn,
      algorithm: JWT_CONFIG.algorithm
    });

    return {
      token,
      user: {
        accountId: newAccount.accountId,
        username: newAccount.username,
        email: newAccount.email,
        sex: newAccount.sex,
        groupId: 0,
        state: 0
      }
    };
  }

  /**
   * Authenticate a player with rAthena credentials and generate JWT
   */
  static async login({ username, password, ip = '127.0.0.1' }) {
    // 1. Find user by username
    const account = await AccountRepository.findByUsername(username);
    if (!account) {
      const err = new Error('Invalid username or password');
      err.statusCode = 401;
      throw err;
    }

    // 2. Check account ban/block state
    if (account.state !== 0) {
      const err = new Error('Account has been suspended or blocked');
      err.statusCode = 403;
      throw err;
    }

    // 3. Verify password against stored hash
    const isValid = await verifyPassword(password, account.user_pass);
    if (!isValid) {
      const err = new Error('Invalid username or password');
      err.statusCode = 401;
      throw err;
    }

    // 4. Update last login metadata
    await AccountRepository.updateLastLogin(account.account_id, ip).catch(err => {
      console.warn('[AuthService] Could not update last login:', err.message);
    });

    // 5. Generate JWT token
    const payload = {
      accountId: account.account_id,
      username: account.userid,
      groupId: account.group_id
    };

    const token = jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expiresIn,
      algorithm: JWT_CONFIG.algorithm
    });

    return {
      token,
      user: {
        accountId: account.account_id,
        username: account.userid,
        email: account.email,
        sex: account.sex,
        groupId: account.group_id,
        state: account.state,
        lastLogin: account.lastlogin,
        loginCount: account.logincount
      }
    };
  }

  /**
   * Get current authenticated user profile
   */
  static async getMe(accountId) {
    const account = await AccountRepository.findById(accountId);
    if (!account) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    return {
      accountId: account.account_id,
      username: account.userid,
      email: account.email,
      sex: account.sex,
      groupId: account.group_id,
      state: account.state,
      lastLogin: account.lastlogin,
      lastIp: account.last_ip,
      loginCount: account.logincount,
      characterSlots: account.character_slots,
      vipTime: account.vip_time
    };
  }
}

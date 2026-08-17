/**
 * Password utility for rAthena compatible password storage and verification
 * Defaults to raw plaintext passwords to match rAthena server configuration (use_MD5_passwords: no)
 * Also supports backward compatibility with MD5 and Bcrypt hashes for website authentication
 */
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Prepare password for rAthena `login.user_pass` storage.
 * Defaults to raw plaintext string so rAthena login-server and game client match directly.
 * @param {string} password - Plaintext password
 * @param {string} mode - 'raw' (default) or 'md5'
 * @returns {Promise<string>}
 */
export async function hashPassword(password, mode = process.env.PASSWORD_STORAGE_MODE || 'raw') {
  if (!password) {
    return '';
  }

  // If MD5 storage is explicitly configured
  if (mode === 'md5' || process.env.USE_MD5_PASSWORDS === 'true') {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  // Default: Store raw plaintext password
  return password;
}

/**
 * Verify a plaintext password against the stored rAthena `login.user_pass`.
 * Supports raw plaintext, legacy MD5 hashes, and bcrypt hashes.
 * @param {string} plainPassword - Plaintext password entered by user
 * @param {string} storedPass - Password or hash stored in rAthena `login.user_pass`
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plainPassword, storedPass) {
  if (!plainPassword || !storedPass) {
    return false;
  }

  // 1. Direct plaintext comparison (Standard rAthena raw password)
  if (plainPassword === storedPass) {
    return true;
  }

  // 2. MD5 Hash comparison (Legacy 32-character hexadecimal MD5 hash)
  if (/^[a-fA-F0-9]{32}$/.test(storedPass)) {
    const md5Hash = crypto.createHash('md5').update(plainPassword).digest('hex');
    if (md5Hash.toLowerCase() === storedPass.toLowerCase()) {
      return true;
    }
  }

  // 3. Bcrypt comparison (Legacy $2a$ / $2b$ / $2y$ hashes)
  if (storedPass.startsWith('$2a$') || storedPass.startsWith('$2b$') || storedPass.startsWith('$2y$')) {
    try {
      return await bcrypt.compare(plainPassword, storedPass);
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Password utility for rAthena compatible hashing and verification
 */
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

/**
 * Hash a plain password using bcrypt (standard in modern rAthena) or MD5
 * @param {string} password - Plaintext password
 * @param {string} mode - 'bcrypt' | 'md5'
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password, mode = 'bcrypt') {
  if (mode === 'md5') {
    return crypto.createHash('md5').update(password).digest('hex');
  }
  // Default to standard bcrypt ($2a$ / $2b$)
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a plaintext password against a stored rAthena password hash.
 * Automatically recognizes Bcrypt ($2a$, $2b$, $2y$) or MD5 (32-char hex).
 * @param {string} plainPassword - Plaintext password to test
 * @param {string} storedHash - Hash from rAthena `login.user_pass`
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plainPassword, storedHash) {
  if (!plainPassword || !storedHash) {
    return false;
  }

  // Bcrypt hash patterns ($2a$, $2b$, $2y$)
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    try {
      return await bcrypt.compare(plainPassword, storedHash);
    } catch {
      return false;
    }
  }

  // MD5 hash (32 hex characters)
  if (/^[a-fA-F0-9]{32}$/.test(storedHash)) {
    const md5Hash = crypto.createHash('md5').update(plainPassword).digest('hex');
    return md5Hash.toLowerCase() === storedHash.toLowerCase();
  }

  // Plaintext comparison fallback (if server is configured for plaintext in dev)
  return plainPassword === storedHash;
}

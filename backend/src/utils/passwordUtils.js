/**
 * Password utility for rAthena compatible hashing and verification
 * Matches standard rAthena VARCHAR(32) MD5 password storage in `login.user_pass`
 */
import crypto from 'crypto';

/**
 * Hash a plain password using MD5 (Standard rAthena VARCHAR(32) format)
 * @param {string} password - Plaintext password
 * @param {string} mode - 'md5' (default)
 * @returns {Promise<string>} 32-character hexadecimal MD5 hash
 */
export async function hashPassword(password, mode = 'md5') {
  // rAthena VARCHAR(32) standard MD5 hash
  return crypto.createHash('md5').update(password).digest('hex');
}

/**
 * Verify a plaintext password against the stored rAthena `login.user_pass` (VARCHAR(32) MD5)
 * @param {string} plainPassword - Plaintext password to test
 * @param {string} storedHash - Hash from rAthena `login.user_pass`
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plainPassword, storedHash) {
  if (!plainPassword || !storedHash) {
    return false;
  }

  // 1. Standard rAthena MD5 Hash (32 hex characters)
  if (/^[a-fA-F0-9]{32}$/.test(storedHash)) {
    const md5Hash = crypto.createHash('md5').update(plainPassword).digest('hex');
    return md5Hash.toLowerCase() === storedHash.toLowerCase();
  }

  // 2. Direct comparison fallback (if server is configured with plaintext in dev)
  return plainPassword === storedHash;
}

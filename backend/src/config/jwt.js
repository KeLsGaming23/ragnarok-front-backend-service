/**
 * JWT Configuration for KelsGaming RO API Authentication
 */
import dotenv from 'dotenv';
dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'kelsgaming-ro-super-secret-jwt-key-change-in-production-2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  algorithm: 'HS256'
};

/**
 * KelsGaming RO - Server Configuration & Constants
 */
import dotenv from 'dotenv';
dotenv.config();

export const SERVER_CONFIG = {
  name: 'KelsGaming RO',
  tagline: 'Your Adventure Begins Here.',
  publicIp: process.env.RATHENA_HOST || '54.253.142.107',
  ports: {
    login: parseInt(process.env.RATHENA_LOGIN_PORT, 10) || 6900,
    char: parseInt(process.env.RATHENA_CHAR_PORT, 10) || 6121,
    map: parseInt(process.env.RATHENA_MAP_PORT, 10) || 5121,
  },
  pingTimeoutMs: parseInt(process.env.RATHENA_PING_TIMEOUT, 10) || 2000,
  cacheTtlMs: parseInt(process.env.STATUS_CACHE_TTL_MS, 10) || 10000,
  rates: {
    baseExp: process.env.SERVER_BASE_EXP || '25x',
    jobExp: process.env.SERVER_JOB_EXP || '25x',
    dropRate: process.env.SERVER_DROP_RATE || '10x',
    cardDropRate: process.env.SERVER_CARD_DROP || '10x',
    mvpDropRate: process.env.SERVER_MVP_DROP || '5x',
    maxBaseLevel: process.env.SERVER_MAX_BASE_LEVEL || 99,
    maxJobLevel: process.env.SERVER_MAX_JOB_LEVEL || 70,
    maxStats: process.env.SERVER_MAX_STATS || 99,
    maxAspd: process.env.SERVER_MAX_ASPD || 190,
    episode: process.env.SERVER_EPISODE || 'Episode 13.2 - Encounter with the Unknown',
    mechanics: process.env.SERVER_MECHANICS || 'Pre-Renewal Transcendent'
  }
};

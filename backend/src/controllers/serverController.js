/**
 * Server Status & Statistics Controller
 */
import { ServerStatusService } from '../services/serverStatusService.js';
import { CharRepository } from '../repositories/charRepository.js';
import { SERVER_CONFIG } from '../config/serverConfig.js';
import { sendSuccess } from '../utils/responseHandler.js';

export class ServerController {
  static async getStatus(req, res, next) {
    try {
      const forceRefresh = req.query.refresh === 'true';
      const status = await ServerStatusService.getServerStatus(forceRefresh);
      return sendSuccess(res, 'Server status retrieved successfully', status, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getPlayers(req, res, next) {
    try {
      const onlinePlayers = await CharRepository.countOnlinePlayers();
      return sendSuccess(res, 'Online player count retrieved', { onlinePlayers }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getInfo(req, res) {
    return sendSuccess(res, 'Server information retrieved', {
      serverName: SERVER_CONFIG.name,
      tagline: SERVER_CONFIG.tagline,
      publicIp: SERVER_CONFIG.publicIp,
      rates: SERVER_CONFIG.rates,
      features: [
        'Episode 13.2 - Encounter with the Unknown',
        'Official Transcendent Classes (Max Level 99/70)',
        'Gepard Shield 3.0 Anti-Cheat Protected',
        'Balanced 25x/25x/10x Exp and Drop Rates',
        'Dedicated AWS EC2 Infrastructure with High Availability',
        'Guild Wars (WoE) Seasons & Battleground System',
        'Rest & Leveling Quality of Life NPC Features (@autoloot, @alootid, @rates)',
        'Active Game Masters and Thriving Community'
      ]
    }, 200);
  }
}

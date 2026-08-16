/**
 * Server Statistics Repository
 */
import { executeQuery } from '../config/db.js';

export class ServerRepository {
  /**
   * Get server aggregate statistics
   */
  static async getServerStats() {
    try {
      const [accRows, charRows, guildRows] = await Promise.all([
        executeQuery('SELECT COUNT(*) as total_accounts FROM login'),
        executeQuery('SELECT COUNT(*) as total_characters FROM `char`'),
        executeQuery('SELECT COUNT(*) as total_guilds FROM guild').catch(() => [{ total_guilds: 0 }])
      ]);

      return {
        totalAccounts: accRows?.[0]?.total_accounts || 0,
        totalCharacters: charRows?.[0]?.total_characters || 0,
        totalGuilds: guildRows?.[0]?.total_guilds || 0
      };
    } catch {
      return {
        totalAccounts: 0,
        totalCharacters: 0,
        totalGuilds: 0
      };
    }
  }
}

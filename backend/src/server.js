/**
 * KelsGaming RO - Backend Server Entry Point
 */
import app from './app.js';
import { initDatabase } from './config/db.js';
import { SERVER_CONFIG } from './config/serverConfig.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  console.log('====================================================');
  console.log(` Starting ${SERVER_CONFIG.name} REST API Service`);
  console.log(` Tagline: "${SERVER_CONFIG.tagline}"`);
  console.log('====================================================');

  // Attempt database connection
  await initDatabase();

  app.listen(PORT, HOST, () => {
    console.log(`[Server] REST API listening on http://${HOST}:${PORT}`);
    console.log(`[Server] Game Host: ${SERVER_CONFIG.publicIp}`);
    console.log(`[Server] Login Port: ${SERVER_CONFIG.ports.login} | Char: ${SERVER_CONFIG.ports.char} | Map: ${SERVER_CONFIG.ports.map}`);
    console.log(`[Server] API Endpoints: http://localhost:${PORT}/api`);
    console.log('====================================================');
  });
}

// Global process error handlers to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]:', error);
});

startServer();

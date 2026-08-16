/**
 * TCP Ping Utility to verify actual rAthena service availability (Login, Char, Map servers)
 */
import net from 'net';

/**
 * Perform a TCP connection handshake to a specific host and port
 * @param {string} host - IP or domain name
 * @param {number} port - Target TCP port
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<{ online: boolean, latencyMs: number, error?: string }>}
 */
export function pingTcpPort(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const socket = new net.Socket();

    let resolved = false;

    const cleanup = () => {
      socket.removeAllListeners();
      socket.destroy();
    };

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      if (resolved) return;
      resolved = true;
      const latencyMs = Date.now() - startTime;
      cleanup();
      resolve({ online: true, latencyMs });
    });

    socket.on('timeout', () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve({ online: false, latencyMs: timeoutMs, error: 'Connection timed out' });
    });

    socket.on('error', (err) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve({ online: false, latencyMs: Date.now() - startTime, error: err.code || err.message });
    });

    try {
      socket.connect(port, host);
    } catch (err) {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve({ online: false, latencyMs: 0, error: err.message });
    }
  });
}

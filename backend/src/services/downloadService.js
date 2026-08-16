/**
 * Download Service - Client packages, mirrors, and installation specifications
 */
import { SERVER_CONFIG } from '../config/serverConfig.js';

export class DownloadService {
  static getDownloadPackages() {
    return {
      serverName: SERVER_CONFIG.name,
      latestVersion: '1.2.0',
      releaseDate: '2026-08-16',
      fullClient: {
        title: 'KelsGaming RO Full Game Client (Recommended)',
        filename: 'KelsGamingRO_Full_Client_v1.2.0.zip',
        fileSize: '1.85 GB',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        description: 'Complete standalone game client. Includes all Ragnarok sound files, BGM, sprite data, pre-configured KelsGamingRO.exe launcher, and clientinfo.xml pointing directly to 54.253.142.107:6900.',
        isPreconfigured: true,
        setupInstructions: [
          'Download the Full Client ZIP package.',
          'Extract the contents to your preferred directory (e.g. C:\\Games\\KelsGamingRO).',
          'Run KelsGamingRO.exe as Administrator.',
          'Enter your registered username and password to start playing immediately.'
        ],
        mirrors: [
          {
            name: 'Direct High-Speed Server (Primary)',
            url: `http://${SERVER_CONFIG.publicIp}:8080/downloads/KelsGamingRO_Full_Client_v1.2.0.zip`,
            isDirect: true,
            recommended: true
          },
          {
            name: 'Google Drive Mirror',
            url: 'https://drive.google.com/uc?export=download&id=kelsgaming-ro-full-client',
            isDirect: false,
            recommended: false
          },
          {
            name: 'Mega.nz Mirror',
            url: 'https://mega.nz/file/kelsgaming-ro-full-client',
            isDirect: false,
            recommended: false
          },
          {
            name: 'MediaFire Mirror',
            url: 'https://www.mediafire.com/file/kelsgaming-ro-full-client',
            isDirect: false,
            recommended: false
          }
        ]
      },
      litePatch: {
        title: 'KelsGaming RO Lite Patch (For Existing RO Players)',
        filename: 'KelsGamingRO_Lite_Patch_v1.2.0.zip',
        fileSize: '45.2 MB',
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        description: 'Contains only KelsGaming RO data GRFs, custom sprites, and pre-configured KelsGamingRO.exe launcher for players with an existing kRO/rAthena installation.',
        isPreconfigured: true,
        mirrors: [
          {
            name: 'Direct Download',
            url: `http://${SERVER_CONFIG.publicIp}:8080/downloads/KelsGamingRO_Lite_Patch_v1.2.0.zip`,
            isDirect: true,
            recommended: true
          },
          {
            name: 'Google Drive Mirror',
            url: 'https://drive.google.com/uc?export=download&id=kelsgaming-ro-lite-patch',
            isDirect: false,
            recommended: false
          }
        ]
      },
      systemRequirements: {
        minimum: {
          os: 'Windows 7 / 8 / 10 / 11',
          cpu: 'Intel Pentium 4 2.0 GHz or AMD Athlon XP',
          ram: '1 GB RAM',
          gpu: 'DirectX 9.0c compatible graphics card (128 MB VRAM)',
          storage: '4 GB available space',
          directX: 'Version 9.0c'
        },
        recommended: {
          os: 'Windows 10 / 11 (64-bit)',
          cpu: 'Intel Core i3 / AMD Ryzen 3 or higher',
          ram: '4 GB RAM or more',
          gpu: 'NVIDIA GeForce / AMD Radeon with 1GB+ VRAM',
          storage: '6 GB available space (SSD recommended)',
          directX: 'Version 9.0c / 11'
        }
      }
    };
  }
}

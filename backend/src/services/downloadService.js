/**
 * Download Service - Client packages, mirrors, and installation specifications
 */
import { SERVER_CONFIG } from '../config/serverConfig.js';

export class DownloadService {
  static getDownloadPackages() {
    const googleDriveViewUrl = 'https://drive.google.com/file/d/1MaeJbH7gIZErQ9hTETIQf9PyOwso4tLQ/view?usp=sharing';
    const googleDriveDirectUrl = 'https://drive.google.com/uc?export=download&id=1MaeJbH7gIZErQ9hTETIQf9PyOwso4tLQ';

    return {
      serverName: SERVER_CONFIG.name,
      latestVersion: '1.2.0',
      releaseDate: '2026-08-16',
      fullClient: {
        title: 'KelsGaming RO Full Game Client (Google Drive)',
        filename: 'Ragnarok-Configured-Client.zip',
        executableName: '2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe',
        folderName: 'Ragnarok-Configured-Client',
        clientInfoPath: 'Ragnarok-Configured-Client\\data\\clientinfo.xml',
        currentServerIp: SERVER_CONFIG.publicIp,
        fileSize: '1.85 GB',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        description: 'Complete pre-configured standalone game client hosted on Google Drive. Includes all Ragnarok sound effects, BGM, sprite data, and the patched game executable (2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe) pre-configured with clientinfo.xml.',
        isPreconfigured: true,
        setupInstructions: [
          'Download Ragnarok-Configured-Client.zip from Google Drive.',
          'Extract the ZIP file to your preferred folder (e.g. C:\\Games\\Ragnarok-Configured-Client).',
          'Open the folder and run 2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe (create a desktop shortcut for quick 1-click access).',
          'Enter your registered username and password to start playing immediately!',
          'Server IP Changes: For AWS cost efficiency, if the server IP changes, simply edit Ragnarok-Configured-Client\\data\\clientinfo.xml in Notepad and update <address>54.253.142.107</address> with the new IP displayed on our website header.'
        ],
        mirrors: [
          {
            name: 'Google Drive Official Host (Primary)',
            url: googleDriveViewUrl,
            directUrl: googleDriveDirectUrl,
            isDirect: true,
            recommended: true
          },
          {
            name: 'Google Drive Direct Link',
            url: googleDriveDirectUrl,
            isDirect: true,
            recommended: false
          }
        ]
      },
      litePatch: {
        title: 'KelsGaming RO Data & Config Patch',
        filename: 'KelsGamingRO_Config_Patch.zip',
        fileSize: '15.2 MB',
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        description: 'Contains clientinfo.xml and data assets for existing Ragnarok installations.',
        isPreconfigured: true,
        mirrors: [
          {
            name: 'Google Drive Mirror',
            url: googleDriveViewUrl,
            isDirect: true,
            recommended: true
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

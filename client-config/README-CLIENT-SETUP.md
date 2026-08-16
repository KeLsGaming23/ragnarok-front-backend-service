# KelsGaming RO - Game Client Packaging & Setup Guide

This directory contains the exact pre-configured files required to package the **KelsGaming RO** game client for distribution so that players have a 1-click launch experience without needing to edit any configuration or XML files.

---

## Intended Player Experience

1. Player visits `https://your-domain.com/download`
2. Downloads `KelsGamingRO_Full_Client_v1.2.0.zip`
3. Extracts folder to `C:\Games\KelsGamingRO`
4. Runs `KelsGamingRO.exe`
5. Enters their registered account credentials and plays!

---

## Pre-Configured Files

### 1. `clientinfo.xml`
Pre-configured with:
- **Server Name**: `KelsGaming RO`
- **Login Server IP**: `54.253.142.107`
- **Login Port**: `6900`
- **Client Version**: `55` (Compatible with 2018-2022 RO clients)
- **Path in Client**: Place in `data/sclientinfo.xml` or pack into `data.grf` / `KelsGamingRO.grf`.

### 2. `data.ini`
Defines the load order for the GRF archives:
- `0=KelsGamingRO.grf` (Custom server palettes, loading screens, UI skins, maps)
- `1=rdata.grf`
- `2=data.grf` (Core Ragnarok client assets)

---

## Client Packaging Checklist

To produce the final `KelsGamingRO_Full_Client_v1.2.0.zip` for download:

1. **Executable (`KelsGamingRO.exe`)**:
   - Use NEMO or WARP Patcher with standard recommended diffs:
     - `Read Data folder first`
     - `Use Custom Clientinfo` -> `clientinfo.xml` / `sclientinfo.xml`
     - `Disable Packet Encryption` (matches rAthena `packet_db`)
     - `Allow Multiple Windows`
     - `Disable Multiple Game Guard / Anti-cheat clashes`
     - `Restore Old Login Window / Modern Custom UI`
2. **Setup Program (`Setup.exe` / `OpenSetup.exe`)**:
   - Include `OpenSetup.exe` so players can easily change graphics resolution (1920x1080, Fullscreen, Borderless Window) and sound volume.
3. **Sound & BGM**:
   - Include `BGM/` folder with Ragnarok music tracks.
4. **Compression**:
   - Package all files using ZIP / 7z or Inno Setup installer.
   - Host the generated ZIP file on your AWS S3 bucket, Cloudflare R2, Google Drive, or high-speed CDN.
   - Update download URL in `backend/.env` or `downloadService.js`.

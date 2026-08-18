# KelsGaming RO - Game Client Packaging & Setup Guide

This directory contains the exact pre-configured files required for the **KelsGaming RO** game client so that players have an easy 1-click launch experience.

---

## 📥 Official Client Download (Google Drive)

- **Google Drive Link**: [Download Ragnarok-Configured-Client.zip](https://drive.google.com/file/d/1MaeJbH7gIZErQ9hTETIQf9PyOwso4tLQ/view?usp=sharing)
- **Archive Name**: `Ragnarok-Configured-Client.zip`
- **Extracted Folder**: `Ragnarok-Configured-Client/`
- **Game Executable**: `2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe`

---

## 🎮 Intended Player Experience

1. Player visits `http://3.107.209.130/download`
2. Downloads `Ragnarok-Configured-Client.zip` from Google Drive.
3. Extracts folder to `C:\Games\Ragnarok-Configured-Client`.
4. Runs `2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe` (right-clicks to create a desktop shortcut).
5. Enters registered account credentials and plays!

---

## 🔄 Dynamic Server IP Maintenance (No Redownload Needed)

For AWS cloud cost-efficiency, the server IP may occasionally change upon server restarts.
Players **DO NOT** need to redownload the client.

To update the game client to the new IP:
1. Open `Ragnarok-Configured-Client\data\clientinfo.xml` in Notepad.
2. Update the `<address>` tag with the new IP displayed on the website:
   ```xml
   <address>3.107.209.130</address>
   ```
3. Save the file and run the launcher!

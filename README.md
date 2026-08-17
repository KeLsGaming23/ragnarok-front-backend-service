# KelsGaming RO — Full-Stack Ragnarok Online Private Server Platform

Official web platform and REST API service for **KelsGaming RO**, connecting to an rAthena server hosted on AWS EC2 (`32.236.113.36`).

---

## 🌟 Tagline
> **"Your Adventure Begins Here."**

---

## 🏗️ Architecture

```
                    +--------------------------------+
                    |    Player Browser (Frontend)   |
                    +--------------------------------+
                                   |
                                   | REST API (JSON / JWT)
                                   v
                    +--------------------------------+
                    | Node.js / Express API Backend  |
                    |  - Helmet, CORS, Rate Limiters |
                    |  - JWT Bearer Authentication   |
                    |  - TCP Socket Status Monitor   |
                    +--------------------------------+
                                   |
                                   | Parameterized SQL (mysql2)
                                   v
+------------------+        +--------------------------------+
|  Game Client     |        |   MariaDB (rAthena Database)   |
| (KelsGamingRO)   |        |  - `login` table               |
|                  |        |  - `char` table                |
+------------------+        +--------------------------------+
         |                                   ^
         | Direct Game Packets               |
         | (Ports 6900, 6121, 5121)         |
         +-----------------------------------+
         |   rAthena Game Server (AWS EC2)   |
         |  Login: 32.236.113.36:6900        |
         |  Char : 32.236.113.36:6121        |
         |  Map  : 32.236.113.36:5121        |
         +-----------------------------------+
```

---

## 🚀 Key Features

1. **Player Registration & rAthena Compatibility**:
   - Stores passwords in rAthena VARCHAR(32) format (supporting raw plaintext passwords for 100% `use_MD5_passwords: no` game client compatibility).
   - Creates valid player accounts with `group_id: 0`, `state: 0`, and 9 character slots.
   - Issues JWT for authenticated website sessions.
2. **Player Dashboard & Character Roster**:
   - Read-only character roster showing Class Name (e.g. Lord Knight, High Wizard), levels, stats, HP/SP bars, zeny, guild name, and online status.
   - Account security overview and password change functionality.
3. **Intelligent Live Server Health Monitoring**:
   - Active TCP socket pings to Login (`:6900`), Character (`:6121`), and Map (`:5121`) server daemons.
   - Real-time online player count queried from active sessions.
   - 10-second server caching to protect game sockets from flood.
4. **1-Click Pre-Configured Game Client**:
   - Pre-configured `clientinfo.xml` pointing to `32.236.113.36:6900`.
   - Download page with direct high-speed server links and cloud mirrors (Google Drive, Mega, MediaFire).
   - 4-step launch guide: **Download -> Extract -> Run KelsGamingRO.exe -> Play**.
5. **Security & Performance**:
   - Parameterized SQL (zero SQL injection).
   - Strict rate limiters for login & registration (brute-force protection).
   - Helmet security headers and CORS whitelisting.

---

## 📂 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # MariaDB pool, JWT, server constants
│   │   ├── controllers/     # Auth, Account, Server Status, Downloads
│   │   ├── middleware/      # Auth JWT, Rate Limiters, Zod Validators, Error Handler
│   │   ├── repositories/    # Parameterized SQL for `login`, `char`, and server stats
│   │   ├── routes/          # Express REST routers
│   │   ├── services/        # Business logic & TCP socket pingers
│   │   ├── utils/           # Bcrypt hashing, job class maps, response helpers
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.js           # Express application setup
│   │   └── server.js        # Server listener
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Common, Home, Dashboard, and Download components
│   │   ├── context/         # AuthContext with token & user persistence
│   │   ├── pages/           # Home, Register, Login, Dashboard, Downloads, ServerInfo, 404
│   │   ├── services/        # Axios API client
│   │   ├── utils/           # Formatters (Zeny, dates, job badges)
│   │   ├── App.jsx          # Route definitions
│   │   └── index.css        # Tailwind & fantasy dark theme
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── client-config/
    ├── clientinfo.xml       # Pre-configured XML pointing to 32.236.113.36:6900
    ├── data.ini             # GRF load order
    └── README-CLIENT-SETUP.md # Game client builder guide
```

---

## 🛠️ Quick Start

### 1. Start the Backend API Locally
```bash
cd backend
npm install
npm run dev
```
Backend API will be running on `http://localhost:5000/api`.

### 2. Start the Frontend Application Locally
```bash
cd frontend
npm install
npm run dev
```
Frontend Web App will be running on `http://localhost:5173`.

---

## 🚀 AWS EC2 Production Deployment

For complete, step-by-step instructions on deploying this stack to your AWS EC2 Ubuntu instance (`32.236.113.36`) with PM2, Nginx reverse proxy, and SSL, refer to the [Deployment Manual (DEPLOYMENT.md)](./DEPLOYMENT.md).

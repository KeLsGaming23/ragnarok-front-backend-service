# KelsGaming RO - Backend REST API Service

A production-ready Node.js and Express REST API service for **KelsGaming RO**, integrating directly with an AWS EC2 rAthena server (`54.253.142.107`) and MariaDB database.

## Features

- **rAthena Database Integration**: Direct, parameterized SQL queries on `login` and `char` tables.
- **Secure Authentication**: rAthena-compatible MD5 (VARCHAR(32)) password hashing for login server integration, JWT session issuance, and authorization middleware.
- **Real-Time Service Health Monitoring**: Active TCP socket pinging to Login Server (`:6900`), Character Server (`:6121`), and Map Server (`:5121`).
- **Player Dashboard Support**: Character roster lookup with job class mapping, character levels, stats, zeny, and online status.
- **Security Protections**: Helmet headers, CORS policies, brute-force rate limiters, and Zod input validation.
- **Pre-Configured Client Download Metadata**: Mirror management, checksums, and client launch instructions.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new rAthena player account
- `POST /api/auth/login` - Authenticate player and obtain JWT
- `POST /api/auth/logout` - Logout session
- `GET /api/auth/me` - Get current authenticated user details

### Account (`/api/account`)
- `GET /api/account` - Get full account profile and character roster
- `PUT /api/account/password` - Change account password
- `GET /api/account/characters` - Get character roster

### Server (`/api/server`)
- `GET /api/server/status` - Live TCP socket status (Login, Char, Map) and player count
- `GET /api/server/players` - Online player count
- `GET /api/server/info` - Rates, mechanics, and features

### Downloads (`/api/downloads`)
- `GET /api/downloads` - Client download packages, mirrors, and specs

## Running Locally

```bash
cd backend
npm install
npm run dev
```

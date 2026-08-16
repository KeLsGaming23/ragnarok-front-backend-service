# KelsGaming RO — AWS EC2 Ubuntu Deployment Manual

This guide walks you through deploying the **KelsGaming RO** full-stack platform (React Frontend + Node.js REST API) on your AWS EC2 Ubuntu server (`54.253.142.107`) alongside your existing rAthena game server.

---

## 🏗️ Architecture on AWS EC2

```
                       [ Player Web Browser ]
                                 │
                                 │ (Ports 80 / 443)
                                 ▼
                     ┌───────────────────────┐
                     │     Nginx Web Server  │
                     └───────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
       [ Frontend Static ]            [ Reverse Proxy /api ]
       /var/www/.../dist                         │
       (React + Vite SPA)                        ▼
                                     ┌───────────────────────┐
                                     │ Node.js REST API (PM2)│
                                     │  http://127.0.0.1:5000│
                                     └───────────┬───────────┘
                                                 │ (Internal 127.0.0.1:3306)
                                                 ▼
                                     ┌───────────────────────┐
                                     │ MariaDB (rAthena DB)  │
                                     │  login & char tables  │
                                     └───────────────────────┘
```

> [!NOTE]
> Because the REST API backend runs locally on the same EC2 instance as MariaDB, it connects via `127.0.0.1:3306` (or Unix socket). **You do NOT need to open port 3306 to the public internet**, keeping your database 100% secure.

---

## 🔒 1. AWS EC2 Security Group Configuration

In your AWS EC2 Console, navigate to **Instances** &rarr; Select your instance &rarr; **Security** &rarr; **Security Groups** &rarr; **Edit Inbound Rules**:

| Type | Protocol | Port Range | Source | Purpose |
|---|---|---|---|---|
| **SSH** | TCP | `22` | My IP or `0.0.0.0/0` | Server Administration |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | Web Traffic (Certbot / HTTP) |
| **HTTPS** | TCP | `443` | `0.0.0.0/0` | Secure Web Traffic (SSL) |
| **Custom TCP** | TCP | `6900` | `0.0.0.0/0` | rAthena Login Server |
| **Custom TCP** | TCP | `6121` | `0.0.0.0/0` | rAthena Character Server |
| **Custom TCP** | TCP | `5121` | `0.0.0.0/0` | rAthena Map Server |

---

## 💻 2. Connect to Your EC2 Instance

Open your terminal (PowerShell / Command Prompt / Bash) and connect using your SSH key:

```bash
ssh -i "your-key.pem" ubuntu@54.253.142.107
```

Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

---

## 📦 3. Install Node.js 20 LTS, Nginx, and PM2

### A. Install Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Should display v20.x.x
npm -v  # Should display 10.x.x
```

### B. Install PM2 (Process Manager) & Nginx
```bash
sudo npm install -g pm2
sudo apt install -y nginx git
```

---

## 📥 4. Clone the Git Repository

Navigate to `/var/www` and clone your repository:

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www

git clone https://github.com/KeLsGaming23/ragnarok-front-backend-service.git kelsgaming-ro
cd kelsgaming-ro
```

---

## ⚙️ 5. Configure & Start the Backend API

### A. Setup Environment Variables
```bash
cd /var/www/kelsgaming-ro/backend
cp .env.example .env
nano .env
```

Edit your `.env` file with your production parameters:
```ini
PORT=5000
HOST=127.0.0.1
NODE_ENV=production

# Set your web domain or *
CORS_ORIGIN=http://54.253.142.107,https://yourdomain.com

# Generate a strong random string (e.g. openssl rand -base64 32)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_now
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# rAthena Host & Ports (Local on EC2)
RATHENA_HOST=127.0.0.1
RATHENA_LOGIN_PORT=6900
RATHENA_CHAR_PORT=6121
RATHENA_MAP_PORT=5121
RATHENA_PING_TIMEOUT=2000
STATUS_CACHE_TTL_MS=10000

# MariaDB Credentials (Matches your rAthena DB configuration)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=ragnarok
DB_PASSWORD=YOUR_ACTUAL_RATHENA_DB_PASSWORD
DB_NAME=ragnarok
DB_CONNECTION_LIMIT=10

# Server Mechanics & Rates Display
SERVER_BASE_EXP=25x
SERVER_JOB_EXP=25x
SERVER_DROP_RATE=10x
SERVER_CARD_DROP=10x
SERVER_MVP_DROP=5x
SERVER_MAX_BASE_LEVEL=99
SERVER_MAX_JOB_LEVEL=70
SERVER_MAX_STATS=99
SERVER_MAX_ASPD=190
SERVER_EPISODE=Episode 13.2 - Encounter with the Unknown
SERVER_MECHANICS=Pre-Renewal Transcendent
```
*(Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit `nano`)*.

### B. Install Dependencies & Run Verification
```bash
npm install --production
npm test
```

### C. Start the Backend with PM2
```bash
pm2 start src/server.js --name "kelsro-api"
pm2 save
pm2 startup
# (Run the sudo env PATH... command that pm2 startup outputs)
```

Check API status:
```bash
pm2 status
pm2 logs kelsro-api
```

---

## 🎨 6. Build the Frontend Production Bundle

```bash
cd /var/www/kelsgaming-ro/frontend
npm install
npm run build
```
This produces optimized production assets inside `/var/www/kelsgaming-ro/frontend/dist`.

---

## 🌐 7. Configure Nginx Web Server

Create a new Nginx server block:

```bash
sudo nano /etc/nginx/sites-available/kelsgaming-ro
```

Paste the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name 54.253.142.107 yourdomain.com www.yourdomain.com;

    # Frontend Static Build Root
    root /var/www/kelsgaming-ro/frontend/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json image/svg+xml;

    # Serve React SPA Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse Proxy /api Requests to Node.js Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache Static Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Enable the configuration and reload Nginx:

```bash
sudo ln -sf /etc/nginx/sites-available/kelsgaming-ro /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

Now visit `http://54.253.142.107` in your browser! Your site is live!

---

## 🔒 8. Setup Free SSL / HTTPS (Certbot)

If you have a domain name pointing to `54.253.142.107`:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will automatically update the Nginx configuration and set up automatic certificate renewal.

---

## 🔄 9. Fast Update Script (Future Deployments)

Whenever you push new changes to GitHub, you can quickly update the live server with this single script:

Create a deploy script:
```bash
nano /var/www/kelsgaming-ro/deploy.sh
```

Paste:
```bash
#!/bin/bash
set -e

echo "=== Pulling latest changes from GitHub ==="
cd /var/www/kelsgaming-ro
git pull origin main

echo "=== Updating Backend Dependencies & Restarting ==="
cd /var/www/kelsgaming-ro/backend
npm install --production
pm2 restart kelsro-api

echo "=== Rebuilding Frontend Production Bundle ==="
cd /var/www/kelsgaming-ro/frontend
npm install
npm run build

echo "=== Reloading Nginx ==="
sudo systemctl reload nginx

echo "=== Deployment Successful! ==="
```

Make it executable:
```bash
chmod +x /var/www/kelsgaming-ro/deploy.sh
```

To update anytime in the future, simply run:
```bash
./deploy.sh
```

---

## 🔍 Useful Diagnostic Commands

- **Check Backend Logs**: `pm2 logs kelsro-api`
- **Restart Backend**: `pm2 restart kelsro-api`
- **Check Nginx Logs**: `sudo tail -f /var/log/nginx/error.log`
- **Check MariaDB Status**: `sudo systemctl status mariadb`
- **Check rAthena Screen Sessions**: `screen -ls`

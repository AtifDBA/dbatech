# 🚀 DBA Tech Hub — Docker Deployment Guide
## Windows → VM → Cloud Migration Ready

---

## 📁 PROJECT STRUCTURE

```
dbatech/
├── Dockerfile              ← Builds the app image
├── docker-compose.yml      ← Runs all services together
├── .dockerignore           ← Keeps image small
├── .gitignore
├── package.json            ← React dependencies
├── nginx/
│   └── nginx.conf          ← Web server config
├── public/
│   └── index.html          ← HTML entry point
└── src/
    ├── index.js            ← React entry point
    └── App.jsx             ← YOUR WEBSITE CODE
```

---

## 🪟 STEP 1 — Install Prerequisites (Windows)

### 1a. Install Docker Desktop
- Download from: https://www.docker.com/products/docker-desktop/
- Run installer → Restart PC when prompted
- Open Docker Desktop — wait until it shows "Engine running" ✅

### 1b. Install Node.js (needed to build React)
- Download from: https://nodejs.org/ (choose LTS version)
- Run installer with default settings
- Verify in Command Prompt:
  ```
  node --version    ← should show v20.x.x
  npm --version     ← should show 10.x.x
  ```

---

## 🏗️ STEP 2 — Build & Run Locally (Windows)

Open **Command Prompt** or **PowerShell** as Administrator:

```bash
# 1. Navigate to your project folder
cd C:\Users\YourName\dbatech

# 2. Build the Docker image
docker build -t dbatech-hub .

# 3. Run with Docker Compose
docker-compose up -d

# 4. Open your browser
# Go to: http://localhost
```

Your site is now running locally! 🎉

### Useful Docker Commands:
```bash
# See running containers
docker ps

# View logs
docker-compose logs -f

# Stop the site
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Check image size
docker images dbatech-hub
```

---

## 🌐 STEP 3 — Get a Free Domain & Deploy Online

### Option A: Deploy FREE on Render.com (Easiest, no credit card)

1. Create account at https://render.com
2. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/dbatech.git
   git push -u origin main
   ```
3. In Render Dashboard → New → Web Service → Connect GitHub repo
4. Settings:
   - Environment: Docker
   - Plan: Free
5. Your site goes live at: **https://dbatech.onrender.com** (FREE)

### Option B: Add Custom Domain (www.dbatech.com)

Once live on Render/any host:
1. Buy domain at namecheap.com (~$10/year)
2. In Render → Settings → Custom Domains → Add `www.dbatech.com`
3. Render gives you DNS values — paste them in Namecheap DNS settings
4. Wait 10–30 mins → Your site is live at www.dbatech.com ✅

---

## 🖥️ STEP 4 — Migrate to VM (Future)

When you're ready to move to a Virtual Machine (any provider):

```bash
# On your VM (Ubuntu recommended):

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Copy your project to VM (using SCP or Git)
git clone https://github.com/YOUR_USERNAME/dbatech.git
cd dbatech

# Run exactly the same as local!
docker-compose up -d

# Site runs on VM's IP: http://YOUR_VM_IP
```

That's the beauty of Docker — **same command, any machine.** 🎯

---

## ☁️ STEP 5 — Migrate to Cloud (Future)

### AWS (EC2 + ECR)
```bash
# Push image to AWS ECR
aws ecr create-repository --repository-name dbatech-hub
docker tag dbatech-hub:latest YOUR_ECR_URL/dbatech-hub:latest
docker push YOUR_ECR_URL/dbatech-hub:latest

# Pull and run on any EC2 instance
docker pull YOUR_ECR_URL/dbatech-hub:latest
docker-compose up -d
```

### Azure (ACR + ACI)
```bash
# Push to Azure Container Registry
az acr build --registry yourregistry --image dbatech-hub .
```

### Google Cloud Run (Serverless, scales to zero — FREE tier)
```bash
gcloud run deploy dbatech-hub \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔒 STEP 6 — Add Free HTTPS/SSL (Recommended)

Add SSL using Certbot + Let's Encrypt on any VM:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get free SSL certificate
sudo certbot --nginx -d dbatech.com -d www.dbatech.com

# Auto-renew (runs every 12 hours)
sudo systemctl enable certbot.timer
```

Update nginx.conf to listen on port 443 — Certbot does this automatically!

---

## 📦 ADDING NEW FEATURES LATER

To add a PostgreSQL or Oracle database container, uncomment the db section in docker-compose.yml:

```yaml
dbatech-db:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: dbatech
    POSTGRES_USER: admin
    POSTGRES_PASSWORD: securepassword
  volumes:
    - pg-data:/var/lib/postgresql/data
```

Then run: `docker-compose up -d` — DB spins up automatically!

---

## 🗺️ YOUR MIGRATION ROADMAP

```
TODAY          → Docker on Windows (localhost)
NEXT STEP      → Deploy free on Render.com (online URL)
WHEN READY     → Add custom domain www.dbatech.com ($10/yr)
FUTURE         → Move to VM or Cloud (same docker-compose.yml!)
```

**Total cost right now: $0** 🎉

---
name: ehb-deployment
description: Deploy services with Docker, PM2, GitHub Actions, and zero-downtime strategies
---

# EHB Deployment

Deploy APIs, services, and frontend with Docker, PM2, GitHub Actions, and production-grade infrastructure.

## Docker Configuration

### API Service Dockerfile

```dockerfile
# services/api/stl-replit/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

CMD ["node", "server.js"]
```

### Frontend Service Dockerfile

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Next.js
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose (Local Development)

```yaml
# docker-compose.yml
version: "3.8"

services:
  mongodb:
    image: mongo:7
    container_name: ehb-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost/test
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./services/api/stl-replit
      dockerfile: Dockerfile
    container_name: ehb-api
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://root:password@mongodb:27017/ehb?authSource=admin
      JWT_SECRET: dev-secret-key
      PORT: 5000
    depends_on:
      mongodb:
        condition: service_healthy
    volumes:
      - ./services/api/stl-replit:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: ehb-frontend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      NEXT_PUBLIC_API_URL: http://api:5000/api
    depends_on:
      - api
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    command: npm run dev

volumes:
  mongodb_data:
```

## PM2 Ecosystem Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "ehb-api",
      script: "./services/api/stl-replit/server.js",
      instances: "max", // Cluster mode with all CPU cores
      exec_mode: "cluster",
      autorestart: true,
      watch: false, // Disable in production
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      log_file: "./logs/api-combined.log",
      time_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      graceful_shutdown: true,
    },

    {
      name: "ehb-frontend",
      script: "./apps/web/server.js", // Custom Next.js server
      instances: 2,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
    },

    {
      name: "ehb-ai",
      script: "./services/ai/server.js",
      instances: 2,
      exec_mode: "cluster",
      autorestart: true,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
        PORT: 8080,
      },
      error_file: "./logs/ai-error.log",
      out_file: "./logs/ai-out.log",
    },
  ],

  // Deploy configuration
  deploy: {
    production: {
      user: "deploy",
      host: "api.ehb.tech",
      ref: "origin/main",
      repo: "git@github.com:ehb-tech/platform.git",
      path: "/home/deploy/ehb",
      "post-deploy":
        "npm install && npm run build && pm2 restart ecosystem.config.js --env production",
      "pre-deploy-local": "echo 'Deploying to production'",
    },

    staging: {
      user: "deploy",
      host: "staging.ehb.tech",
      ref: "origin/develop",
      repo: "git@github.com:ehb-tech/platform.git",
      path: "/home/deploy/ehb-staging",
      "post-deploy":
        "npm install && npm run build && pm2 restart ecosystem.config.js --env staging",
    },
  },
};
```

## GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    paths:
      - "services/api/**"
      - "apps/web/**"
      - "packages/**"

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - run: npm run test -- --coverage
      - run: npm run test:stl # STL formula must pass
      - run: npm run build

      - uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v3

      - uses: docker/setup-buildx-action@v2

      - uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Build and push API image
      - uses: docker/build-push-action@v4
        with:
          context: ./services/api/stl-replit
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/api:latest
            ghcr.io/${{ github.repository }}/api:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # Build and push frontend image
      - uses: docker/build-push-action@v4
        with:
          context: ./apps/web
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/web:latest
            ghcr.io/${{ github.repository }}/web:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://api.ehb.tech

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /home/deploy/ehb
            git pull origin main
            docker-compose pull
            docker-compose up -d
            npm run health-check

      - name: Notify Slack
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Production deployment successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Production Deployed*\nCommit: ${{ github.sha }}\nAuthor: ${{ github.actor }}"
                  }
                }
              ]
            }

      - name: Rollback on failure
        if: failure()
        run: |
          ssh ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }} \
            "cd /home/deploy/ehb && docker-compose down && docker-compose up -d --build"
```

## Environment Variables Management

```bash
# .env.production (vault-managed, never committed)
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ehb?retryWrites=true
JWT_SECRET=<vault-secret>
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<vault-secret>
AWS_SECRET_ACCESS_KEY=<vault-secret>
SENTRY_DSN=<vault-secret>
```

```javascript
// config/env.js (validate on startup)
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

if (Object.values(env).some((val) => val === undefined)) {
  console.error("Missing required environment variables");
  process.exit(1);
}
```

## Health Check Endpoint

```javascript
// routes/healthRoutes.js
export async function healthCheck(req, res) {
  try {
    const dbHealthy = await mongoose.connection.db.admin().ping();

    res.json({
      service: "EHB API",
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
      version: process.env.npm_package_version,
    });
  } catch (error) {
    res.status(503).json({
      service: "EHB API",
      status: "unhealthy",
      error: error.message,
    });
  }
}

// In server.js:
// app.get("/health", healthCheck);
// app.get("/ready", readinessCheck); // For K8s readiness probes
```

## Zero-Downtime Deployment

```javascript
// Graceful shutdown in server.js
let isShuttingDown = false;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle SIGTERM signal
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, starting graceful shutdown...");
  isShuttingDown = true;

  // Stop accepting new connections
  server.close(() => {
    console.log("HTTP server closed");
  });

  // Allow in-flight requests 30 seconds to complete
  const shutdownTimeout = setTimeout(() => {
    console.error(
      "Graceful shutdown timeout, forcing exit"
    );
    process.exit(1);
  }, 30000);

  // Complete in-flight requests
  await new Promise((resolve) => {
    const checkEmpty = setInterval(() => {
      if (activeRequests === 0) {
        clearInterval(checkEmpty);
        clearTimeout(shutdownTimeout);
        resolve();
      }
    }, 100);
  });

  // Close database connections
  await mongoose.connection.close();
  process.exit(0);
});

// Track active requests
let activeRequests = 0;

app.use((req, res, next) => {
  if (isShuttingDown) {
    res.status(503).json({ error: "Server is shutting down" });
    return;
  }

  activeRequests++;
  res.on("finish", () => {
    activeRequests--;
  });

  next();
});
```

## Monitoring Setup (Sentry)

```javascript
// server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.OnUncaughtException(),
    new Sentry.Integrations.OnUnhandledRejection(),
  ],
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ... routes ...

app.use(Sentry.Handlers.errorHandler());
```

## PM2 Dashboard Monitoring

```bash
# View real-time logs
pm2 logs

# View memory/CPU usage
pm2 monit

# Save PM2 process list
pm2 save

# Resurrect on reboot
pm2 startup

# View PM2 Web Dashboard (port 9615)
pm2 web
```

## Backup Strategy

### Daily Database Backup

```bash
#!/bin/bash
# scripts/backup-db.sh

BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/ehb-mongo-$DATE.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump \
  --uri="$MONGODB_URI" \
  --archive="$BACKUP_FILE" \
  --gzip

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

# Upload to S3
aws s3 cp $BACKUP_FILE s3://ehb-backups/mongodb/

echo "Backup complete: $BACKUP_FILE"
```

### Pre-Deploy Code Backup

```bash
#!/bin/bash
# scripts/pre-deploy-backup.sh

DEPLOY_DIR="/home/deploy/ehb"
BACKUP_DIR="/backups/code"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Create backup
cp -r $DEPLOY_DIR "/backups/code/ehb-$DATE"

# Keep only last 7 deploys
ls -t /backups/code | tail -n +8 | xargs -I {} rm -rf /backups/code/{}

echo "Pre-deploy backup created: ehb-$DATE"
```

## Rollback Procedure

```bash
#!/bin/bash
# scripts/rollback.sh

PREV_VERSION="$1" # e.g., "2024-01-15_14-30-45"
DEPLOY_DIR="/home/deploy/ehb"
BACKUP_DIR="/backups/code"

if [ -z "$PREV_VERSION" ]; then
  echo "Usage: ./rollback.sh <previous-version>"
  exit 1
fi

echo "Rolling back to version: $PREV_VERSION"

# Stop current services
pm2 stop all

# Restore code
cp -r "$BACKUP_DIR/ehb-$PREV_VERSION" "$DEPLOY_DIR"

# Restart services
pm2 restart all

# Health check
sleep 5
curl http://localhost:5000/health

if [ $? -eq 0 ]; then
  echo "Rollback successful"
else
  echo "Rollback failed, manual intervention required"
  exit 1
fi
```

## SSL/Domain Configuration (Nginx)

```nginx
# /etc/nginx/sites-available/ehb

upstream api {
  least_conn;
  server 127.0.0.1:5000 weight=10;
  server 127.0.0.1:5001 weight=10;
  keepalive 64;
}

upstream frontend {
  server 127.0.0.1:3000 weight=10;
  server 127.0.0.1:3001 weight=10;
  keepalive 64;
}

server {
  listen 80;
  server_name api.ehb.tech www.api.ehb.tech;
  
  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name api.ehb.tech;

  ssl_certificate /etc/letsencrypt/live/api.ehb.tech/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.ehb.tech/privkey.pem;

  # SSL settings
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  gzip_min_length 1000;

  # API proxy
  location /api/ {
    proxy_pass http://api;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }

  # Health check endpoint
  location /health {
    proxy_pass http://api;
    access_log off;
  }
}

server {
  listen 443 ssl http2;
  server_name ehb.tech www.ehb.tech;

  ssl_certificate /etc/letsencrypt/live/ehb.tech/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/ehb.tech/privkey.pem;

  # Frontend proxy
  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Deployment Checklist

```bash
# Pre-deployment
- [ ] All tests passing
- [ ] STL formula tests (58/58) passing
- [ ] Code review approved
- [ ] Environment variables set in vault
- [ ] Database migrations tested
- [ ] Backup created
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

# Deployment
- [ ] Run pre-deploy backup
- [ ] Deploy to staging first
- [ ] Run health checks on staging
- [ ] Deploy to production
- [ ] Verify all services healthy
- [ ] Monitor error logs (Sentry)
- [ ] Verify database connections
- [ ] Smoke test key flows

# Post-deployment
- [ ] Monitor CPU/memory (PM2)
- [ ] Check error rates (Sentry)
- [ ] Review slow query logs
- [ ] Monitor Slack alerts
- [ ] Update deployment log
- [ ] Notify team of successful deployment
```

## Monitoring Commands

```bash
# Check service health
curl http://localhost:5000/health
curl http://localhost:3000/health

# View PM2 process list
pm2 list

# Real-time logs
pm2 logs

# Memory usage
pm2 monit

# Restart specific service
pm2 restart ehb-api

# Restart all services
pm2 restart all

# Stop specific service
pm2 stop ehb-api

# View process details
pm2 info ehb-api

# Save current PM2 state
pm2 save

# Resurrect on reboot
pm2 startup
```

## Disaster Recovery

```bash
#!/bin/bash
# scripts/disaster-recovery.sh

BACKUP_DATE="$1" # e.g., "2024-01-15_14-30-45"

if [ -z "$BACKUP_DATE" ]; then
  echo "Available backups:"
  ls /backups/mongodb | head -5
  echo "Usage: ./disaster-recovery.sh <backup-date>"
  exit 1
fi

echo "Recovering from backup: $BACKUP_DATE"

# Stop services
pm2 stop all

# Restore database
mongorestore \
  --uri="$MONGODB_URI" \
  --archive="/backups/mongodb/ehb-mongo-$BACKUP_DATE.gz" \
  --gzip \
  --drop

# Restore code
cp -r "/backups/code/ehb-$BACKUP_DATE" "/home/deploy/ehb"

# Restart services
pm2 restart all

echo "Disaster recovery complete"
```

## Checklist Before Committing

- [ ] Dockerfile builds successfully
- [ ] Docker Compose runs locally
- [ ] PM2 ecosystem config valid
- [ ] Health check endpoint works
- [ ] Graceful shutdown implemented
- [ ] Sentry integration configured
- [ ] Backup scripts tested
- [ ] Rollback procedure documented
- [ ] GitHub Actions workflow valid
- [ ] Environment variables enumerated
- [ ] SSL certificates configured
- [ ] Nginx upstream balancing set up
- [ ] Monitoring alerts configured
- [ ] Pre-deploy and post-deploy checks in place
- [ ] Disaster recovery plan documented
- [ ] Commit message: `chore(infra): description`

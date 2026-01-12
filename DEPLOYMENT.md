<!-- Deployment Guide for Pixie Stylist -->

# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured for production
- [ ] API keys obtained and verified
- [ ] Database migrations completed (if applicable)
- [ ] Build process successful
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Error logging configured
- [ ] Monitoring setup complete

---

## Frontend Deployment

### Option 1: Vercel (Recommended for React)

**Benefits**: Zero-config, automatic deployments, edge functions, analytics

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod

# Configuration (vercel.json)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_API_KEY": "@vite_api_key"
  }
}
```

### Option 2: Netlify

```bash
# Connect to Netlify
netlify deploy --prod --dir=dist

# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[env]
  VITE_API_URL = "https://api.pixie-stylist.com"
```

### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://pixie-stylist-frontend/

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id E1234EXAMPLE \
  --paths "/*"
```

### Option 4: Docker

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t pixie-stylist-frontend .
docker run -p 80:80 pixie-stylist-frontend
```

---

## Backend Deployment

### Option 1: Heroku

```bash
# Create Heroku app
heroku create pixie-stylist-api

# Set environment variables
heroku config:set \
  NODE_ENV=production \
  GOOGLE_AI_API_KEY=your-key \
  LEONARDO_API_KEY=your-key \
  WEATHER_API_KEY=your-key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 2: AWS EC2

```bash
# SSH into instance
ssh -i key.pem ec2-user@your-instance.com

# Clone repository
git clone https://github.com/your-repo.git
cd PixieStylist/backend

# Install dependencies
npm install

# Set environment variables
echo 'GOOGLE_AI_API_KEY=...' > .env
echo 'NODE_ENV=production' >> .env

# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name "pixie-stylist"
pm2 startup
pm2 save

# Configure nginx as reverse proxy
sudo nano /etc/nginx/sites-available/default
# Add:
# server {
#   listen 80;
#   server_name api.pixie-stylist.com;
#   location / {
#     proxy_pass http://localhost:3001;
#   }
# }

sudo systemctl restart nginx
```

### Option 3: DigitalOcean App Platform

```yaml
# app.yaml
name: pixie-stylist-api
services:
- name: backend
  github:
    branch: main
    repo: your-repo/PixieStylist
  build_command: cd backend && npm install
  run_command: npm start
  envs:
  - key: NODE_ENV
    value: production
  - key: GOOGLE_AI_API_KEY
    value: ${GOOGLE_AI_API_KEY}
  - key: LEONARDO_API_KEY
    value: ${LEONARDO_API_KEY}
  http_port: 3001
```

### Option 4: Docker Compose

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      GOOGLE_AI_API_KEY: ${GOOGLE_AI_API_KEY}
      LEONARDO_API_KEY: ${LEONARDO_API_KEY}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://backend:3001/api
    depends_on:
      - backend
```

```bash
docker-compose up -d
```

---

## Database Setup (Production)

### PostgreSQL

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createdb pixie_stylist
sudo -u postgres createuser pixie_user
sudo -u postgres psql

# In psql:
ALTER USER pixie_user WITH ENCRYPTED PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE pixie_stylist TO pixie_user;
\q

# Update connection string
DATABASE_URL=postgresql://pixie_user:password@localhost:5432/pixie_stylist

# Run migrations (if applicable)
npm run migrate
```

---

## Redis Setup (Session Management)

```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server

# Set environment variable
REDIS_URL=redis://localhost:6379

# Optional: Use Redis Cloud
REDIS_URL=redis://default:password@host:port
```

---

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d pixie-stylist.com -d api.pixie-stylist.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Update nginx
sudo nano /etc/nginx/sites-available/default
# Add:
# listen 443 ssl;
# ssl_certificate /etc/letsencrypt/live/pixie-stylist.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/pixie-stylist.com/privkey.pem;

sudo systemctl restart nginx
```

---

## Environment Variables (Production)

### Frontend (.env.production)

```
VITE_API_URL=https://api.pixie-stylist.com/api
VITE_API_KEY=pk_prod_xxxxx
VITE_ENABLE_IMAGE_GENERATION=true
VITE_ENABLE_WEATHER_CONTEXT=true
VITE_ENABLE_TREND_ANALYSIS=true
```

### Backend (.env)

```
# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://pixie-stylist.com

# APIs
GOOGLE_AI_API_KEY=sk_prod_xxxxx
LEONARDO_API_KEY=sk_prod_xxxxx
WEATHER_API_KEY=sk_prod_xxxxx
FLOWISE_API_KEY=sk_prod_xxxxx

# Database
DATABASE_URL=postgresql://user:pass@host:5432/pixie_stylist

# Redis
REDIS_URL=redis://host:6379

# Security
JWT_SECRET=very-long-random-string
API_KEY_SALT=another-random-string

# Logging
LOG_LEVEL=info
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# n8n
N8N_URL=https://n8n.pixie-stylist.com
N8N_WEBHOOK_URL=https://n8n.pixie-stylist.com/webhook/pixie-stylist
```

---

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
npm install @sentry/node

# In server.js
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

### CloudWatch / Datadog

```javascript
// Structured logging
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  service: 'pixie-stylist',
  message: 'Recommendation generated',
  sessionId: 'uuid',
  duration: 4250
}))
```

### Health Checks

```bash
# Configure monitoring
curl https://api.pixie-stylist.com/api/health

# Set up alerts if unhealthy
```

---

## Performance Optimization

### Frontend Optimization

```javascript
// Code splitting with React.lazy
const ChatWindow = lazy(() => import('./components/ChatWindow'))
const OutfitResult = lazy(() => import('./components/OutfitResult'))

// Image optimization
<img src={optimized_url} 
     srcSet="small.jpg 480w, large.jpg 1200w" />

// Caching headers
Cache-Control: public, max-age=31536000
```

### Backend Optimization

```javascript
// Response compression
import compression from 'compression'
app.use(compression())

// Request caching
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 600 })

// Database connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})
```

### CDN Configuration

```
- Store generated images on S3/CloudFront
- Cache API responses where appropriate
- Use edge locations for static assets
```

---

## Backup & Disaster Recovery

### Database Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump pixie_stylist > $BACKUP_DIR/pixie_$DATE.sql
gzip $BACKUP_DIR/pixie_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/pixie_$DATE.sql.gz s3://pixie-backups/

# Delete old backups (keep 30 days)
find $BACKUP_DIR -mtime +30 -delete
```

```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

### Restore from Backup

```bash
gunzip < pixie_20240112_020000.sql.gz | psql pixie_stylist
```

---

## Scaling Considerations

### Horizontal Scaling

```
1. Load Balancer (nginx, HAProxy, AWS ELB)
2. Multiple backend instances
3. Shared database
4. Redis cache
5. CDN for static assets
```

### Vertical Scaling

```
- Increase instance size
- Add more CPU/RAM
- Improve code efficiency
- Optimize database queries
```

### Auto-scaling (AWS)

```bash
# Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name pixie-api-asg \
  --launch-configuration pixie-api-lc \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 3
```

---

## Post-Deployment

1. **Verify Deployment**
   ```bash
   curl https://api.pixie-stylist.com/api/health
   ```

2. **Monitor Initial Traffic**
   - Check error logs
   - Monitor API response times
   - Verify all features working

3. **Gradual Rollout**
   - Start with 10% traffic
   - Monitor metrics
   - Increase to 100%

4. **Set Up Alerts**
   - Error rate > 1%
   - Response time > 5s
   - Database connection issues
   - Memory usage > 80%

5. **Document Configuration**
   - Save deployment logs
   - Document any custom configs
   - Create runbook for on-call team

---

## Rollback Procedure

```bash
# If issues occur, rollback to previous version
git log --oneline

# Revert to previous commit
git revert commit-hash

# Redeploy
git push heroku main
# or
docker pull image:previous-tag
docker run ...
```

---

## Cost Optimization

- **Development**: Free tier services (AWS, Vercel, Heroku)
- **Production**: 
  - Use S3 Intelligent-Tiering
  - CloudFront for CDN
  - RDS Reserved Instances
  - Auto-scaling for variable load
  - Spot instances for non-critical workloads

---

## Maintenance Schedule

- **Daily**: Monitor logs and metrics
- **Weekly**: Security updates and patches
- **Monthly**: Database optimization, backup verification
- **Quarterly**: Full security audit, performance review
- **Annually**: Disaster recovery drill, capacity planning

For questions, refer to the main README.md or contact the development team.

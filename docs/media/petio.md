---
title: "Petio"
sidebar_position: 2
description: "Unraid Plex companion app for media requests and discovery"
tags: ["media", "ibracorp"]
source_url: https://docs.ibracorp.io/petio/
---

# Petio

Unraid Plex companion app for media requests and discovery

:::info Petio Plex Companion
**Video**
[IBRACORP Petio Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Petio Official GitHub](https://github.com/petio-team/petio)
- [Plex Official Website](https://www.plex.tv/)
- [Hotio Docker Repository](https://hotio.dev/)

**Related Videos**
Check IBRACORP YouTube channel for latest tutorials
:::

:::warning Disclaimer
Thank you for choosing to collaborate with IBRACORP 🙏

Please read our disclaimer https://docs.ibracorp.io/#disclaimer
:::

## Credits

| Role | Contributor |
|------|------------|
| Writer / Producer | IBRACORP |
| Video Recording and Voice | IBRACORP |
| Contributor | Petio Team |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Petio Plex Companion Features:**

- Media request management for Plex users
- Integration with Sonarr and Radarr for automated downloading
- User notifications when content becomes available
- Media discovery and review system
- Intuitive interface designed for non-technical users
- User permission management and approval workflows
- Movie and TV show request handling
- Real-time status updates on request processing
- Mobile-responsive web interface

## Prerequisites

**System Requirements:**

- **CPU:** 2+ cores (1.0GHz or higher)
- **RAM:** 2GB minimum (4GB recommended)
- **Storage:** 2GB available space
- **Network:** Stable internet connection
- **Plex Media Server:** Active Plex server installation
- **MongoDB:** Database for Petio data storage

**Required Services:**
- **Plex Media Server** (local or remote)
- **MongoDB Database** (version 4.4.7+ recommended)
- **Sonarr** (optional - for TV show automation)
- **Radarr** (optional - for movie automation)

## Installation

### MongoDB Setup

**MongoDB / Community Applications / Database**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **MongoDB**
3. Configure the container settings:
   - **Container Port:** 27017
   - **Host Port:** 27017
   - **Data Path:** `/mnt/user/appdata/mongodb`
4. **Configure Environment Variables:**
   - **MONGO_INITDB_ROOT_USERNAME:** `admin`
   - **MONGO_INITDB_ROOT_PASSWORD:** `your_secure_password`
5. Click Apply and wait for the container to start

### Petio Docker Installation

**Petio / Hotio Repository / Media Management**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Petio** from **Hotio Repository**
3. Configure the container settings:
   - **WebUI Port:** 7777
   - **Config Path:** `/mnt/user/appdata/petio`
   - **Network Type:** Bridge or custom Docker network
4. **Configure Environment Variables:**
   - **PUID:** 1000
   - **PGID:** 1000
   - **TZ:** America/New_York
5. Click Apply and wait for the container to pull down and start

### Docker Compose

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:4.4.7
    container_name: petio-mongodb
    restart: unless-stopped
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=your_secure_password
    volumes:
      - ./mongodb-data:/data/db
    ports:
      - "27017:27017"

  petio:
    image: hotio/petio:latest
    container_name: petio
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./petio-config:/config
    ports:
      - "7777:7777"
    depends_on:
      - mongodb
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Update passwords and timezone as needed
3. Start the containers:
   ```bash
   docker compose up -d
   ```
4. Access Petio at `http://YOUR_SERVER_IP:7777`

## Configuration

### Initial Setup

**First-Time Configuration:**

1. Navigate to `http://YOUR_SERVER_IP:7777`
2. **Database Connection:**
   - **MongoDB Host:** `mongodb://admin:your_password@mongodb_ip:27017/petio`
   - **Database Name:** `petio`
   - Test connection and proceed
3. **Plex Authentication:**
   - Click **"Login with Plex"**
   - Authorize Petio to access your Plex account
   - Select your Plex server from the list
4. **Admin Setup:**
   - Set secure admin password
   - Configure basic server settings

### Plex Server Integration

**Plex Configuration:**

1. **Server Selection:**
   - Choose your Plex Media Server
   - Verify library access
   - Configure library mapping

2. **Library Setup:**
   - **Movies:** Map to Plex movie libraries
   - **TV Shows:** Map to Plex TV libraries
   - **Music:** Optional music library integration

**Plex Settings in Petio:**
```json
{
  "plex": {
    "server_name": "My Plex Server",
    "server_url": "http://plex:32400",
    "libraries": {
      "movies": "Movies",
      "tv": "TV Shows"
    }
  }
}
```

### Sonarr Integration

**Sonarr Configuration:**

1. Navigate to **Settings → Sonarr**
2. **Connection Settings:**
   - **Host:** `http://sonarr:8989`
   - **API Key:** Your Sonarr API key
   - **Quality Profile:** Default or preferred profile
   - **Root Folder:** `/data/media/tv`

3. **Test Connection:**
   - Verify API connectivity
   - Confirm quality profiles are loaded
   - Test root folder access

**Sonarr Settings:**
```yaml
sonarr:
  host: "http://sonarr:8989"
  api_key: "your_sonarr_api_key"
  quality_profile: "HD-1080p"
  root_folder: "/data/media/tv"
  language_profile: "English"
```

### Radarr Integration

**Radarr Configuration:**

1. Navigate to **Settings → Radarr**
2. **Connection Settings:**
   - **Host:** `http://radarr:7878`
   - **API Key:** Your Radarr API key
   - **Quality Profile:** Default or preferred profile
   - **Root Folder:** `/data/media/movies`

3. **Test Connection:**
   - Verify API connectivity
   - Confirm quality profiles are loaded
   - Test root folder access

**Radarr Settings:**
```yaml
radarr:
  host: "http://radarr:7878"
  api_key: "your_radarr_api_key"
  quality_profile: "HD-1080p"
  root_folder: "/data/media/movies"
  minimum_availability: "announced"
```

## User Management

### User Permissions

**Permission Levels:**

1. **Admin:**
   - Full system access
   - User management
   - System configuration
   - Request approval/denial

2. **User:**
   - Make media requests
   - View request status
   - Browse available content
   - Limited system access

3. **Guest:**
   - Browse content only
   - No request capabilities
   - Read-only access

**User Configuration:**
```json
{
  "users": {
    "default_permissions": "user",
    "auto_approve": false,
    "request_limits": {
      "movies_per_week": 10,
      "tv_shows_per_week": 5
    }
  }
}
```

### Request Management

**Request Workflow:**

1. **User Submits Request:**
   - Search for desired content
   - Select quality preferences
   - Add optional message

2. **Admin Review:**
   - Review request details
   - Check availability
   - Approve or deny with comments

3. **Automated Processing:**
   - Approved requests sent to Sonarr/Radarr
   - Download monitoring
   - User notification when available

**Request Settings:**
```yaml
requests:
  auto_approve_movies: false
  auto_approve_tv: false
  notification_methods:
    - email
    - webhook
  retention_days: 30
```

## Advanced Configuration

### Notification System

**Email Notifications:**

1. **SMTP Configuration:**
   - **Host:** smtp.gmail.com
   - **Port:** 587
   - **Username:** your_email@gmail.com
   - **Password:** app_password
   - **Encryption:** TLS

2. **Email Templates:**
   - Request approved notifications
   - Content available notifications
   - System maintenance alerts

**Webhook Notifications:**
```json
{
  "webhooks": {
    "discord": {
      "url": "https://discord.com/api/webhooks/...",
      "events": ["request_approved", "content_available"]
    },
    "slack": {
      "url": "https://hooks.slack.com/services/...",
      "events": ["request_denied", "system_error"]
    }
  }
}
```

### API Configuration

**API Settings:**

1. **API Key Generation:**
   - Navigate to **Settings → API**
   - Generate new API key
   - Configure rate limiting
   - Set access permissions

2. **API Usage Examples:**
   ```bash
   # Get all requests
   curl -H "X-API-Key: your_api_key" \
     http://petio:7777/api/requests

   # Submit new movie request
   curl -X POST -H "X-API-Key: your_api_key" \
     -H "Content-Type: application/json" \
     -d '{"tmdb_id": 12345, "title": "Movie Title"}' \
     http://petio:7777/api/requests/movie
   ```

### Database Management

**MongoDB Maintenance:**

```bash
# Database backup
mongodump --host mongodb:27017 --username admin --password your_password --db petio --out /backup/

# Database restore
mongorestore --host mongodb:27017 --username admin --password your_password --db petio /backup/petio/

# Database cleanup (remove old requests)
mongo --host mongodb:27017 --username admin --password your_password petio --eval "
  db.requests.deleteMany({
    'createdAt': {
      \$lt: new Date(Date.now() - 30*24*60*60*1000)
    },
    'status': 'completed'
  })
"
```

## Troubleshooting

### Common Issues

**Database Connection Failed:**
- Verify MongoDB container is running
- Check database credentials
- Confirm network connectivity between containers
- Review MongoDB logs for errors

**Plex Authentication Issues:**
- Verify Plex server accessibility
- Check Plex token validity
- Confirm Plex server is claimed
- Review firewall settings

**Sonarr/Radarr Integration Problems:**
- Verify API keys are correct
- Check network connectivity
- Confirm quality profiles exist
- Test root folder permissions

**Request Processing Failures:**
- Review Sonarr/Radarr logs
- Check download client connectivity
- Verify indexer configuration
- Monitor disk space availability

### Performance Optimization

**Database Optimization:**
```javascript
// MongoDB index creation for better performance
db.requests.createIndex({ "user_id": 1, "status": 1 })
db.requests.createIndex({ "created_at": -1 })
db.users.createIndex({ "plex_id": 1 })
```

**Container Resource Limits:**
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 2G
    reservations:
      cpus: '0.5'
      memory: 1G
```

### Log Analysis

**Important Log Locations:**
```bash
# Petio application logs
docker logs petio

# MongoDB logs
docker logs petio-mongodb

# Petio config directory logs
/path/to/petio-config/logs/
```

**Log Commands:**
```bash
# Follow Petio logs in real-time
docker logs -f petio

# Search for specific errors
docker logs petio 2>&1 | grep -i "error"

# Monitor database connections
docker logs petio-mongodb | grep "connection"
```

## Integration with Media Stack

### Complete Media Automation

**Recommended Stack:**
- **Plex** - Media server
- **Petio** - Request management
- **Sonarr** - TV show automation
- **Radarr** - Movie automation
- **Prowlarr** - Indexer management
- **Bazarr** - Subtitle management

**Network Configuration:**
```yaml
networks:
  media-stack:
    external: true

services:
  petio:
    networks:
      - media-stack
```

### Reverse Proxy Setup

**Nginx Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name petio.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://petio:7777;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Maintenance

### Regular Maintenance Tasks

**Weekly Tasks:**
- Review pending requests
- Check database performance
- Monitor storage usage
- Update container images

**Monthly Tasks:**
- Clean up completed requests
- Review user activity
- Backup configuration
- Check for Petio updates

**Backup Script:**
```bash
#!/bin/bash
# petio-backup.sh

BACKUP_DIR="/backup/petio"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup Petio configuration
tar -czf "$BACKUP_DIR/petio-config-$DATE.tar.gz" /path/to/petio-config/

# Backup MongoDB database
mongodump --host mongodb:27017 --username admin --password your_password --db petio --out "$BACKUP_DIR/mongodb-$DATE/"

# Cleanup old backups (keep 7 days)
find "$BACKUP_DIR" -name "*-$DATE*" -mtime +7 -delete
```

## Special Thanks

- **Petio Team** for their excellent Plex companion application
- To our fantastic Discord community and our Admins **DiscDuck** and **Hawks** for their input and documentation (as always)

Please support the developers and creators involved in this work to help show them some love. ❤️

## Final Words

We hope you enjoyed this guide. It was conceptualized, written, and implemented by our Admin **Sycotix**.

## Support Us

Our work sometimes takes months to research and develop.

If you want to help support us please consider:

- Liking and Subscribing to our [Youtube channel](https://youtube.com/@ibracorp)
- Joining our [Discord server](https://discord.gg/ibracorp)
- Becoming a paid member on our [IBRACORP website](https://ibracorp.io)
- Donating via [Paypal](https://paypal.me/ibracorp)

**Thank you for being part of our community!**
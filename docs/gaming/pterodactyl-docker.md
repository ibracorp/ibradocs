---
title: "Pterodactyl Docker"
sidebar_position: 5
description: "Unraid game server management panel using Pterodactyl Docker"
tags: ["gaming", "ibracorp"]
source_url: https://docs.ibracorp.io/pterodactyl-docker-1/
---

# Pterodactyl Docker

Unraid game server management panel using Pterodactyl Docker

:::info Pterodactyl Docker Setup

**Video**
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/gESfcKDX804"
  title="IBRACORP Pterodactyl Docker Tutorial"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>

**Useful Links**
- [Pterodactyl Official Website](https://pterodactyl.io/)
- [Pterodactyl Documentation](https://pterodactyl.io/community/about.html)
- [GitHub Repository](https://github.com/pterodactyl/pterodactyl)

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
| Contributor | Pterodactyl Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Pterodactyl Game Server Management Features:**

- Web-based game server management panel
- Docker container isolation for game servers
- Support for 50+ game server types
- User and permissions management
- Resource allocation controls (CPU, RAM, storage)
- File manager with web-based editing
- Real-time server monitoring and statistics
- Automated backups and scheduling
- Multi-node server management
- SSL/TLS security with reverse proxy support

## Prerequisites

**System Requirements:**

- **CPU:** 4+ cores (2.0GHz or higher)
- **RAM:** 8GB minimum (16GB+ recommended)
- **Storage:** 50GB available space minimum
- **Network:** Stable internet connection with reverse proxy
- **Domain:** Custom domain with SSL certificates

**Required Services:**

- **Nginx Proxy Manager** or **Traefik** (reverse proxy)
- **MariaDB** (database)
- **Redis** (cache)
- **Cloudflare** (DNS provider)
- **SSL Certificates** (Let's Encrypt or Cloudflare)

## Installation

### Prerequisites Setup

**1. MariaDB Database:**
```yaml
version: '3.8'
services:
  mariadb:
    image: mariadb:latest
    container_name: pterodactyl-mariadb
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=your_secure_password
      - MYSQL_DATABASE=pterodactyl
      - MYSQL_USER=pterodactyl
      - MYSQL_PASSWORD=pterodactyl_password
    volumes:
      - ./mariadb-data:/var/lib/mysql
    ports:
      - "3306:3306"
```

**2. Redis Cache:**
```yaml
version: '3.8'
services:
  redis:
    image: redis:alpine
    container_name: pterodactyl-redis
    restart: unless-stopped
    volumes:
      - ./redis-data:/data
    ports:
      - "6379:6379"
```

### Pterodactyl Panel Installation

**Unraid Docker Template:**

1. Head to the Community Applications store in Unraid
2. Search for and install **Pterodactyl Panel**
3. Configure the container settings:
   - **WebUI Port:** 80 (behind reverse proxy)
   - **Database:** Connect to MariaDB instance
   - **Cache:** Connect to Redis instance
   - **Mail Settings:** Configure SMTP (optional)

**Docker Compose Configuration:**
```yaml
version: '3.8'
services:
  pterodactyl-panel:
    image: ghcr.io/pterodactyl/panel:latest
    container_name: pterodactyl-panel
    restart: unless-stopped
    environment:
      # Application settings
      - APP_URL=https://panel.yourdomain.com
      - APP_TIMEZONE=America/New_York
      - APP_SERVICE_AUTHOR=admin@yourdomain.com

      # Database settings
      - DB_HOST=pterodactyl-mariadb
      - DB_PORT=3306
      - DB_DATABASE=pterodactyl
      - DB_USERNAME=pterodactyl
      - DB_PASSWORD=pterodactyl_password

      # Cache settings
      - CACHE_DRIVER=redis
      - SESSION_DRIVER=redis
      - QUEUE_DRIVER=redis
      - REDIS_HOST=pterodactyl-redis
      - REDIS_PORT=6379

      # Mail settings (optional)
      - MAIL_DRIVER=smtp
      - MAIL_HOST=smtp.gmail.com
      - MAIL_PORT=587
      - MAIL_USERNAME=your_email@gmail.com
      - MAIL_PASSWORD=your_app_password
      - MAIL_ENCRYPTION=tls
      - MAIL_FROM=your_email@gmail.com
    volumes:
      - ./panel-data:/app/var/
    ports:
      - "80:80"
    depends_on:
      - mariadb
      - redis
```

### Pterodactyl Wings (Daemon) Installation

**Wings Docker Configuration:**
```yaml
version: '3.8'
services:
  pterodactyl-wings:
    image: ghcr.io/pterodactyl/wings:latest
    container_name: pterodactyl-wings
    restart: unless-stopped
    privileged: true
    environment:
      - TZ=America/New_York
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/containers/:/var/lib/docker/containers/
      - /var/lib/pterodactyl/:/var/lib/pterodactyl/
      - ./wings-config:/etc/pterodactyl/
    ports:
      - "8080:8080"   # Wings API
      - "2022:2022"   # SFTP
    working_dir: /var/lib/pterodactyl
```

## Configuration

### Initial Panel Setup

**1. Access Panel WebUI:**
1. Navigate to `https://panel.yourdomain.com`
2. Complete the installation wizard
3. Create the first admin user:
   ```bash
   # Via container console
   php artisan p:user:make
   ```

**2. Configure Locations:**
1. Navigate to **Admin Panel → Locations**
2. Create a new location (e.g., "US-East-1")
3. Set short code and description

**3. Configure Nodes:**
1. Navigate to **Admin Panel → Nodes**
2. Click **"Create New"**
3. Configure node settings:
   - **Name:** Node-01
   - **Location:** Select created location
   - **FQDN:** node.yourdomain.com
   - **Communicate Over SSL:** Yes
   - **Behind Proxy:** Yes
   - **Daemon Port:** 8080

### Wings Configuration

**1. Generate Configuration:**
1. In Panel, navigate to your node settings
2. Click **"Configuration"** tab
3. Copy the generated configuration
4. Save as `/etc/pterodactyl/config.yml` in Wings container

**2. Wings Configuration File:**
```yaml
debug: false
uuid: YOUR-NODE-UUID
token_id: YOUR-TOKEN-ID
token: YOUR-TOKEN
api:
  host: 0.0.0.0
  port: 8080
  ssl:
    enabled: true
    cert: /etc/ssl/certs/wings.crt
    key: /etc/ssl/private/wings.key
system:
  data: /var/lib/pterodactyl/volumes
  sftp:
    bind_port: 2022
allowed_mounts: []
remote: https://panel.yourdomain.com
```

## Server Management

### Creating Game Servers

**1. Create Server via Panel:**
1. Navigate to **Admin Panel → Servers**
2. Click **"Create New"**
3. Configure server details:
   - **Server Name:** My Game Server
   - **Server Owner:** Select user
   - **Node:** Select configured node
   - **Egg:** Choose game type

**2. Resource Allocation:**
```yaml
# Example allocations
CPU: 100% (2 cores)
Memory: 4096 MB
Disk Space: 10240 MB
Block IO Weight: 500
```

### Supported Games

**Popular Game Server Types:**

| Game | Egg | Default Port |
|------|-----|--------------|
| Minecraft Java | `minecraft:java` | 25565 |
| Minecraft Bedrock | `minecraft:bedrock` | 19132 |
| CS:GO | `source-engine:csgo` | 27015 |
| Rust | `rust:vanilla` | 28015 |
| ARK | `ark:survival_evolved` | 7777 |
| Garry's Mod | `source-engine:gmod` | 27015 |
| Team Fortress 2 | `source-engine:tf2` | 27015 |
| Terraria | `terraria:vanilla` | 7777 |
| Valheim | `valheim:vanilla` | 2456 |

### User Management

**1. Creating Users:**
1. Navigate to **Admin Panel → Users**
2. Click **"Create New"**
3. Configure user details:
   - **Email:** user@example.com
   - **Username:** gaming_user
   - **First/Last Name:** User Name
   - **Password:** Auto-generate or set

**2. Assigning Server Access:**
1. Navigate to server details
2. Go to **"Users"** tab
3. Add users with appropriate permissions:
   - **Owner:** Full control
   - **Subuser:** Limited access

## Advanced Configuration

### SSL Certificate Setup

**1. Cloudflare SSL:**
1. Create A records for:
   - `panel.yourdomain.com` → Panel IP
   - `node.yourdomain.com` → Node IP
2. Configure SSL/TLS mode to **"Full (strict)"**
3. Generate Origin Certificate for Wings

**2. Let's Encrypt (Alternative):**
```bash
# Using Nginx Proxy Manager
# Configure proxy host with Let's Encrypt SSL
# Point to panel container on port 80
```

### Reverse Proxy Configuration

**Nginx Proxy Manager Setup:**
1. Create new Proxy Host
2. Configure domain names:
   - **Domain:** panel.yourdomain.com
   - **Forward Hostname/IP:** pterodactyl-panel
   - **Forward Port:** 80
3. Enable SSL with Let's Encrypt
4. Add WebSocket support for real-time features

### Database Optimization

**MariaDB Configuration (`my.cnf`):**
```ini
[mysqld]
# Performance optimization
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Connection settings
max_connections = 200
max_allowed_packet = 256M

# Query cache
query_cache_type = 1
query_cache_size = 128M
```

## Monitoring and Maintenance

### Server Monitoring

**Built-in Monitoring:**
- Real-time CPU, RAM, and disk usage
- Network statistics and graphs
- Player count and activity logs
- Server startup/shutdown logs

**Log Management:**
```bash
# View panel logs
docker logs pterodactyl-panel

# View wings logs
docker logs pterodactyl-wings

# Access server console logs
# Available through Panel WebUI
```

### Backup Configuration

**1. Automated Backups:**
1. Navigate to server **"Backups"** tab
2. Configure backup schedule:
   - **Frequency:** Daily/Weekly
   - **Retention:** 7-30 days
   - **Files to Include:** Specify patterns

**2. Manual Backup Commands:**
```bash
# Create manual backup via Panel
# Navigate to Server → Backups → Create Backup

# Or via Wings API
curl -X POST "https://node.yourdomain.com:8080/api/servers/{uuid}/backup" \
  -H "Authorization: Bearer {token}"
```

## Troubleshooting

### Common Issues

**Panel Won't Load:**
- Check reverse proxy configuration
- Verify SSL certificates are valid
- Confirm database connectivity
- Review panel container logs

**Wings Connection Failed:**
- Verify Wings container is running
- Check firewall rules for port 8080
- Confirm SSL certificates match
- Review Wings configuration file

**Servers Won't Start:**
- Check available resources (CPU, RAM)
- Verify port availability
- Review server allocation settings
- Check Wings daemon logs

**Database Connection Issues:**
- Verify MariaDB container status
- Check database credentials
- Confirm network connectivity
- Review database logs

### Performance Optimization

**Panel Optimization:**
```php
# config/app.php
'debug' => false,
'cache_driver' => 'redis',
'session_driver' => 'redis',
'queue_driver' => 'redis',
```

**Wings Optimization:**
```yaml
# wings config.yml
system:
  sftp:
    bind_port: 2022
  data: /var/lib/pterodactyl/volumes
  check_permissions_on_boot: false
```

### Log Analysis

**Important Log Locations:**
```bash
# Panel logs
/app/storage/logs/laravel.log

# Wings logs
/var/log/pterodactyl/wings.log

# Server-specific logs
/var/lib/pterodactyl/volumes/{uuid}/logs/
```

## Security Best Practices

### Access Control

**1. User Permissions:**
- Limit admin access to essential personnel
- Use subuser accounts for server management
- Implement strong password policies
- Enable two-factor authentication (if available)

**2. Network Security:**
- Use SSL/TLS for all connections
- Implement firewall rules
- Regularly update containers
- Monitor access logs

### Container Security

**1. Resource Limits:**
```yaml
# Prevent resource exhaustion
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 4G
    reservations:
      cpus: '1.0'
      memory: 2G
```

**2. Network Isolation:**
- Use Docker networks for service isolation
- Limit container permissions
- Regular security updates

## Special Thanks

- **Pterodactyl Development Team** for their excellent game server management platform
- To our fantastic Discord community and our Admins **DiscDuck** and **Hawks** for their input and documentation (as always)

Please support the developers and creators involved in this work to help show them some love. ❤️

## Final Words

We hope you enjoyed this guide. It was conceptualized, written, and implemented by our Admin **Sycotix**.

## Support Us

Our work sometimes takes months to research and develop.

If you want to help support us please consider:

- Liking and Subscribing to our [Youtube channel](https://youtube.com/@ibracorp)
- Joining our [Discord server](https://discord.gg/VWAG7rZ)
- Becoming a paid member on our [IBRACORP website](https://ibracorp.io)
- Donating via [Paypal](https://paypal.me/ibracorp)

**Thank you for being part of our community!**
---
title: "Prowlarr"
sidebar_position: 5
description: "Unraid indexer management for the *arr media automation stack"
tags: ["media", "ibracorp"]
source_url: https://docs.ibracorp.io/prowlarr/
---

# Prowlarr

Unraid indexer management for the *arr media automation stack

:::info Prowlarr Indexer Manager
**Video**
[IBRACORP Prowlarr Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Prowlarr Official GitHub](https://github.com/Prowlarr/Prowlarr)
- [Servarr Wiki](https://wiki.servarr.com/prowlarr)
- [TRaSH Guides](https://trash-guides.info/)

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
| Developer | Prowlarr Team |
| Contributor | Servarr Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Prowlarr Indexer Management Features:**

- Centralized indexer management for *arr applications
- Support for Usenet and Torrent indexers
- Automatic sync of indexers across Sonarr, Radarr, Readarr, and Lidarr
- Manual searching and browsing of trackers and indexers
- Indexer health monitoring and status notifications
- Release pushing directly to download clients
- Built-in support for popular indexers and trackers
- Proxy support for VPN and privacy protection
- API key management and authentication
- Comprehensive logging and statistics

## Prerequisites

**System Requirements:**

- **CPU:** 2+ cores (1.0GHz or higher)
- **RAM:** 1GB minimum (2GB recommended)
- **Storage:** 1GB available space for application data
- **Network:** Stable internet connection
- **VPN:** Recommended for torrent indexer access

**Compatible Applications:**
- **Sonarr** (TV show management)
- **Radarr** (movie management)
- **Readarr** (book management)
- **Lidarr** (music management)

## Installation

### Unraid Docker Template

**Prowlarr / LinuxServer or Hotio Repository / Media Management**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Prowlarr** (LinuxServer or Hotio)
3. Configure the container settings:
   - **WebUI Port:** 9696
   - **Config Path:** `/mnt/user/appdata/prowlarr`
   - **Network Type:** Custom Docker network (recommended for *arr stack)
4. **Configure Environment Variables:**
   - **PUID:** 1000
   - **PGID:** 1000
   - **TZ:** America/New_York
5. Click Apply and wait for the container to pull down and start
6. Access the WebUI at `http://YOUR_SERVER_IP:9696`

### Docker Compose

```yaml
version: '3.8'
services:
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: prowlarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./prowlarr-config:/config
    ports:
      - "9696:9696"
    networks:
      - arr-network

networks:
  arr-network:
    external: true
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Ensure *arr network exists: `docker network create arr-network`
3. Start the container:
   ```bash
   docker compose up -d
   ```
4. Access Prowlarr at `http://YOUR_SERVER_IP:9696`

## Configuration

### Initial Setup

**First-Time Configuration:**

1. Navigate to `http://YOUR_SERVER_IP:9696`
2. Complete the setup wizard:
   - **Authentication:** Configure if desired (optional for local access)
   - **Update Branch:** Develop or Master (Develop recommended)
   - **Proxy Settings:** Configure if using VPN
3. **Base Settings:**
   - Set log level (Info recommended)
   - Configure API key (auto-generated)

### Authentication Setup

**Security Configuration:**

1. Navigate to **Settings → General**
2. **Authentication Method:**
   - **None:** No authentication (local network only)
   - **Basic:** Username/password
   - **Forms:** Login form with sessions
3. **User Management:**
   - Create admin user with secure password
   - Configure session timeout
   - Enable HTTPS if using reverse proxy

### Indexer Configuration

**Adding Indexers:**

1. Navigate to **Indexers** tab
2. Click **"Add Indexer"**
3. **Select Indexer Type:**
   - **Usenet:** NZBGeek, NZBHydra2, Newznab
   - **Torrent:** 1337x, RARBG, Torznab
4. **Configure Indexer Settings:**
   - **Name:** Descriptive name for the indexer
   - **Enable:** Check to activate
   - **Redirect:** Enable for automatic redirects
   - **Priority:** 1-50 (lower number = higher priority)
   - **Download Link:** Magnet or .torrent preference

**Usenet Indexer Example:**
```yaml
indexer_config:
  name: "NZBGeek"
  implementation: "Newznab"
  enable: true
  redirect: true
  priority: 10
  settings:
    base_url: "https://api.nzbgeek.info"
    api_path: "/api"
    api_key: "your_api_key_here"
    categories: [5030, 5040]  # TV HD, TV UHD
    early_download_limit: 3
    daily_api_requests: 100
```

**Torrent Indexer Example:**
```yaml
indexer_config:
  name: "1337x"
  implementation: "1337x"
  enable: true
  redirect: true
  priority: 20
  settings:
    base_url: "https://1337x.to"
    minimum_seeders: 5
    seed_ratio: 1.0
    seed_time: 0
    download_link: "magnet"
```

### Application Sync

**Connecting *arr Applications:**

1. Navigate to **Settings → Apps**
2. Click **"Add Application"**
3. **Configure Application:**
   - **Application Type:** Sonarr, Radarr, Readarr, or Lidarr
   - **Name:** Descriptive name
   - **Sync Level:** Full Sync (recommended)
   - **Server:** `http://sonarr:8989` or IP address
   - **API Key:** Application's API key

**Sonarr Configuration:**
```yaml
app_config:
  name: "Sonarr"
  implementation: "Sonarr"
  sync_level: "fullSync"
  settings:
    prowlarr_url: "http://prowlarr:9696"
    base_url: "http://sonarr:8989"
    api_key: "your_sonarr_api_key"
    sync_categories: [5030, 5040, 5045]  # TV categories
```

**Radarr Configuration:**
```yaml
app_config:
  name: "Radarr"
  implementation: "Radarr"
  sync_level: "fullSync"
  settings:
    prowlarr_url: "http://prowlarr:9696"
    base_url: "http://radarr:7878"
    api_key: "your_radarr_api_key"
    sync_categories: [2000, 2010, 2020]  # Movie categories
```

## Advanced Configuration

### Indexer Profiles

**Creating Custom Profiles:**

1. Navigate to **Settings → Indexer Proxies**
2. Click **"Add Indexer Proxy"**
3. **Configure Profile:**
   - **Name:** Profile description
   - **Type:** HTTP, SOCKS4, SOCKS5
   - **Host:** Proxy server address
   - **Port:** Proxy port
   - **Username/Password:** If required

**Proxy Configuration:**
```yaml
indexer_proxies:
  - name: "VPN Proxy"
    type: "Http"
    host: "proxy.vpnprovider.com"
    port: 8080
    username: "vpn_user"
    password: "vpn_password"
    bypass_proxy_for_local_addresses: true
```

### Download Client Integration

**Adding Download Clients:**

1. Navigate to **Settings → Download Clients**
2. Click **"Add Download Client"**
3. **Configure Client:**
   - **Type:** qBittorrent, Transmission, SABnzbd, etc.
   - **Host:** Download client address
   - **Port:** Client port
   - **Credentials:** Username/password if required

**qBittorrent Configuration:**
```yaml
download_clients:
  - name: "qBittorrent"
    implementation: "QBittorrent"
    enable: true
    priority: 1
    settings:
      host: "qbittorrent"
      port: 8080
      username: "admin"
      password: "admin_password"
      category: "prowlarr"
      initial_state: "start"
      sequential_download: false
      first_and_last_first: false
```

### Categories and Mapping

**Category Configuration:**
```yaml
categories:
  movies:
    - 2000  # Movies
    - 2010  # Movies/Foreign
    - 2020  # Movies/Other
    - 2030  # Movies/SD
    - 2040  # Movies/HD
    - 2050  # Movies/UHD
    - 2060  # Movies/BluRay
    - 2070  # Movies/3D

  tv:
    - 5000  # TV
    - 5010  # TV/WEB-DL
    - 5020  # TV/Foreign
    - 5030  # TV/SD
    - 5040  # TV/HD
    - 5045  # TV/UHD
    - 5050  # TV/Other
    - 5060  # TV/Sport
    - 5070  # TV/Anime
    - 5080  # TV/Documentary

  audio:
    - 3000  # Audio
    - 3010  # Audio/MP3
    - 3020  # Audio/Video
    - 3030  # Audio/Audiobook
    - 3040  # Audio/Lossless
```

## Monitoring and Maintenance

### Health Monitoring

**Indexer Health Checks:**

1. Navigate to **System → Status**
2. Review indexer status indicators:
   - **Green:** Healthy and responding
   - **Yellow:** Warning or rate limited
   - **Red:** Failed or unavailable

**Health Check Configuration:**
```yaml
health_checks:
  indexer_status_check: true
  rss_sync_check: true
  download_client_check: true
  update_check: true
  check_for_finished_download_client_task: true
```

### Logging and Statistics

**Log Configuration:**

1. Navigate to **Settings → General**
2. **Log Level Options:**
   - **Trace:** Most verbose (debugging)
   - **Debug:** Detailed information
   - **Info:** General information (recommended)
   - **Warn:** Warnings only
   - **Error:** Errors only

**Log Analysis:**
```bash
# View container logs
docker logs prowlarr

# Follow logs in real-time
docker logs -f prowlarr

# Search for specific indexer errors
docker logs prowlarr 2>&1 | grep -i "indexer.*error"

# Check sync status
docker logs prowlarr 2>&1 | grep -i "sync"
```

### Performance Monitoring

**Statistics Dashboard:**

1. Navigate to **Statistics** tab
2. Review metrics:
   - **Indexer Performance:** Response times and success rates
   - **API Usage:** Requests per indexer
   - **Search Statistics:** Success/failure rates
   - **Sync Status:** Last sync times and results

**Performance Optimization:**
```yaml
settings:
  rss_sync_interval: 60  # minutes
  maximum_size: 0        # MB (0 = unlimited)
  minimum_age: 0         # minutes
  retention: 0           # days (0 = unlimited)
  indexer_priority_threshold: 10
  preferred_indexer_flags: []
```

## Troubleshooting

### Common Issues

**Indexer Connection Problems:**
```bash
# Test indexer connectivity
curl -I "https://indexer-url.com"

# Check DNS resolution
nslookup indexer-url.com

# Verify API key
curl -H "X-API-Key: your_api_key" "https://indexer-url.com/api"
```

**Application Sync Failures:**
- Verify API keys are correct
- Check network connectivity between containers
- Confirm application URLs are accessible
- Review sync category mappings

**Search Issues:**
- Check indexer status and health
- Verify category mappings
- Review search filters and limits
- Monitor rate limiting

### Rate Limiting

**Managing API Limits:**
```yaml
rate_limiting:
  daily_api_requests: 100
  hourly_api_requests: 10
  request_delay: 1000  # milliseconds
  burst_size: 5
  respect_indexer_rate_limits: true
```

**Rate Limit Monitoring:**
```bash
# Check API usage statistics
docker exec prowlarr cat /config/logs/prowlarr.txt | grep -i "rate"

# Monitor indexer response times
docker exec prowlarr cat /config/logs/prowlarr.txt | grep -i "response.*time"
```

### Error Resolution

**Common Error Solutions:**

1. **"Indexer not available":**
   - Check indexer website status
   - Verify proxy/VPN configuration
   - Update indexer URL if changed

2. **"API key invalid":**
   - Regenerate API key from indexer
   - Update key in Prowlarr configuration
   - Check key format and length

3. **"Connection timeout":**
   - Increase timeout values
   - Check network connectivity
   - Review firewall settings

## Integration Examples

### Complete *arr Stack

**Docker Compose for Full Stack:**
```yaml
version: '3.8'
services:
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: prowlarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./prowlarr-config:/config
    ports:
      - "9696:9696"
    networks:
      - arr-network

  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    container_name: sonarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./sonarr-config:/config
      - /path/to/tv:/tv
      - /path/to/downloads:/downloads
    ports:
      - "8989:8989"
    networks:
      - arr-network

  radarr:
    image: lscr.io/linuxserver/radarr:latest
    container_name: radarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./radarr-config:/config
      - /path/to/movies:/movies
      - /path/to/downloads:/downloads
    ports:
      - "7878:7878"
    networks:
      - arr-network

  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: qbittorrent
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - WEBUI_PORT=8080
    volumes:
      - ./qbittorrent-config:/config
      - /path/to/downloads:/downloads
    ports:
      - "8080:8080"
      - "6881:6881"
      - "6881:6881/udp"
    networks:
      - arr-network

networks:
  arr-network:
    driver: bridge
```

### Backup and Recovery

**Configuration Backup:**
```bash
#!/bin/bash
# prowlarr-backup.sh

BACKUP_DIR="/backup/prowlarr"
CONFIG_DIR="/path/to/prowlarr-config"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup configuration
tar -czf "$BACKUP_DIR/prowlarr-config-$DATE.tar.gz" "$CONFIG_DIR"

# Keep only last 14 backups
find "$BACKUP_DIR" -name "prowlarr-config-*.tar.gz" -mtime +14 -delete
```

**Database Backup:**
```bash
# Backup Prowlarr database
cp /path/to/prowlarr-config/prowlarr.db /backup/prowlarr-db-$(date +%Y%m%d).db

# Restore database
cp /backup/prowlarr-db-20241218.db /path/to/prowlarr-config/prowlarr.db
docker restart prowlarr
```

## Security Best Practices

### VPN Configuration

**VPN Setup for Indexers:**
```yaml
# VPN container example
services:
  vpn:
    image: dperson/openvpn-client
    container_name: vpn
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun
    volumes:
      - ./vpn-config:/vpn
    environment:
      - VPN_CONFIG=/vpn/config.ovpn

  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    network_mode: "service:vpn"
    depends_on:
      - vpn
```

### Access Control

**Reverse Proxy Configuration:**
```nginx
# Nginx configuration
server {
    listen 443 ssl http2;
    server_name prowlarr.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://prowlarr:9696;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Special Thanks

- **Prowlarr Team** for their excellent indexer management application
- **Servarr Community** for comprehensive documentation and support
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
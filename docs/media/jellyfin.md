---
title: "Jellyfin"
sidebar_position: 1
description: "Unraid media server hosting for Jellyfin"
tags: ["media", "ibracorp"]
source_url: https://docs.ibracorp.io/jellyfin/
---

# Jellyfin

Unraid media server hosting for Jellyfin

:::info Jellyfin Media Server
**Video**
[IBRACORP Jellyfin Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Jellyfin Official Website](https://jellyfin.org/)
- [Jellyfin Documentation](https://jellyfin.org/docs/)
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
| Contributor | Jellyfin Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Jellyfin Media Server Features:**

- Free and open-source media management platform
- Manage movie collections with poster displays
- Organize TV shows by season with metadata
- Music library with playlist creation and streaming
- Live TV integration and automatic recording (with tuner)
- Multi-platform client support (web, mobile, streaming devices)
- Hardware transcoding for optimal streaming performance
- No tracking, data collection, or premium features
- Plugin ecosystem for extended functionality
- User management with parental controls

## Prerequisites

**System Requirements:**

- **CPU:** 4+ cores (hardware transcoding capable recommended)
- **RAM:** 4GB minimum (8GB+ recommended for transcoding)
- **Storage:** Sufficient space for media library
- **Network:** Gigabit ethernet recommended for 4K streaming
- **Media Library:** Organized according to TRaSH Guides structure

**Recommended Media Structure:**
```
/data/media/
├── movies/
│   ├── Movie Title (2023)/
│   │   └── Movie Title (2023).mkv
├── tv/
│   ├── TV Show Name (2020)/
│   │   ├── Season 01/
│   │   │   ├── S01E01 - Episode Title.mkv
│   │   │   └── S01E02 - Episode Title.mkv
└── music/
    ├── Artist Name/
    │   ├── Album Name (2023)/
    │   │   ├── 01 - Track Name.flac
```

## Installation

### Unraid Docker Template

**Jellyfin / Community Applications / Media Servers**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Jellyfin**
3. Configure the container settings:
   - **WebUI Port:** 8096
   - **Media Paths:** Map your media directories
   - **Config Path:** `/mnt/user/appdata/jellyfin`
   - **Network Type:** Bridge or custom Docker network
4. **Configure Volume Mappings:**
   - **Config:** `/mnt/user/appdata/jellyfin` → `/config`
   - **Movies:** `/mnt/user/data/media/movies` → `/data/movies`
   - **TV Shows:** `/mnt/user/data/media/tv` → `/data/tv`
   - **Music:** `/mnt/user/data/media/music` → `/data/music`
5. Click Apply and wait for the container to pull down and start
6. Access the WebUI at `http://YOUR_SERVER_IP:8096`

### Docker Compose

```yaml
version: '3.8'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./jellyfin-config:/config
      - /path/to/media/movies:/data/movies
      - /path/to/media/tv:/data/tv
      - /path/to/media/music:/data/music
    ports:
      - "8096:8096"
      - "8920:8920"  # HTTPS
      - "7359:7359/udp"  # Auto-discovery
      - "1900:1900/udp"  # DLNA
    devices:
      - /dev/dri:/dev/dri  # Hardware transcoding (Intel)
    # For NVIDIA GPU transcoding:
    # runtime: nvidia
    # environment:
    #   - NVIDIA_VISIBLE_DEVICES=all
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Update the media paths to match your library structure
3. Configure timezone and user IDs as needed
4. Start the container:
   ```bash
   docker compose up -d
   ```
5. Access the WebUI at `http://YOUR_SERVER_IP:8096`

## Configuration

### Initial Setup

**First-Time Configuration:**

1. Navigate to `http://YOUR_SERVER_IP:8096`
2. Complete the setup wizard:
   - **Language:** Select your preferred language
   - **User Account:** Create admin user with secure password
   - **Media Libraries:** Add your movie, TV, and music libraries
   - **Remote Access:** Configure external access (optional)
   - **Metadata Settings:** Choose preferred metadata providers

**Library Configuration:**

1. **Movies Library:**
   - **Content Type:** Movies
   - **Display Name:** Movies
   - **Folders:** `/data/movies`
   - **Metadata Provider:** The Movie Database (TMDb)

2. **TV Shows Library:**
   - **Content Type:** TV Shows
   - **Display Name:** TV Shows
   - **Folders:** `/data/tv`
   - **Metadata Provider:** The Movie Database (TMDb)

3. **Music Library:**
   - **Content Type:** Music
   - **Display Name:** Music
   - **Folders:** `/data/music`
   - **Metadata Provider:** MusicBrainz

### User Management

**Creating Additional Users:**

1. Navigate to **Dashboard → Users**
2. Click **"Add User"**
3. Configure user settings:
   - **Username:** User display name
   - **Password:** Secure password
   - **Library Access:** Select available libraries
   - **Parental Controls:** Set content ratings if needed

**User Permissions:**
- **Administrator:** Full server management access
- **Standard User:** Media access only
- **Restricted User:** Limited content based on ratings

### Hardware Transcoding

**Intel Quick Sync (Recommended):**

1. **Docker Configuration:**
   ```yaml
   devices:
     - /dev/dri:/dev/dri
   ```

2. **Jellyfin Settings:**
   - Navigate to **Dashboard → Playback**
   - **Hardware Acceleration:** Intel Quick Sync Video
   - **Enable Hardware Decoding:** Check all supported codecs
   - **Enable Hardware Encoding:** Check all supported codecs

**NVIDIA GPU Transcoding:**

1. **Docker Configuration:**
   ```yaml
   runtime: nvidia
   environment:
     - NVIDIA_VISIBLE_DEVICES=all
   ```

2. **Jellyfin Settings:**
   - **Hardware Acceleration:** NVIDIA NVENC
   - **Enable Hardware Decoding:** H.264, HEVC
   - **Enable Hardware Encoding:** H.264, HEVC

## Client Applications

### Supported Platforms

**Web Browsers:**
- Chrome, Firefox, Safari, Edge
- Access via `http://SERVER_IP:8096`

**Mobile Applications:**
- **Android:** Jellyfin for Android (Google Play)
- **iOS:** Jellyfin Mobile (App Store)

**Streaming Devices:**
- **Roku:** Jellyfin for Roku
- **Android TV:** Jellyfin for Android TV
- **Amazon Fire TV:** Jellyfin for Fire TV
- **Apple TV:** Jellyfin for Apple TV (via App Store)

**Desktop Applications:**
- **Windows:** Jellyfin Theater, Jellyfin MPV Shim
- **macOS:** Jellyfin Theater, Jellyfin MPV Shim
- **Linux:** Jellyfin Theater, Jellyfin MPV Shim

**Media Centers:**
- **Kodi:** Jellyfin for Kodi addon
- **Emby:** Limited compatibility

### Remote Access Configuration

**Secure Remote Access:**

1. **HTTPS Setup:**
   - Navigate to **Dashboard → Networking**
   - **Secure Connection Mode:** Handled by reverse proxy
   - **External Domain:** `jellyfin.yourdomain.com`

2. **Reverse Proxy (Nginx):**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name jellyfin.yourdomain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           proxy_pass http://jellyfin:8096;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_set_header X-Forwarded-Host $server_name;
       }
   }
   ```

## Advanced Configuration

### Plugin Management

**Popular Plugins:**

1. **TMDb Box Sets** - Enhanced movie collection support
2. **Trakt** - Scrobbling and sync with Trakt.tv
3. **Subtitle Plugins** - Additional subtitle providers
4. **LDAP Authentication** - Enterprise user management
5. **Webhook** - Notifications and automation integration

**Installing Plugins:**
1. Navigate to **Dashboard → Plugins**
2. Click **"Catalog"**
3. Browse available plugins and click **"Install"**
4. Restart Jellyfin to activate plugins

### Library Optimization

**Metadata Refresh:**
```bash
# Force metadata refresh for all libraries
# Via Dashboard → Libraries → Scan All Libraries

# Or via CLI (if SSH access available)
curl -X POST "http://localhost:8096/Library/Refresh" \
  -H "X-Emby-Token: YOUR_API_KEY"
```

**Database Optimization:**
- **Scheduled Tasks:** Configure automatic library scans
- **Image Caching:** Enable image extraction for better performance
- **Metadata Downloading:** Optimize provider priority

### Monitoring and Maintenance

**System Monitoring:**

1. **Dashboard Overview:**
   - Active streams and transcoding
   - Server performance metrics
   - Recent media additions

2. **Log Management:**
   - **Location:** `/config/log/`
   - **Log Levels:** Debug, Information, Warning, Error
   - **Log Rotation:** Automatic cleanup of old logs

**Backup Strategy:**

```bash
# Backup Jellyfin configuration
tar -czf jellyfin-backup-$(date +%Y%m%d).tar.gz /path/to/jellyfin-config/

# Backup database specifically
cp /path/to/jellyfin-config/data/jellyfin.db /backup/location/
```

## Troubleshooting

### Common Issues

**Transcoding Failures:**
- Verify hardware acceleration is properly configured
- Check available disk space for transcoding directory
- Review transcoding logs for specific codec errors
- Ensure sufficient CPU/GPU resources

**Library Scanning Issues:**
- Verify file permissions on media directories
- Check media file naming conventions (TRaSH Guides)
- Review scanning logs for specific errors
- Ensure network connectivity to metadata providers

**Playback Problems:**
- Check client compatibility with media codecs
- Verify network bandwidth for streaming quality
- Review transcoding settings and profiles
- Test direct play vs. transcoded playback

**Remote Access Issues:**
- Confirm port forwarding for port 8096
- Check firewall settings on server and router
- Verify reverse proxy configuration
- Test local access before troubleshooting remote

### Performance Optimization

**Server Optimization:**
```yaml
# Docker resource limits
deploy:
  resources:
    limits:
      cpus: '4.0'
      memory: 8G
    reservations:
      cpus: '2.0'
      memory: 4G
```

**Database Optimization:**
- Regular database cleanup via scheduled tasks
- Monitor database size and performance
- Consider SSD storage for Jellyfin config directory

### Log Analysis

**Important Log Locations:**
```bash
# Main Jellyfin logs
/config/log/jellyfin.log

# FFmpeg transcoding logs
/config/log/ffmpeg-*.txt

# Plugin logs
/config/log/plugin_*.log
```

**Log Commands:**
```bash
# View real-time logs
docker logs -f jellyfin

# Search for specific errors
grep -i "error" /path/to/jellyfin-config/log/jellyfin.log

# Monitor transcoding activity
tail -f /path/to/jellyfin-config/log/ffmpeg-*.txt
```

## Integration

### Media Automation Stack

**Recommended Companions:**
- **Sonarr** - TV show management and downloading
- **Radarr** - Movie management and downloading
- **Prowlarr** - Indexer management
- **Bazarr** - Subtitle management
- **Overseerr/Jellyseerr** - Request management

**Integration Configuration:**
1. Configure media automation tools to use same directory structure
2. Set up webhook notifications between services
3. Ensure proper file permissions across all containers

### Backup and Sync

**Automated Backup Script:**
```bash
#!/bin/bash
# jellyfin-backup.sh

BACKUP_DIR="/backup/jellyfin"
CONFIG_DIR="/path/to/jellyfin-config"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup configuration
tar -czf "$BACKUP_DIR/jellyfin-config-$DATE.tar.gz" "$CONFIG_DIR"

# Keep only last 7 backups
find "$BACKUP_DIR" -name "jellyfin-config-*.tar.gz" -mtime +7 -delete
```

## Special Thanks

- **Jellyfin Team** for their excellent open-source media server platform
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
---
title: "Plex Trakt Sync"
sidebar_position: 4
description: "Unraid synchronization between Plex and Trakt.tv"
tags: ["media", "ibracorp"]
source_url: https://docs.ibracorp.io/plex-trakt-sync/
---

# Plex Trakt Sync

Unraid synchronization between Plex and Trakt.tv

:::info Plex Trakt Sync
**Video**
[IBRACORP Plex Trakt Sync Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [PlexTraktSync GitHub](https://github.com/Taxel/PlexTraktSync)
- [Trakt.tv Official Website](https://trakt.tv/)
- [Trakt API Applications](https://trakt.tv/oauth/applications)

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
| Developer | Taxel |
| Contributor | PlexTraktSync Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Plex Trakt Sync Features:**

- Bidirectional sync between Plex and Trakt.tv
- Synchronize watched status for movies and TV shows
- Sync ratings between platforms (Trakt takes precedence)
- Add Plex media to Trakt collection automatically
- Download liked lists from Trakt to Plex
- Support for multiple Plex servers
- Configurable sync intervals and options
- No Plex Pass or Trakt VIP subscription required
- Support for 2-Factor Authentication
- Detailed logging and error reporting

## Prerequisites

**System Requirements:**

- **CPU:** 1+ cores (minimal requirements)
- **RAM:** 512MB minimum (1GB recommended)
- **Storage:** 1GB available space
- **Network:** Stable internet connection
- **Plex Media Server:** Active Plex server with libraries
- **Trakt.tv Account:** Free account sufficient

**Required Accounts:**
- **Trakt.tv Account** - Free registration at https://trakt.tv/
- **Trakt API Application** - Created via developer settings
- **Plex Account** - Access to your Plex server

## Installation

### Trakt API Application Setup

**Create Trakt Application:**

1. Visit https://trakt.tv/oauth/applications
2. Click **"New Application"**
3. **Application Configuration:**
   - **Name:** PlexTraktSync
   - **Description:** Sync between Plex and Trakt
   - **Redirect URI:** `urn:ietf:wg:oauth:2.0:oob`
   - **Permissions:** Check all available permissions
4. Save application and note **Client ID** and **Client Secret**

### Unraid Docker Installation

**PlexTraktSync / Community Applications / Media Management**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **PlexTraktSync**
3. Configure the container settings:
   - **Config Path:** `/mnt/user/appdata/plextraktsync`
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
  plextraktsync:
    image: ghcr.io/taxel/plextraktsync:latest
    container_name: plextraktsync
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./plextraktsync-config:/app/config
    tty: true
    stdin_open: true
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Create the config directory
3. Start the container:
   ```bash
   docker compose up -d
   ```
4. Configure authentication as described below

## Configuration

### Initial Authentication

**First-Time Setup:**

1. **Access Container Console:**
   ```bash
   docker exec -it plextraktsync bash
   ```

2. **Run Initial Configuration:**
   ```bash
   python3 -m plextraktsync
   ```

3. **Trakt Authentication:**
   - Enter your Trakt **Client ID**
   - Enter your Trakt **Client Secret**
   - Visit the provided authorization URL
   - Enter the authorization code

4. **Plex Authentication:**
   - Enter your Plex server URL (e.g., `http://plex:32400`)
   - Enter your Plex username
   - Enter your Plex password
   - If using 2FA, enter the verification code

### Configuration Files

**Main Configuration (.env):**
```bash
# Trakt API Configuration
TRAKT_CLIENT_ID=your_client_id_here
TRAKT_CLIENT_SECRET=your_client_secret_here

# Plex Configuration
PLEX_SERVER=http://plex:32400
PLEX_USERNAME=your_plex_username
PLEX_PASSWORD=your_plex_password

# Optional: Specific Plex server name
PLEX_SERVER_NAME=My Plex Server

# Logging Configuration
LOG_LEVEL=INFO
```

**Sync Configuration (config.yml):**
```yaml
# Sync behavior
sync:
  # Add Plex items to Trakt collection
  plex_to_trakt:
    collection: true
    watched_status: true
    ratings: true

  # Add Trakt items to Plex
  trakt_to_plex:
    liked_lists: true
    watchlist: true
    watched_status: true
    ratings: true

# Server-specific settings
servers:
  - name: "My Plex Server"
    url: "http://plex:32400"
    token: "your_plex_token"

# Logging
logging:
  debug: false
  append: false

# Rate limiting
api:
  delay: 1.0
  timeout: 30

# Library mappings
library_mapping:
  - plex: "Movies"
    trakt: "movies"
  - plex: "TV Shows"
    trakt: "shows"
```

### Authentication Files

**Trakt Token (.pytrakt.json):**
```json
{
    "TRAKT_CLIENT_ID": "your_client_id",
    "TRAKT_CLIENT_SECRET": "your_client_secret",
    "OAUTH_EXPIRES_AT": "2024-12-31T23:59:59.000000",
    "OAUTH_REFRESH": "your_refresh_token",
    "OAUTH_TOKEN": "your_access_token"
}
```

**Plex Token (.env addition):**
```bash
PLEX_TOKEN=your_plex_token_here
```

## Usage and Operations

### Manual Sync

**Basic Sync Commands:**
```bash
# Full sync (both directions)
docker exec plextraktsync python3 -m plextraktsync

# Dry run (no changes made)
docker exec plextraktsync python3 -m plextraktsync --dry-run

# Sync specific libraries
docker exec plextraktsync python3 -m plextraktsync --library "Movies"

# Verbose logging
docker exec plextraktsync python3 -m plextraktsync --verbose

# Clear cache and resync
docker exec plextraktsync python3 -m plextraktsync --clear-cache
```

### Automated Scheduling

**Cron Setup (Unraid User Scripts):**
```bash
#!/bin/bash
# plextraktsync-daily.sh

# Daily sync at 2 AM
docker exec plextraktsync python3 -m plextraktsync >> /mnt/user/appdata/plextraktsync/logs/sync.log 2>&1
```

**Docker Cron Configuration:**
```yaml
version: '3.8'
services:
  plextraktsync:
    image: ghcr.io/taxel/plextraktsync:latest
    container_name: plextraktsync
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - CRON_SCHEDULE=0 2 * * *  # Daily at 2 AM
    volumes:
      - ./plextraktsync-config:/app/config
```

### Sync Options

**Selective Sync Configuration:**
```yaml
sync:
  # What to sync from Plex to Trakt
  plex_to_trakt:
    collection: true          # Add to Trakt collection
    watched_status: true      # Mark as watched on Trakt
    ratings: false           # Don't sync Plex ratings to Trakt

  # What to sync from Trakt to Plex
  trakt_to_plex:
    liked_lists: true        # Download liked lists
    watchlist: false         # Don't sync watchlist
    watched_status: true     # Mark as watched in Plex
    ratings: true           # Sync Trakt ratings to Plex

# Filters
filters:
  # Only sync items with minimum rating
  minimum_rating: 6.0

  # Exclude specific libraries
  excluded_libraries:
    - "Kids Movies"
    - "Home Videos"

  # Only sync specific years
  year_range:
    start: 1990
    end: 2024
```

## Advanced Configuration

### Multiple Server Support

**Multi-Server Configuration:**
```yaml
servers:
  - name: "Main Server"
    url: "http://plex-main:32400"
    token: "token_for_main_server"

  - name: "Remote Server"
    url: "http://remote-plex:32400"
    token: "token_for_remote_server"

# Library mapping per server
library_mapping:
  "Main Server":
    - plex: "Movies"
      trakt: "movies"
    - plex: "TV Shows"
      trakt: "shows"

  "Remote Server":
    - plex: "Movies 4K"
      trakt: "movies"
```

### Custom List Management

**Trakt List Configuration:**
```yaml
lists:
  # Download specific Trakt lists
  download:
    - name: "Christmas Movies"
      trakt_id: "christmas-movies"
      plex_library: "Movies"

    - name: "Top 100 Movies"
      trakt_id: "top-100-movies-of-all-time"
      plex_library: "Movies"

  # Upload Plex playlists to Trakt
  upload:
    - plex_playlist: "Favorites"
      trakt_list: "My Favorites"
      privacy: "private"
```

### Rating Sync Behavior

**Rating Configuration:**
```yaml
ratings:
  # How to handle rating conflicts
  conflict_resolution: "trakt_wins"  # Options: trakt_wins, plex_wins, newer_wins

  # Rating scale mapping
  scale_mapping:
    trakt_to_plex:
      10: 5.0  # Trakt 10/10 = Plex 5/5 stars
      8: 4.0
      6: 3.0
      4: 2.0
      2: 1.0

  # Minimum rating threshold
  minimum_rating: 6.0
```

## Monitoring and Maintenance

### Logging Configuration

**Log Settings:**
```yaml
logging:
  level: "INFO"           # DEBUG, INFO, WARNING, ERROR
  file: "/app/config/logs/plextraktsync.log"
  max_size: "10MB"
  backup_count: 5
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
```

**Log Analysis Commands:**
```bash
# View recent logs
docker logs plextraktsync

# Follow logs in real-time
docker logs -f plextraktsync

# Search for errors
docker exec plextraktsync grep -i "error" /app/config/logs/plextraktsync.log

# Check sync statistics
docker exec plextraktsync grep -i "sync complete" /app/config/logs/plextraktsync.log
```

### Performance Monitoring

**Sync Statistics:**
```bash
# View sync summary
docker exec plextraktsync python3 -m plextraktsync --stats

# Check library counts
docker exec plextraktsync python3 -m plextraktsync --info

# Verify configuration
docker exec plextraktsync python3 -m plextraktsync --test-config
```

### Cache Management

**Cache Operations:**
```bash
# Clear all caches
docker exec plextraktsync python3 -m plextraktsync --clear-cache

# Clear specific cache types
docker exec plextraktsync python3 -m plextraktsync --clear-cache --cache-type "trakt"

# View cache statistics
docker exec plextraktsync python3 -m plextraktsync --cache-info
```

## Troubleshooting

### Common Issues

**Authentication Problems:**
```bash
# Re-authenticate with Trakt
docker exec -it plextraktsync python3 -m plextraktsync --reauth-trakt

# Re-authenticate with Plex
docker exec -it plextraktsync python3 -m plextraktsync --reauth-plex

# Verify tokens
docker exec plextraktsync python3 -m plextraktsync --verify-auth
```

**Sync Issues:**
```bash
# Debug specific item
docker exec plextraktsync python3 -m plextraktsync --debug-item "Movie Title (2023)"

# Force full resync
docker exec plextraktsync python3 -m plextraktsync --full-sync

# Check for duplicates
docker exec plextraktsync python3 -m plextraktsync --find-duplicates
```

**Network Connectivity:**
```bash
# Test Trakt API connection
docker exec plextraktsync curl -I https://api.trakt.tv/

# Test Plex server connection
docker exec plextraktsync curl -I http://plex:32400/

# Check DNS resolution
docker exec plextraktsync nslookup api.trakt.tv
```

### Error Resolution

**Common Error Fixes:**

1. **"Invalid Client ID":**
   - Verify Trakt application credentials
   - Check for typos in client ID/secret
   - Ensure redirect URI is set correctly

2. **"Plex Authentication Failed":**
   - Verify Plex credentials
   - Check 2FA codes if enabled
   - Confirm server accessibility

3. **"Rating Sync Failed":**
   - Check rating scale configuration
   - Verify API rate limits
   - Review conflict resolution settings

### Recovery Procedures

**Configuration Reset:**
```bash
# Backup current configuration
docker exec plextraktsync cp -r /app/config /app/config.backup

# Reset authentication
docker exec plextraktsync rm /app/config/.env
docker exec plextraktsync rm /app/config/.pytrakt.json

# Reconfigure from scratch
docker exec -it plextraktsync python3 -m plextraktsync
```

**Database Repair:**
```bash
# Clear sync database
docker exec plextraktsync rm /app/config/plextraktsync.db

# Rebuild from scratch
docker exec plextraktsync python3 -m plextraktsync --full-sync
```

## Backup and Maintenance

### Configuration Backup

**Backup Script:**
```bash
#!/bin/bash
# plextraktsync-backup.sh

BACKUP_DIR="/backup/plextraktsync"
CONFIG_DIR="/path/to/plextraktsync-config"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup configuration
tar -czf "$BACKUP_DIR/plextraktsync-config-$DATE.tar.gz" "$CONFIG_DIR"

# Keep only last 30 days
find "$BACKUP_DIR" -name "plextraktsync-config-*.tar.gz" -mtime +30 -delete
```

### Regular Maintenance

**Weekly Tasks:**
- Review sync logs for errors
- Check API rate limit usage
- Verify authentication tokens
- Monitor sync performance

**Monthly Tasks:**
- Update container image
- Backup configuration
- Review sync statistics
- Clean up old logs

**Update Procedure:**
```bash
# Pull latest image
docker pull ghcr.io/taxel/plextraktsync:latest

# Recreate container
docker compose down
docker compose up -d

# Verify functionality
docker exec plextraktsync python3 -m plextraktsync --test-config
```

## Integration Examples

### Home Assistant Integration

**Automation Configuration:**
```yaml
automation:
  - alias: "Daily Plex Trakt Sync"
    trigger:
      platform: time
      at: "02:00:00"
    action:
      service: shell_command.plextraktsync

shell_command:
  plextraktsync: "docker exec plextraktsync python3 -m plextraktsync"
```

### Webhook Integration

**Discord Notification:**
```python
# webhook_notify.py
import requests
import json

def send_discord_notification(sync_results):
    webhook_url = "https://discord.com/api/webhooks/YOUR_WEBHOOK"

    embed = {
        "title": "Plex Trakt Sync Complete",
        "description": f"Synced {sync_results['movies']} movies and {sync_results['shows']} shows",
        "color": 0x00ff00
    }

    data = {"embeds": [embed]}
    requests.post(webhook_url, json=data)
```

## Special Thanks

- **Taxel** for developing and maintaining PlexTraktSync
- **Trakt.tv Team** for providing the API and platform
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
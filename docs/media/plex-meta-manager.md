---
title: "Plex Meta Manager"
sidebar_position: 3
description: "Unraid Plex metadata and collection management automation"
tags: ["media", "ibracorp"]
source_url: https://docs.ibracorp.io/plex-meta-manager-1/
---

# Plex Meta Manager

Unraid Plex metadata and collection management automation

:::info Plex Meta Manager
**Video**
[IBRACORP Plex Meta Manager Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Plex Meta Manager GitHub](https://github.com/meisnate12/Plex-Meta-Manager)
- [Official Documentation](https://metamanager.wiki/)
- [Default Configuration Files](https://github.com/meisnate12/Plex-Meta-Manager-Configs)

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
| Developer | meisnate12 |
| Contributor | PMM Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Plex Meta Manager Features:**

- Automatically create and update Plex collections from various sources
- Add missing media to Radarr/Sonarr for automated downloading
- Set custom posters and title cards for movies and TV shows
- Apply media overlays (4K, HDR, Director's Cut, etc.)
- Edit media metadata via YAML configuration files
- Customize TV episode orders and seasons
- Support for multiple metadata sources (Trakt, TMDb, TVDb, IMDb, Letterboxd)
- Schedule automated runs for hands-off management
- Advanced filtering and sorting options

## Prerequisites

**System Requirements:**

- **CPU:** 2+ cores (1.0GHz or higher)
- **RAM:** 2GB minimum (4GB recommended for large libraries)
- **Storage:** 5GB available space for configurations and assets
- **Network:** Stable internet connection for metadata retrieval
- **Plex Media Server:** Active Plex server with organized libraries

**Required Services:**
- **Plex Media Server** (local or remote)
- **Radarr** (optional - for movie automation)
- **Sonarr** (optional - for TV show automation)

## Installation

### Unraid Docker Template

**Plex Meta Manager / Community Applications / Media Management**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Plex Meta Manager**
3. Configure the container settings:
   - **Config Path:** `/mnt/user/appdata/plex-meta-manager`
   - **Assets Path:** `/mnt/user/appdata/plex-meta-manager/assets`
   - **Network Type:** Bridge or custom Docker network
4. **Configure Environment Variables:**
   - **PUID:** 1000
   - **PGID:** 1000
   - **TZ:** America/New_York
   - **PMM_TIME:** 06:00 (daily run time)
5. Click Apply and wait for the container to pull down and start

### Docker Compose

```yaml
version: '3.8'
services:
  plex-meta-manager:
    image: meisnate12/plex-meta-manager:latest
    container_name: plex-meta-manager
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - PMM_TIME=06:00
      - PMM_RUN=true
      - PMM_TEST=false
      - PMM_NO_MISSING=false
    volumes:
      - ./pmm-config:/config
      - ./pmm-assets:/assets
    tty: true
    stdin_open: true
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Create configuration directories
3. Start the container:
   ```bash
   docker compose up -d
   ```
4. Configure your YAML files as described below

## Configuration

### Initial Setup

**Configuration File Structure:**
```
/config/
├── config.yml          # Main configuration file
├── Movies.yml           # Movie library configuration
├── TV Shows.yml         # TV library configuration
├── Anime.yml           # Anime library configuration (optional)
└── assets/             # Custom posters and backgrounds
    ├── movies/
    ├── tv/
    └── collections/
```

### Main Configuration (config.yml)

**Basic Configuration:**
```yaml
## Plex Meta Manager Configuration File

# Plex Configuration
plex:
  url: http://plex:32400
  token: YOUR_PLEX_TOKEN
  timeout: 60
  clean_bundles: false
  empty_trash: false
  optimize: false

# TMDb Configuration (Required)
tmdb:
  apikey: YOUR_TMDB_API_KEY
  language: en
  cache_expiration: 60
  region: US

# Optional Services
trakt:
  client_id: YOUR_TRAKT_CLIENT_ID
  client_secret: YOUR_TRAKT_CLIENT_SECRET
  authorization:
    access_token: YOUR_ACCESS_TOKEN
    token_type: Bearer
    expires_in: 7776000
    refresh_token: YOUR_REFRESH_TOKEN
    scope: public

# Radarr Configuration (Optional)
radarr:
  url: http://radarr:7878
  token: YOUR_RADARR_API_KEY
  add_missing: true
  add_existing: false
  root_folder_path: /data/media/movies
  monitor: true
  availability: announced
  quality_profile: HD-1080p
  tag: pmm

# Sonarr Configuration (Optional)
sonarr:
  url: http://sonarr:8989
  token: YOUR_SONARR_API_KEY
  add_missing: true
  add_existing: false
  root_folder_path: /data/media/tv
  monitor: all
  quality_profile: HD-1080p
  language_profile: English
  series_type: standard
  season_folder: true
  tag: pmm

# Library Configurations
libraries:
  Movies:
    collection_files:
      - pmm: basic
      - pmm: imdb
      - pmm: studio
      - pmm: genre
      - pmm: award
    operations:
      mass_genre_update: tmdb
      mass_content_rating_update: mdb_commonsense

  TV Shows:
    collection_files:
      - pmm: basic
      - pmm: imdb
      - pmm: network
      - pmm: genre
    operations:
      mass_genre_update: tmdb
      - mass_content_rating_update: mdb_commonsense

# Settings
settings:
  cache: true
  cache_expiration: 60
  asset_directory: /assets
  asset_folders: true
  asset_depth: 0
  create_asset_folders: false
  dimensional_asset_rename: false
  download_url_assets: false
  show_missing_season_assets: false
  show_missing_episode_assets: false
  show_asset_not_needed: true
  sync_mode: append
  minimum_items: 1
  default_collection_order:
  delete_below_minimum: true
  delete_not_scheduled: false
  run_again_delay: 2
  missing_only_released: false
  only_filter_missing: false
  show_unmanaged: true
  show_filtered: false
  show_options: false
  show_missing: true
  show_missing_assets: true
  save_report: false
  tvdb_language: eng
  ignore_ids:
  ignore_imdb_ids:
  playlist_sync_to_user: all
  playlist_exclude_user:
  verify_ssl: true
  custom_repo:
  check_nightly: false
```

### Movie Library Configuration

**Movies.yml Example:**
```yaml
collections:
  # IMDb Top 250
  IMDb Top 250:
    imdb_chart: top_movies
    collection_order: custom
    sync_mode: sync
    smart_label: critic_rating.desc

  # Marvel Cinematic Universe
  Marvel Cinematic Universe:
    trakt_list: https://trakt.tv/users/donxy/lists/marvel-cinematic-universe?sort=released,asc
    summary: A collection of Marvel Cinematic Universe movies
    collection_order: release
    poster: https://theposterdb.com/api/assets/52018

  # Studio Collections
  Studio Collections:
    template: {name: Studio, company: "<<value>>"}
    template_variables:
      collection_section: "03"
    smart_label: title.asc
    sync_mode: sync
    collection_order: alpha

  # Genre Collections
  Action:
    genre: Action
    summary: Action movies from my library
    collection_order: alpha

  Comedy:
    genre: Comedy
    summary: Comedy movies from my library
    collection_order: alpha

  # Award Collections
  Oscar Winners:
    imdb_award: oscar_winner
    summary: Oscar winning movies from my library
    collection_order: custom
    smart_label: critic_rating.desc

templates:
  Studio:
    smart_filter:
      all:
        studio: "<<company>>"
    sort_title: "!<<collection_section>>_<<collection_name>>"
    sync_mode: sync
    collection_order: release
```

### TV Shows Configuration

**TV Shows.yml Example:**
```yaml
collections:
  # Network Collections
  HBO:
    network: HBO
    summary: HBO original series
    collection_order: alpha

  Netflix:
    network: Netflix
    summary: Netflix original series
    collection_order: alpha

  # Genre Collections
  Animation:
    genre: Animation
    summary: Animated TV series
    collection_order: alpha

  Drama:
    genre: Drama
    summary: Drama TV series
    collection_order: alpha

  # Top Rated Shows
  Top Rated TV Shows:
    imdb_search:
      type: tv_series
      votes.gte: 10000
      rating.gte: 8.0
    summary: Top rated TV shows with high vote counts
    collection_order: custom
    smart_label: critic_rating.desc
    limit: 100

  # Trending Shows
  Trending This Week:
    trakt_trending: 50
    summary: Currently trending TV shows
    collection_order: custom
    smart_label: added.desc

metadata:
  "The Office (US)":
    title: "The Office"
    originally_available: "2005-03-24"
    content_rating: TV-14
    summary: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium."
    poster: https://theposterdb.com/api/assets/34829

  "Breaking Bad":
    episodes:
      S01E01:
        title: "Pilot"
        summary: "Walter White, a struggling high school chemistry teacher, is diagnosed with lung cancer."
```

## Advanced Features

### Custom Overlays

**Overlay Configuration:**
```yaml
overlays:
  4K-HDR:
    plex_search:
      all:
        resolution: 4K
        hdr: true
    overlay:
      name: 4K-HDR
      pmm: resolution/4KHDR
      horizontal_offset: 0
      horizontal_align: right
      vertical_offset: 0
      vertical_align: top

  Director's Cut:
    plex_search:
      all:
        edition: "Director's Cut"
    overlay:
      name: Directors-Cut
      file: /assets/overlays/directors-cut.png
      horizontal_offset: 0
      horizontal_align: left
      vertical_offset: 0
      vertical_align: bottom
```

### Metadata Operations

**Mass Updates:**
```yaml
libraries:
  Movies:
    operations:
      # Update all movie metadata
      mass_genre_update: tmdb
      mass_content_rating_update: mdb_commonsense
      mass_audience_rating_update: mdb_tomatoesaudience
      mass_critic_rating_update: mdb_tomatoes
      mass_user_rating_update: imdb

      # Poster operations
      mass_poster_update: tmdb
      mass_background_update: tmdb

      # Episode operations (for TV)
      mass_episode_critic_rating_update: imdb
      mass_episode_audience_rating_update: tmdb
```

### Asset Management

**Custom Assets Structure:**
```
/assets/
├── movies/
│   ├── Avatar (2009)/
│   │   ├── poster.jpg
│   │   └── background.jpg
├── tv/
│   ├── The Office (US)/
│   │   ├── poster.jpg
│   │   ├── background.jpg
│   │   └── seasons/
│   │       ├── Season01.jpg
│   │       └── Season02.jpg
└── collections/
    ├── Marvel Cinematic Universe/
    │   └── poster.jpg
    └── Studio Collections/
        └── poster.jpg
```

## Automation and Scheduling

### Automated Runs

**Docker Environment Variables:**
```yaml
environment:
  - PMM_TIME=06:00        # Daily run at 6 AM
  - PMM_RUN=true          # Enable automatic runs
  - PMM_TEST=false        # Disable test mode
  - PMM_NO_MISSING=false  # Show missing items
  - PMM_COLLECTIONS_ONLY=false  # Run full operations
```

**Cron Schedule (Alternative):**
```bash
# Add to Unraid User Scripts or cron
0 6 * * * docker exec plex-meta-manager python plex_meta_manager.py --run
```

### Manual Execution

**Run Commands:**
```bash
# Full run
docker exec -it plex-meta-manager python plex_meta_manager.py --run

# Test run (no changes made)
docker exec -it plex-meta-manager python plex_meta_manager.py --run --test

# Collections only
docker exec -it plex-meta-manager python plex_meta_manager.py --run --collections-only

# Specific library only
docker exec -it plex-meta-manager python plex_meta_manager.py --run --libraries "Movies"
```

## Service Integrations

### Trakt Integration

**Authentication Setup:**
1. Create Trakt application at https://trakt.tv/oauth/applications
2. Use redirect URI: `urn:ietf:wg:oauth:2.0:oob`
3. Run authentication command:
   ```bash
   docker exec -it plex-meta-manager python plex_meta_manager.py --run --test --trace
   ```

### TMDb Configuration

**API Key Setup:**
1. Create account at https://www.themoviedb.org/
2. Request API key in account settings
3. Add to config.yml:
   ```yaml
   tmdb:
     apikey: YOUR_TMDB_API_KEY
     language: en
   ```

### MyAnimeList Integration

**MAL Configuration:**
```yaml
mal:
  client_id: YOUR_MAL_CLIENT_ID
  client_secret: YOUR_MAL_CLIENT_SECRET
  authorization:
    access_token: YOUR_ACCESS_TOKEN
    token_type: Bearer
    expires_in: 2678400
    refresh_token: YOUR_REFRESH_TOKEN
```

## Troubleshooting

### Common Issues

**Configuration Validation:**
```bash
# Test configuration file
docker exec -it plex-meta-manager python plex_meta_manager.py --run --test --trace

# Check specific library
docker exec -it plex-meta-manager python plex_meta_manager.py --run --test --libraries "Movies" --trace
```

**API Connection Issues:**
- Verify all API keys are correct
- Check network connectivity
- Confirm service endpoints are accessible
- Review rate limiting issues

**Plex Token Problems:**
- Generate new Plex token via https://plex.tv/claim
- Verify Plex server accessibility
- Check user permissions for libraries

**Missing Assets:**
- Verify asset directory structure
- Check file permissions
- Confirm asset naming conventions
- Review download URL accessibility

### Log Analysis

**Log Locations:**
```bash
# Container logs
docker logs plex-meta-manager

# PMM logs (inside container)
/config/logs/meta.log

# Debug logs
docker exec -it plex-meta-manager python plex_meta_manager.py --run --trace
```

**Log Analysis Commands:**
```bash
# Follow logs in real-time
docker logs -f plex-meta-manager

# Search for errors
docker logs plex-meta-manager 2>&1 | grep -i "error"

# Check API responses
docker logs plex-meta-manager 2>&1 | grep -i "response"
```

## Performance Optimization

### Resource Management

**Container Limits:**
```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 4G
    reservations:
      cpus: '1.0'
      memory: 2G
```

**Cache Configuration:**
```yaml
settings:
  cache: true
  cache_expiration: 60
  run_again_delay: 2
  asset_directory: /assets
  download_url_assets: true
```

### Large Library Optimization

**Batch Processing:**
```yaml
libraries:
  Movies:
    schedule: weekly(sunday)
    collection_files:
      - pmm: basic
    settings:
      minimum_items: 5
      delete_below_minimum: true
      run_again_delay: 5
```

## Backup and Maintenance

### Configuration Backup

**Backup Script:**
```bash
#!/bin/bash
# pmm-backup.sh

BACKUP_DIR="/backup/plex-meta-manager"
CONFIG_DIR="/path/to/pmm-config"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup configuration
tar -czf "$BACKUP_DIR/pmm-config-$DATE.tar.gz" "$CONFIG_DIR"

# Keep only last 7 backups
find "$BACKUP_DIR" -name "pmm-config-*.tar.gz" -mtime +7 -delete
```

### Regular Maintenance

**Weekly Tasks:**
- Review collection accuracy
- Update configuration files
- Check for PMM updates
- Monitor API usage

**Monthly Tasks:**
- Clean up old logs
- Review asset quality
- Update metadata sources
- Backup configurations

## Special Thanks

- **meisnate12** for developing and maintaining Plex Meta Manager
- **PMM Community** for extensive configuration examples and support
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
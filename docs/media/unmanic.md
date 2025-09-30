---
title: "Unmanic"
sidebar_position: 6
description: "Unraid media library optimization and transcoding automation"
tags: ["media", "ibracorp"]
source_url: https://docs.ibracorp.io/unmanic/
---

# Unmanic

Unraid media library optimization and transcoding automation

:::info Unmanic Media Optimizer
**Video**
[IBRACORP Unmanic Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Unmanic Official GitHub](https://github.com/Unmanic/unmanic)
- [Unmanic Documentation](https://docs.unmanic.app/)
- [Josh5 Docker Repository](https://hub.docker.com/u/josh5)

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
| Developer | Josh5 |
| Contributor | Unmanic Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Unmanic Media Optimization Features:**

- Automated library scanning for non-conforming media files
- File watchdog for monitoring new and modified files
- Web-based interface for configuration and monitoring
- Multiple concurrent file processing tasks
- FFmpeg-based video and audio transcoding
- Hardware acceleration support (NVIDIA, Intel, AMD)
- Plugin system for extended functionality
- Scheduled library optimization tasks
- File movement and organization capabilities
- Custom command execution on media files
- Integration with Plex, Emby, Jellyfin, and Kodi
- Cross-installation synchronization

## Prerequisites

**System Requirements:**

- **CPU:** 4+ cores (hardware encoding capable recommended)
- **RAM:** 4GB minimum (8GB+ recommended for multiple concurrent tasks)
- **Storage:** 50GB+ available space for cache and temporary files
- **Network:** Stable internet connection
- **GPU:** Optional for hardware acceleration (NVIDIA, Intel QSV, AMD VCE)

**Hardware Acceleration Prerequisites:**
- **NVIDIA GPU:** Unraid NVIDIA Driver Plugin
- **Intel GPU:** Intel GPU TOP Plugin
- **AMD GPU:** GPU driver support via Unraid

## Installation

### Unraid Docker Template

**Unmanic / josh5's Repository / Media Management**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Unmanic** from **josh5's Repository**
3. Configure the container settings:
   - **WebUI Port:** 8888
   - **Config Path:** `/mnt/user/appdata/unmanic`
   - **Library Paths:** Map your media directories
   - **Cache Path:** `/mnt/user/unmanic-cache` (SSD recommended)
   - **Network Type:** Bridge or custom Docker network
4. **Configure Environment Variables:**
   - **PUID:** 1000
   - **PGID:** 1000
   - **TZ:** America/New_York
5. **Hardware Acceleration (if applicable):**
   - **NVIDIA:** Enable NVIDIA runtime and add GPU mapping
   - **Intel:** Map `/dev/dri` devices
6. Click Apply and wait for the container to pull down and start

### Docker Compose

```yaml
version: '3.8'
services:
  unmanic:
    image: josh5/unmanic:latest
    container_name: unmanic
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./unmanic-config:/config
      - ./unmanic-cache:/tmp/unmanic
      - /path/to/media/movies:/library/movies
      - /path/to/media/tv:/library/tv
      - /path/to/media/music:/library/music
    ports:
      - "8888:8888"
    devices:
      - /dev/dri:/dev/dri  # Intel hardware acceleration
    # For NVIDIA GPU:
    # runtime: nvidia
    # environment:
    #   - NVIDIA_VISIBLE_DEVICES=all
    #   - NVIDIA_DRIVER_CAPABILITIES=compute,video,utility
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Update media paths to match your library structure
3. Configure hardware acceleration as needed
4. Start the container:
   ```bash
   docker compose up -d
   ```
5. Access the WebUI at `http://YOUR_SERVER_IP:8888`

## Configuration

### Initial Setup

**First-Time Configuration:**

1. Navigate to `http://YOUR_SERVER_IP:8888`
2. Complete the setup wizard:
   - **Library Configuration:** Add library paths
   - **Worker Settings:** Configure concurrent processing threads
   - **Hardware Acceleration:** Select encoding method
   - **Plugin Installation:** Install required plugins

### Library Configuration

**Adding Libraries:**

1. Navigate to **Settings → Libraries**
2. Click **"Add Library"**
3. **Configure Library Settings:**
   - **Name:** Descriptive library name
   - **Path:** Full path to media directory
   - **Priority:** Processing priority (1-10)
   - **Scanner:** Enable automatic scanning
   - **Watchdog:** Monitor for file changes

**Library Settings:**
```yaml
libraries:
  movies:
    name: "Movies"
    path: "/library/movies"
    priority: 5
    scanner_enabled: true
    watchdog_enabled: true
    file_extensions: [".mkv", ".mp4", ".avi", ".mov"]

  tv_shows:
    name: "TV Shows"
    path: "/library/tv"
    priority: 3
    scanner_enabled: true
    watchdog_enabled: true
    file_extensions: [".mkv", ".mp4", ".avi"]
```

### Worker Configuration

**Processing Workers:**

1. Navigate to **Settings → Workers**
2. **Configure Worker Settings:**
   - **Number of Workers:** Based on CPU cores and resources
   - **Worker Timeout:** Maximum processing time per file
   - **Priority Handling:** How to handle priority tasks

**Worker Settings:**
```yaml
workers:
  total_workers: 4
  worker_timeout: 10800  # 3 hours
  priority_workers: 1
  enable_hardware_encoding: true
  max_file_size: 50000000000  # 50GB limit
```

## Plugin System

### Core Plugins

**Essential Plugins:**

1. **Video Encoder H.264/H.265:**
   - HEVC encoding for space efficiency
   - H.264 for compatibility
   - Hardware acceleration support

2. **Audio Processing:**
   - Audio codec conversion
   - Stream copying
   - Channel layout optimization

3. **Subtitle Management:**
   - Subtitle extraction
   - Format conversion
   - Language filtering

4. **File Organization:**
   - File movement and renaming
   - Directory structure management
   - Metadata preservation

### Hardware Acceleration Plugins

**NVIDIA NVENC Configuration:**
```yaml
nvenc_plugin:
  encoder: "hevc_nvenc"
  preset: "medium"
  crf: 23
  max_bitrate: "8M"
  profile: "main"
  level: "4.1"
  hardware_device: "/dev/nvidia0"
```

**Intel Quick Sync Configuration:**
```yaml
qsv_plugin:
  encoder: "hevc_qsv"
  preset: "medium"
  crf: 23
  max_bitrate: "8M"
  profile: "main"
  level: "4.1"
  hardware_device: "/dev/dri/renderD128"
```

### Custom Plugins

**Plugin Development:**
```python
# example_plugin.py
def process_file(file_path, settings):
    """
    Custom file processing function
    """
    # Your custom processing logic here
    result = {
        'success': True,
        'message': 'File processed successfully',
        'output_path': file_path
    }
    return result

# Plugin configuration
plugin_config = {
    'name': 'Custom Processor',
    'description': 'Custom file processing plugin',
    'version': '1.0.0',
    'settings': {
        'quality': 23,
        'preset': 'medium'
    }
}
```

## Advanced Configuration

### Encoding Profiles

**Quality Profiles:**
```yaml
encoding_profiles:
  high_quality:
    video_codec: "libx265"
    crf: 18
    preset: "slow"
    max_bitrate: "20M"
    audio_codec: "aac"
    audio_bitrate: "256k"

  balanced:
    video_codec: "libx265"
    crf: 23
    preset: "medium"
    max_bitrate: "8M"
    audio_codec: "aac"
    audio_bitrate: "128k"

  space_saver:
    video_codec: "libx265"
    crf: 28
    preset: "fast"
    max_bitrate: "4M"
    audio_codec: "aac"
    audio_bitrate: "96k"
```

### Conditional Processing

**File Filtering Rules:**
```yaml
filters:
  # Only process files larger than 5GB
  file_size:
    min_size: 5000000000

  # Skip files already in HEVC
  codec_filter:
    exclude_codecs: ["hevc", "h265"]

  # Process only specific resolutions
  resolution_filter:
    min_resolution: "1920x1080"
    max_resolution: "3840x2160"

  # File age filtering
  file_age:
    min_age_days: 1
    max_age_days: 365
```

### Scheduling

**Automated Scheduling:**
```yaml
schedules:
  daily_scan:
    enabled: true
    time: "02:00"
    action: "library_scan"
    libraries: ["movies", "tv_shows"]

  weekly_cleanup:
    enabled: true
    day: "sunday"
    time: "01:00"
    action: "cache_cleanup"

  monthly_optimization:
    enabled: true
    day: 1
    time: "00:00"
    action: "full_optimization"
```

## Integration

### Plex Integration

**Plex Library Updates:**
```yaml
plex_integration:
  server_url: "http://plex:32400"
  token: "your_plex_token"
  auto_refresh: true
  refresh_delay: 300  # seconds
  sections_to_refresh: ["Movies", "TV Shows"]
```

**Post-Processing Script:**
```bash
#!/bin/bash
# plex-refresh.sh

PLEX_URL="http://plex:32400"
PLEX_TOKEN="your_plex_token"
LIBRARY_SECTION="1"  # Movies section ID

# Refresh specific library section
curl -X POST "${PLEX_URL}/library/sections/${LIBRARY_SECTION}/refresh?X-Plex-Token=${PLEX_TOKEN}"
```

### Sonarr/Radarr Integration

**Webhook Configuration:**
```yaml
webhooks:
  sonarr:
    url: "http://sonarr:8989/api/v3/system/backup"
    events: ["file_processed"]
    headers:
      X-Api-Key: "your_sonarr_api_key"

  radarr:
    url: "http://radarr:7878/api/v3/system/backup"
    events: ["file_processed"]
    headers:
      X-Api-Key: "your_radarr_api_key"
```

## Monitoring and Maintenance

### Dashboard Monitoring

**Performance Metrics:**

1. **Active Tasks:** Currently processing files
2. **Queue Status:** Pending and completed tasks
3. **Worker Status:** Active and idle workers
4. **Library Statistics:** Files processed and space saved
5. **Error Tracking:** Failed tasks and error rates

### Logging Configuration

**Log Settings:**
```yaml
logging:
  level: "INFO"
  file: "/config/logs/unmanic.log"
  max_size: "100MB"
  backup_count: 10
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
```

**Log Analysis:**
```bash
# View container logs
docker logs unmanic

# Follow logs in real-time
docker logs -f unmanic

# Search for encoding errors
docker logs unmanic 2>&1 | grep -i "error"

# Monitor processing status
docker logs unmanic 2>&1 | grep -i "processing"
```

### Performance Optimization

**Resource Management:**
```yaml
performance:
  cpu_cores: 8
  memory_limit: "8G"
  cache_size: "20G"
  temp_directory: "/tmp/unmanic"
  parallel_tasks: 4
  io_priority: "normal"
```

**Cache Management:**
```bash
# Monitor cache usage
du -sh /path/to/unmanic-cache/

# Clean cache directory
find /path/to/unmanic-cache/ -type f -mtime +7 -delete

# Monitor disk I/O
iostat -x 1
```

## Troubleshooting

### Common Issues

**Encoding Failures:**
```bash
# Check FFmpeg availability
docker exec unmanic ffmpeg -version

# Test hardware acceleration
docker exec unmanic ffmpeg -hwaccels

# Verify GPU access (NVIDIA)
docker exec unmanic nvidia-smi

# Check Intel GPU access
docker exec unmanic ls -la /dev/dri/
```

**Permission Issues:**
```bash
# Fix file permissions
docker exec unmanic chown -R abc:abc /config
docker exec unmanic chown -R abc:abc /library

# Check file access
docker exec unmanic ls -la /library/movies/
```

**Memory Issues:**
```bash
# Monitor memory usage
docker stats unmanic

# Adjust worker count
# Reduce concurrent workers if running out of memory

# Check swap usage
free -h
```

### Error Resolution

**Common Error Solutions:**

1. **"FFmpeg not found":**
   - Ensure container includes FFmpeg
   - Check PATH environment variable
   - Verify container architecture compatibility

2. **"Hardware acceleration failed":**
   - Verify GPU drivers are installed
   - Check device mapping in Docker
   - Test hardware encoding manually

3. **"File access denied":**
   - Check PUID/PGID settings
   - Verify file permissions
   - Ensure proper volume mounting

4. **"Processing timeout":**
   - Increase worker timeout
   - Reduce file size limits
   - Check system resources

### Performance Tuning

**Optimization Tips:**

1. **Storage Configuration:**
   ```yaml
   storage_optimization:
     cache_on_ssd: true
     temp_on_tmpfs: false  # Only if sufficient RAM
     separate_input_output: true
   ```

2. **Encoding Settings:**
   ```yaml
   encoding_optimization:
     preset: "medium"  # Balance speed vs quality
     threads: 0        # Auto-detect optimal thread count
     lookahead: 25     # Improve quality at cost of speed
   ```

3. **Resource Allocation:**
   ```yaml
   resources:
     cpu_limit: "6.0"
     memory_limit: "8G"
     nice_level: 10    # Lower priority for background processing
   ```

## Backup and Recovery

### Configuration Backup

**Backup Script:**
```bash
#!/bin/bash
# unmanic-backup.sh

BACKUP_DIR="/backup/unmanic"
CONFIG_DIR="/path/to/unmanic-config"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup configuration
tar -czf "$BACKUP_DIR/unmanic-config-$DATE.tar.gz" \
  --exclude="$CONFIG_DIR/logs" \
  --exclude="$CONFIG_DIR/cache" \
  "$CONFIG_DIR"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "unmanic-config-*.tar.gz" -mtime +30 -delete
```

### Database Backup

**Database Management:**
```bash
# Backup Unmanic database
cp /path/to/unmanic-config/unmanic.db /backup/unmanic-db-$(date +%Y%m%d).db

# Restore database
docker stop unmanic
cp /backup/unmanic-db-20241218.db /path/to/unmanic-config/unmanic.db
docker start unmanic
```

## Advanced Use Cases

### Batch Processing

**Mass Conversion Script:**
```python
#!/usr/bin/env python3
# batch_convert.py

import os
import requests
import json

UNMANIC_URL = "http://localhost:8888"
LIBRARY_PATH = "/library/movies"

def queue_all_files():
    """Queue all files in library for processing"""

    api_endpoint = f"{UNMANIC_URL}/api/v1/queue/add_library"

    payload = {
        "library_path": LIBRARY_PATH,
        "force_reprocess": False
    }

    response = requests.post(api_endpoint, json=payload)

    if response.status_code == 200:
        print("Successfully queued library for processing")
    else:
        print(f"Failed to queue library: {response.text}")

if __name__ == "__main__":
    queue_all_files()
```

### Custom Workflows

**Multi-Stage Processing:**
```yaml
workflows:
  movie_pipeline:
    stages:
      - plugin: "extract_subtitles"
        settings:
          languages: ["eng", "spa"]

      - plugin: "video_encoder"
        settings:
          codec: "hevc"
          crf: 23

      - plugin: "audio_processor"
        settings:
          codec: "aac"
          bitrate: "128k"

      - plugin: "file_mover"
        settings:
          destination: "/optimized/movies"

      - plugin: "plex_refresh"
        settings:
          section_id: 1
```

## Special Thanks

- **Josh5** for developing and maintaining Unmanic
- **Unmanic Community** for extensive plugin development and support
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
# Unmanic Media Processing

Unmanic is a library optimization tool designed to manage and process media files automatically. It provides transcoding, file management, and media library optimization capabilities with a focus on simplicity and extensive customization.

## Overview

Unmanic helps maintain consistent media formats across your library by:
- **Automatic Transcoding** - Convert files to uniform formats
- **Scheduled Processing** - Run optimization tasks on schedule
- **Real-time Monitoring** - Watch folders for new/modified files
- **Hardware Acceleration** - Support for GPU-accelerated encoding

## Key Features

### Processing Capabilities
- **Video Transcoding** - HEVC/H.264 encoding with quality control
- **Audio Processing** - Format conversion and stream management
- **Subtitle Management** - Extract, convert, and embed subtitles
- **Metadata Handling** - Preserve and optimize file metadata
- **Custom Commands** - Execute scripts and external tools

### Automation Features
- **Library Scanning** - Scheduled automatic library analysis
- **Folder Watchdog** - Real-time monitoring for new files
- **Concurrent Processing** - Multiple simultaneous file conversions
- **Conditional Logic** - Process files based on configurable rules

## Installation (Unraid)

### Basic Setup

1. Open **Community Applications** store
2. Search for "Unmanic" from **josh5's Repository**
3. Install the application

### Container Configuration

Configure the Docker template with these settings:

**Network Configuration:**
- Select custom Docker network if needed
- Map host port (default: 8888)

**Volume Mappings:**
- **Library Directories** - Map your media folders
- **Cache Directory** - Set encoding cache location
- **Config Directory** - Persistent configuration storage

**Example Volume Configuration:**
```
/mnt/user/media/movies:/library/movies
/mnt/user/media/tv:/library/tv
/mnt/user/cache/unmanic:/tmp/unmanic
/mnt/user/appdata/unmanic:/config
```

## Hardware Acceleration Setup

### NVIDIA GPU Support

**Prerequisites:**
1. Install **Nvidia Driver Plugin** from Community Applications
2. Add runtime parameter to Docker template

**Configuration:**
```bash
# Add to Extra Parameters
--runtime=nvidia
```

**Environment Variables:**
```
NVIDIA_VISIBLE_DEVICES=all
NVIDIA_DRIVER_CAPABILITIES=compute,video,utility
```

### Intel GPU Support

**Prerequisites:**
1. Install **Intel GPU TOP Plugin** from Community Applications
2. Add device mapping to Docker template

**Configuration:**
```bash
# Add to Extra Parameters
--device=/dev/dri
```

## Configuration

### Web Interface Access

1. Navigate to `http://serverip:8888`
2. Complete initial setup wizard
3. Configure library paths and processing settings

### Processing Presets

**Video Encoding:**
- Set target codec (H.264/HEVC)
- Configure quality settings (CRF/bitrate)
- Enable hardware acceleration if available

**Audio Processing:**
- Define target audio codec
- Set channel layout preferences
- Configure language priorities

**Subtitle Handling:**
- Extract embedded subtitles
- Convert subtitle formats
- Set language preferences

### Scheduling Configuration

**Library Scans:**
- Set automatic scan intervals
- Configure scan depth and file filters
- Enable/disable recursive directory scanning

**Processing Windows:**
- Define active processing hours
- Set concurrent worker limits
- Configure priority queues

## Workflow Examples

### Basic Media Optimization

```yaml
Workflow: Standard Media Processing
Input: Mixed codec library
Process:
  1. Scan for non-H.264 video files
  2. Transcode to H.264 with CRF 23
  3. Preserve original audio streams
  4. Extract and convert subtitles
  5. Update Plex library after processing
```

### 4K Content Management

```yaml
Workflow: 4K Content Optimization
Input: Large 4K media files
Process:
  1. Identify files over specified bitrate
  2. Transcode with HEVC for space savings
  3. Maintain HDR metadata
  4. Generate lower resolution copies
  5. Organize by quality tier
```

### Automated File Organization

```yaml
Workflow: File Management
Input: Downloaded media files
Process:
  1. Move files after encoding completion
  2. Execute FileBot for proper naming
  3. Clean up temporary files
  4. Trigger library refresh
  5. Send completion notifications
```

## Integration Features

### Plex Integration
- **Library Scanning** - Automatic refresh after processing
- **Metadata Preservation** - Maintain Plex metadata during conversion
- **Quality Optimization** - Optimize for Plex streaming requirements

### External Tool Support
- **FileBot Integration** - Automated file renaming and organization
- **Custom Scripts** - Execute bash/python scripts during processing
- **Notification Systems** - Webhook and email notifications

## Monitoring and Management

### Web Dashboard
- **Processing Queue** - View current and pending jobs
- **Worker Status** - Monitor active transcoding workers
- **Statistics** - Processing history and performance metrics
- **Logs** - Detailed processing and error logs

### Performance Optimization
- **Worker Configuration** - Adjust concurrent processing limits
- **Priority Queues** - Prioritize important content
- **Resource Monitoring** - Track CPU/GPU utilization
- **Cache Management** - Optimize temporary file handling

## Troubleshooting

### Common Issues

**Transcoding Failures:**
- Check input file integrity
- Verify codec compatibility
- Review processing logs for errors
- Ensure sufficient disk space

**Hardware Acceleration Problems:**
- Verify GPU driver installation
- Check Docker runtime configuration
- Validate device permissions
- Review NVIDIA/Intel plugin status

**Performance Issues:**
- Adjust worker thread count
- Optimize cache directory location
- Monitor system resource usage
- Consider processing schedule adjustments

### Log Analysis

**Key Log Locations:**
- Container logs: `docker logs unmanic`
- Application logs: Available in web interface
- Processing logs: Per-file conversion details

## Best Practices

### Library Management
- **Backup Strategy** - Always backup original files before processing
- **Test Workflows** - Validate settings with small test batches
- **Quality Control** - Regularly review transcoded output quality
- **Storage Planning** - Account for temporary file space requirements

### Performance Optimization
- **Schedule Processing** - Run intensive tasks during off-peak hours
- **GPU Utilization** - Leverage hardware acceleration when available
- **Concurrent Limits** - Balance throughput with system stability
- **Cache Management** - Use fast storage for temporary files

### Maintenance
- **Regular Updates** - Keep Unmanic updated for bug fixes and features
- **Log Rotation** - Manage log file sizes and retention
- **Database Cleanup** - Periodically clean processing history
- **Configuration Backup** - Export and backup your configurations

## Related Documentation

- [Media Server Integration](../media/plex-setup.md)

For advanced configuration options and plugin development, refer to the official Unmanic documentation and community resources.
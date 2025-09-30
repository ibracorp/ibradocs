---
title: "Docker Folders"
sidebar_position: 3
description: "Organize and manage Docker containers in Unraid with folder groupings for better dashboard organization."
tags: [misc-tools, unraid, docker, organization, folders, ibracorp]
---

# Docker Folders

Organize and manage Docker containers in Unraid with folder groupings for better dashboard organization.

:::info Docker Organization Plugin
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Docker Folder Plugin](https://forums.unraid.net/topic/87793-plugin-docker-folder/)
- [Unraid Community Apps](https://unraid.net/community/apps)
- [Folder View Plugin](https://forums.unraid.net/topic/135709-plugin-folder-view/)

**Related Videos**
- Unraid Docker Management
- Container Organization
- Dashboard Customization
:::

:::warning Disclaimer
Thank you for choosing to collaborate with IBRACORP 🙏

Please read our disclaimer https://docs.ibracorp.io/disclaimer
:::

## Credits

| Role | Contributor |
|------|------------|
| Writer / Producer | Sycotix |
| Video Recording and Voice | Sycotix |
| Contributor | North |
| Testing / Proofreading | Hawks, DiscDuck |

## Feature List

**Container Organization Tools**

- **Visual Folder Organization** - Group containers into logical folders
- **Custom Icons** - Add visual indicators for easy identification
- **Animated Icons** - Support for GIF animations
- **Dashboard Cleanup** - Reduce clutter on Docker tab
- **Container Preview** - Quick container information display
- **VM Support** - Also works with virtual machines
- **Custom Naming** - Flexible folder naming conventions
- **Status Indicators** - Visual status for grouped containers
- **Easy Management** - Simple add, remove, and reorganize operations

## Installation by Unraid Version

### Unraid 6.12.3 or Lower

**Install Docker Folder**

1. **Navigate to Community Applications**: Unraid webUI → Apps tab
2. **Search**: Type "Docker Folder"
3. **Install**: Select "Docker Folder" from **GuildDart's Repository**
4. **Wait for Installation**: Plugin will install automatically

### Unraid 6.12.3 or Higher

**Install Folder View**

1. **Navigate to Community Applications**: Unraid webUI → Apps tab
2. **Search**: Type "Folder View"
3. **Install**: Select "Folder View" from **Scolcipitato Repository**
4. **Wait for Installation**: Plugin will install automatically

### Unraid 7.0.0 or Higher

**Install Folder View2**

1. **Navigate to Community Applications**: Unraid webUI → Apps tab
2. **Search**: Type "Folder View2"
3. **Install**: Select "Folder View2" from **VladoPortos and Scolcipitato Repository**
4. **Wait for Installation**: Plugin will install automatically

## Configuration

### Creating Docker Folders

**Add Container Folder**

1. **Navigate to Docker Tab**: Go to Docker tab in Unraid webUI
2. **Add Folder**: Click "Add Folder" button
3. **Select Advanced View**: Enable advanced configuration options
4. **Configure Folder**:
   ```
   Folder Name: Media Management
   Description: Plex, Sonarr, Radarr, and related containers
   Icon: Choose from library or upload custom
   ```

### Folder Configuration Options

**Basic Settings**

```
Folder Name: Descriptive name for your container group
Icon: Visual representation (optional)
Expanded by Default: Show containers when page loads
Hide folder when empty: Automatically hide if no containers
Show container count: Display number of containers in folder
```

**Advanced Settings**

```
Container/VM Preview: Show container details
Status Icon Autostart: Visual indicators for container status
Sort Order: Customize folder positioning
Custom CSS: Advanced styling options
```

### Adding Containers to Folders

**Organize Existing Containers**

1. **Edit Container**: Click container icon → Edit
2. **Extra Parameters**: Add to extra parameters field:
   ```
   --label folder="Media Management"
   ```
3. **Apply Changes**: Save and restart container

**Alternative Method**

1. **Folder Configuration**: In folder settings
2. **Select Containers**: Choose containers to include
3. **Apply**: Containers will be grouped automatically

## Animated Icons

### Icon Sources

**Hernandito's Animated Icons**

1. **Browse Collection**: Visit Hernandito's icon repository
2. **Choose Color Scheme**: Select from available themes
3. **Select Icon**: Find appropriate icon for your folder
4. **Copy URL**: Right-click and copy image address

### Icon Configuration

**Add Animated Icon**

1. **Edit Folder**: Click folder settings
2. **Icon Field**: Paste copied image URL
3. **Test Icon**: Verify icon displays correctly
4. **Submit Changes**: Save folder configuration

**Popular Icon Categories**

```
Media: Plex, Jellyfin, Emby icons
Download: Sonarr, Radarr, qBittorrent icons
Network: VPN, proxy, monitoring icons
Utility: Backup, file management, development icons
Gaming: Game servers, Discord bots, voice chat icons
```

## Folder Examples

### Media Management Folder

**Container Organization**

```
Folder: Media Management
Description: Complete media server stack
Containers:
- Plex Media Server
- Jellyfin
- Sonarr
- Radarr
- Lidarr
- Prowlarr
- qBittorrent
- Overseerr
```

### Network Services Folder

**Network Tools Organization**

```
Folder: Network Services
Description: VPN, proxy, and networking tools
Containers:
- Nginx Proxy Manager
- Cloudflare Tunnel
- WireGuard VPN
- Pi-hole
- Unbound DNS
- AdGuard Home
```

### Development Folder

**Development Environment**

```
Folder: Development
Description: Development and testing tools
Containers:
- Code Server
- GitLab
- Jenkins
- PostgreSQL
- Redis
- MongoDB
- MinIO
```

## VM Support

### Virtual Machine Folders

**Organize VMs**

1. **Navigate to VMs Tab**: Go to VMs tab in Unraid webUI
2. **Add Folder**: Click "Add Folder" button
3. **Configure VM Folder**:
   ```
   Folder Name: Windows VMs
   Description: Windows virtual machines
   Icon: Windows logo or custom icon
   ```

**VM Folder Examples**

```
Folder: Gaming VMs
- Windows 10 Gaming
- Windows 11 Gaming
- Gaming VM Template

Folder: Server VMs
- Ubuntu Server
- CentOS Server
- Proxmox VM
```

## Troubleshooting

### Common Issues

**Plugin Not Working**

1. **Check Version**: Verify correct plugin for your Unraid version
2. **Restart WebUI**: Tools → System Information → Reload
3. **Clear Browser Cache**: Hard refresh the page

**Containers Not Showing in Folders**

1. **Verify Labels**: Check container extra parameters for correct folder label
2. **Restart Containers**: Stop and start affected containers
3. **Plugin Restart**: Disable and re-enable plugin

**Icons Not Loading**

1. **Check URL**: Verify icon URL is accessible
2. **HTTPS Required**: Ensure icon URLs use HTTPS
3. **File Format**: Confirm supported formats (PNG, JPG, GIF)

### Performance Issues

**Large Number of Containers**

1. **Collapse Folders**: Keep folders collapsed by default
2. **Optimize Icons**: Use smaller icon file sizes
3. **Group Efficiently**: Don't create too many small folders

## Best Practices

### Organization Strategy

**Logical Grouping**

```
Group by Function:
- Media: All media-related containers
- Network: Networking and security tools
- Development: Development and testing tools
- Games: Game servers and gaming tools
- Utilities: System tools and utilities

Group by Application Stack:
- Plex Stack: Plex + *arr applications
- Monitoring Stack: Grafana + Prometheus + exporters
- Backup Stack: Duplicati + rsync + cloud sync
```

### Naming Conventions

**Consistent Naming**

```
Descriptive Names:
✅ "Media Management"
✅ "Network Services"
✅ "Development Tools"

Avoid Generic Names:
❌ "Stuff"
❌ "Random"
❌ "Misc"
```

### Icon Guidelines

**Icon Selection**

```
Consistency:
- Use same style across folders
- Maintain color scheme
- Consider dark/light mode compatibility

Size:
- Optimal: 64x64 pixels
- Maximum: 128x128 pixels
- Format: PNG, JPG, or GIF
```

## Advanced Configuration

### Custom CSS Styling

**Advanced Appearance**

```css
/* Example custom styling */
.folder-container {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.folder-header {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

### Automation Scripts

**Automated Container Labeling**

```bash
#!/bin/bash
# Auto-label containers based on image names

# Media containers
docker update --label folder="Media Management" $(docker ps -q --filter "ancestor=linuxserver/plex")
docker update --label folder="Media Management" $(docker ps -q --filter "ancestor=linuxserver/sonarr")

# Network containers
docker update --label folder="Network Services" $(docker ps -q --filter "ancestor=jc21/nginx-proxy-manager")
```

## Special Thanks

- **GuildDart** for the original Docker Folder plugin
- **Scolcipitato** for Folder View plugin development
- **VladoPortos** for Folder View2 improvements
- **Hernandito** for animated icon collections
- To our fantastic Discord community and our Admins **DiscDuck** and **Hawks** for their input and testing

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
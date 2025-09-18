---
title: "Homarr"
sidebar_position: 5
description: "Customizable homepage and dashboard for your self-hosted services with real-time status monitoring and service integration."
tags: [misc-tools, dashboard, homepage, monitoring, widgets, ibracorp]
---

# Homarr

Customizable homepage and dashboard for your self-hosted services with real-time status monitoring and service integration.

:::info Service Dashboard
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Homarr GitHub](https://github.com/ajnart/homarr)
- [Homarr Demo](https://homarr.dev/)
- [Documentation](https://homarr.dev/docs/)

**Related Videos**
- Dashboard Setup
- Service Monitoring
- Homepage Customization
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

**Comprehensive Dashboard Solution**

- **Service Integration** - Connect with your self-hosted services
- **Real-time Status** - Live status indicators for all services
- **Auto Icon Detection** - Automatically finds service icons
- **Customizable Widgets** - Display various information types
- **Web Search** - Search directly from homepage
- **Docker Integration** - Automatic service discovery
- **Fast & Lightweight** - Optimized performance
- **Mobile Responsive** - Works on all devices
- **Dark/Light Themes** - Multiple appearance options
- **Free & Open Source** - No licensing costs
- **Easy Deployment** - Simple Docker setup

## Installation

### Unraid Installation

**Community Applications Method**

1. **Navigate to Apps**: Go to Community Applications store
2. **Search**: Type "Homarr"
3. **Install**: Select Homarr from available templates
4. **Configure**:
   ```
   Container Name: homarr
   Network Type: Bridge or custom network
   Host Port: 7575 (default)
   ```
5. **Apply**: Wait for container to start
6. **Access WebUI**: Click WebUI in Docker tab

### Docker Compose

**Complete Setup**

```yaml
version: '3.8'

services:
  homarr:
    container_name: homarr
    image: ghcr.io/ajnart/homarr:latest
    restart: unless-stopped
    volumes:
      - ./homarr/configs:/app/data/configs
      - ./homarr/icons:/app/public/icons
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - '7575:7575'
    environment:
      - TZ=America/New_York
    networks:
      - homarr

networks:
  homarr:
    driver: bridge
```

```bash
# Deploy Homarr
mkdir -p homarr/{configs,icons}
docker compose up -d
```

## Configuration

### Initial Setup

**First Launch Configuration**

1. **Access Homarr**: Navigate to `http://server-ip:7575`
2. **Settings**: Click settings gear icon
3. **Enable Features**:
   ```
   Docker Integration: Enable
   Search Providers: Configure
   Widgets: Enable desired widgets
   ```
4. **Save Configuration**: Apply settings

### Adding Services

**Manual Service Addition**

1. **Add Tile**: Click "+" button
2. **Service Configuration**:
   ```
   Name: Plex Media Server
   URL: http://192.168.1.100:32400
   Icon: Auto-detected or custom
   Category: Media
   ```
3. **Status Monitoring**: Enable health checks
4. **Save**: Add service to dashboard

**Docker Auto-Discovery**

1. **Enable Docker**: In settings, enable Docker integration
2. **Auto-Detection**: Services automatically discovered
3. **Configure Services**: Adjust auto-detected services
4. **Status Codes**: Configure expected response codes

### Widgets

**Available Widgets**

```
System Widgets:
- CPU Usage
- Memory Usage
- Storage Information
- Network Statistics

Service Widgets:
- Uptime Status
- Response Time
- Service Health
- Custom Metrics

Information Widgets:
- Weather
- Clock
- Calendar
- RSS Feeds
```

### Themes and Customization

**Appearance Settings**

```
Themes:
- Light Mode
- Dark Mode
- Auto (system preference)

Customization:
- Background images
- Color schemes
- Layout options
- Icon styles
```

## Advanced Features

### Search Integration

**Web Search Configuration**

```
Search Providers:
- Google
- DuckDuckGo
- Bing
- Custom providers

Search Features:
- Quick search bar
- Keyboard shortcuts
- Search suggestions
- Custom search engines
```

### Docker Integration

**Container Monitoring**

```yaml
# Example container labels for Homarr
labels:
  - "homarr.enable=true"
  - "homarr.name=Plex"
  - "homarr.icon=plex.png"
  - "homarr.url=http://192.168.1.100:32400"
  - "homarr.category=Media"
```

### Custom Icons

**Icon Management**

1. **Custom Icons**: Upload to `/icons` directory
2. **Supported Formats**: PNG, SVG, ICO
3. **Icon Sources**:
   ```
   Community Icons:
   - Heimdall icons
   - Dashboard icons
   - Custom uploads
   ```

## Service Examples

### Media Services

**Plex Configuration**

```
Name: Plex Media Server
URL: http://192.168.1.100:32400
Status Check: /web/index.html
Expected Status: 200
Icon: plex
Category: Media
```

### Download Clients

**qBittorrent Setup**

```
Name: qBittorrent
URL: http://192.168.1.100:8080
Status Check: /
Expected Status: 200
Icon: qbittorrent
Category: Downloads
```

### Network Services

**Pi-hole Dashboard**

```
Name: Pi-hole
URL: http://192.168.1.100:80/admin
Status Check: /admin
Expected Status: 200
Icon: pihole
Category: Network
```

## Best Practices

### Organization

**Service Categories**

```
Recommended Categories:
- Media (Plex, Jellyfin, Emby)
- Downloads (Sonarr, Radarr, qBittorrent)
- Network (Pi-hole, Unifi, Router)
- Monitoring (Grafana, Uptime Kuma)
- Development (GitLab, Jenkins, Code Server)
- Utilities (File Browser, Nextcloud)
```

### Performance

**Optimization Tips**

```
Performance:
- Limit number of widgets
- Optimize icon file sizes
- Use efficient status check intervals
- Enable caching for icons
```

### Security

**Access Control**

```
Security Measures:
- Use reverse proxy with authentication
- Implement SSL/TLS
- Restrict network access
- Regular updates
```

## Troubleshooting

### Common Issues

**Services Not Loading**

1. **Check URLs**: Verify service URLs are correct
2. **Network Access**: Ensure Homarr can reach services
3. **Status Codes**: Verify expected response codes

**Docker Integration Issues**

```bash
# Check Docker socket permissions
ls -la /var/run/docker.sock

# Ensure container has access
docker logs homarr
```

**Icon Problems**

1. **Icon Path**: Verify icons are in correct directory
2. **File Format**: Ensure supported format (PNG, SVG)
3. **Permissions**: Check file permissions

## Developer Message

:::info From the Developer
*"Thank you so much for taking the time to consider my app! This is my first ever 'real' project and I'm constantly working to improve it. Your feedback and support mean everything to me."*

**- ajnart, Homarr Developer**
:::

## Special Thanks

- **ajnart** for creating Homarr and continuous development
- **Homarr Community** for feedback and contributions
- To our fantastic Discord community and our Admins **DiscDuck** and **Hawks** for their input and testing

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
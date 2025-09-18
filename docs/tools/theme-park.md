# theme.park Styling

theme.park is a comprehensive theming solution that provides beautiful, consistent styling for your self-hosted applications. It offers multiple color schemes and themes that can transform the appearance of popular applications like Sonarr, Radarr, Plex, Jellyfin, and many others.

## Overview

theme.park simplifies application theming by providing:
- **Pre-built Themes** - Ready-to-use styling for popular applications
- **Multiple Color Schemes** - Various color palettes and gradients
- **Dark/Light Modes** - Support for both dark and light themes
- **4K Logos** - High-resolution branding for media management apps
- **Easy Switching** - Simple theme changes without configuration complexity

## Supported Applications

theme.park supports theming for numerous applications including:

**Media Management:**
- Sonarr, Radarr, Lidarr, Readarr
- Bazarr, Prowlarr, Overseerr
- Plex, Jellyfin, Emby

**Download Clients:**
- qBittorrent, Deluge, Transmission
- NZBGet, SABnzbd

**System Management:**
- Portainer, Organizr, Heimdall
- Grafana, Prometheus

## Installation Methods

### Method 1: Docker Mods (Recommended)

For applications using linuxserver.io Docker images, use Docker Mods for seamless integration:

```yaml
version: '3'
services:
  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    environment:
      - DOCKER_MODS=ghcr.io/gilbn/theme.park:sonarr
      - TP_THEME=hotline
    # ... other configuration
```

**Available Themes:**
- `hotline` - Retro neon styling
- `dark` - Classic dark theme
- `aquamarine` - Blue-green gradient
- `space-gray` - Modern gray theme
- `dracula` - Purple-based dark theme

### Method 2: Nginx Proxy Manager

Configure theme.park through your reverse proxy:

1. **Add Custom Location:**
```nginx
location /theme.park/ {
    proxy_pass https://theme-park.dev/;
    proxy_set_header Accept-Encoding "";
    sub_filter '</head>' '<link rel="stylesheet" type="text/css" href="/theme.park/sonarr/hotline.css"></head>';
    sub_filter_once on;
}
```

2. **Application-Specific Configuration:**
```nginx
# For Sonarr with hotline theme
sub_filter '</head>' '<link rel="stylesheet" type="text/css" href="https://theme-park.dev/css/base/sonarr/hotline.css"></head>';
```

### Method 3: Stylus Browser Extension

For local browser-based theming:

1. Install the **Stylus** browser extension
2. Navigate to the theme.park website
3. Select your application and desired theme
4. Click "Install with Stylus" to apply the theme

### Method 4: Self-Hosted CSS

Host theme.park CSS files locally:

1. **Download CSS Files:**
```bash
# Create theme directory
mkdir -p /opt/themes/theme.park

# Download themes
wget -r -np -nH --cut-dirs=1 -R "index.html*" \
  https://theme-park.dev/css/ -P /opt/themes/theme.park/
```

2. **Serve via Web Server:**
```nginx
server {
    listen 80;
    server_name themes.local;
    root /opt/themes/theme.park;

    location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
    }
}
```

## Configuration Examples

### Docker Compose with Multiple Apps

```yaml
version: '3'
services:
  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    environment:
      - DOCKER_MODS=ghcr.io/gilbn/theme.park:sonarr
      - TP_THEME=hotline
      - TP_ADDON=4k-logo

  radarr:
    image: lscr.io/linuxserver/radarr:latest
    environment:
      - DOCKER_MODS=ghcr.io/gilbn/theme.park:radarr
      - TP_THEME=aquamarine
      - TP_ADDON=4k-logo

  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    environment:
      - DOCKER_MODS=ghcr.io/gilbn/theme.park:prowlarr
      - TP_THEME=space-gray
```

### Advanced Docker Configuration

```yaml
# Custom theme with additional options
environment:
  - DOCKER_MODS=ghcr.io/gilbn/theme.park:sonarr
  - TP_THEME=hotline
  - TP_ADDON=4k-logo,glass-card
  - TP_SCHEME=dark
  - TP_HOTIO=true  # For hotio.dev images
```

## Theme Customization

### Available Themes

**Popular Color Schemes:**
- **hotline** - Retro neon pink/purple
- **dark** - Classic dark theme
- **aquamarine** - Teal/blue gradient
- **space-gray** - Modern gray tones
- **dracula** - Purple-based vampiric theme
- **nord** - Cool blue/gray palette
- **plex** - Official Plex-inspired styling

### Add-ons and Enhancements

**4K Logo Add-on:**
```yaml
environment:
  - TP_ADDON=4k-logo
```

**Glass Card Effect:**
```yaml
environment:
  - TP_ADDON=glass-card
```

**Multiple Add-ons:**
```yaml
environment:
  - TP_ADDON=4k-logo,glass-card,no-animation
```

### Custom CSS Injection

For advanced customization, inject additional CSS:

```css
/* Custom overrides */
.page-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hide specific elements */
.advertisement-banner {
    display: none !important;
}
```

## Reverse Proxy Integration

### Nginx Proxy Manager Setup

1. **Create Custom Location:**
   - Path: `/css/theme-park/`
   - Proxy Host: `https://theme-park.dev`

2. **Add Theme Injection:**
```nginx
# In Advanced tab
location / {
    proxy_set_header Accept-Encoding "";
    sub_filter '</head>' '<link rel="stylesheet" type="text/css" href="/css/theme-park/sonarr/hotline.css"></head>';
    sub_filter_once on;
}
```

### Traefik Configuration

```yaml
# docker-compose.yml
services:
  sonarr:
    labels:
      - "traefik.http.middlewares.theme-inject.plugin.rewritebody.rewrites[0].regex=</head>"
      - "traefik.http.middlewares.theme-inject.plugin.rewritebody.rewrites[0].replacement=<link rel='stylesheet' type='text/css' href='https://theme-park.dev/css/base/sonarr/hotline.css'></head>"
```

## Performance Considerations

### Caching Strategies

**Browser Caching:**
```nginx
location ~* \.(css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**CDN Integration:**
- Use theme-park.dev CDN for optimal performance
- Consider local caching for high-traffic scenarios
- Implement fallback CSS for offline scenarios

### Loading Optimization

**Preload Critical CSS:**
```html
<link rel="preload" href="/theme.park/sonarr/hotline.css" as="style">
```

**Async Loading:**
```html
<link rel="stylesheet" href="/theme.park/base.css" media="print" onload="this.media='all'">
```

## Troubleshooting

### Common Issues

**Theme Not Loading:**
- Verify Docker Mod is properly configured
- Check network connectivity to theme-park.dev
- Ensure application supports CSS injection
- Review browser developer tools for errors

**Styling Conflicts:**
- Clear browser cache and cookies
- Disable other browser extensions temporarily
- Check for conflicting CSS rules
- Verify theme compatibility with application version

**Performance Issues:**
- Enable CSS minification and compression
- Implement proper caching headers
- Consider local CSS hosting for better performance
- Monitor network requests in browser tools

### Debug Mode

Enable debug mode for troubleshooting:

```yaml
environment:
  - TP_DEBUG=true
  - TP_THEME=hotline
```

This provides additional logging and CSS source mapping.

## Best Practices

### Theme Management
- **Consistent Styling** - Use the same theme family across related applications
- **Test Updates** - Verify themes work after application updates
- **Backup Configurations** - Document your theme choices and configurations
- **Monitor Performance** - Ensure themes don't impact application responsiveness

### Security Considerations
- **Content Security Policy** - Ensure CSP allows external CSS if using CDN
- **HTTPS Usage** - Always use HTTPS for external theme resources
- **Local Hosting** - Consider self-hosting for sensitive environments
- **Regular Updates** - Keep themes updated for security and compatibility

### Maintenance
- **Version Compatibility** - Check theme compatibility with application updates
- **Cache Management** - Regularly clear theme caches when updating
- **Documentation** - Maintain documentation of custom configurations
- **Community Support** - Engage with theme.park community for support and updates

## Related Documentation

- [Reverse Proxy Setup](../reverse-proxies/nginx-proxy-manager.md)
- [Docker Compose Guide](../tools/docker-compose.md)
- [Application Styling](../tools/homarr.md)
- [Web Server Configuration](../networking/cloudflare-tunnel.md)

For the latest themes, custom CSS examples, and community contributions, visit the official theme.park website and GitHub repository.
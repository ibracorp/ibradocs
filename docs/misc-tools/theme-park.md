---
title: "theme.park"
sidebar_position: 7
description: "CSS theming platform that provides beautiful, consistent themes for popular self-hosted applications and services."
tags: [misc-tools, theming, css, customization, styling, ibracorp]
---

# theme.park

CSS theming platform that provides beautiful, consistent themes for popular self-hosted applications and services.

:::info Application Theming
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [theme.park Website](https://theme-park.dev/)
- [Documentation](https://docs.theme-park.dev/)
- [GitHub Repository](https://github.com/GilbN/theme.park)

**Related Videos**
- Application Customization
- CSS Styling
- Docker Modifications
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

**Comprehensive Theming Solution**

- **Multiple Applications** - Support for 50+ popular applications
- **Various Themes** - Multiple color schemes and styles
- **Easy Implementation** - Simple installation methods
- **Docker Integration** - Docker mods for LinuxServer images
- **Browser Extensions** - Stylus support for any application
- **Self-Hosted Option** - Host themes on your own infrastructure
- **Custom Themes** - Create and modify existing themes
- **Consistent Design** - Unified look across all applications
- **Regular Updates** - Continuous theme improvements
- **Community Driven** - Open source with community contributions

## Supported Applications

### Media Applications
```
Plex, Jellyfin, Emby
Sonarr, Radarr, Lidarr
Prowlarr, Jackett
Overseerr, Ombi
Tautulli
```

### Download Clients
```
qBittorrent, Deluge
SABnzbd, NZBGet
Transmission
```

### System Management
```
Unraid, TrueNAS
Portainer, Yacht
Grafana, Prometheus
Organizr, Heimdall
```

## Installation Methods

### Docker Mods (LinuxServer Images)

**Sonarr Example**

```yaml
version: "3.8"
services:
  sonarr:
    image: ghcr.io/linuxserver/sonarr:latest
    container_name: sonarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - DOCKER_MODS=ghcr.io/gilbn/theme.park:sonarr
      - TP_THEME=hotline
    volumes:
      - ./sonarr/config:/config
      - /media:/media
    ports:
      - "8989:8989"
    restart: unless-stopped
```

**Available Themes**
```
hotline (default)
dark
aquamarine
organizr
space-gray
dracula
nord
```

### Stylus Browser Extension

**Installation**

1. **Install Extension**:
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/styl-us/)

2. **Install Themes**:
   - Visit [theme-park.dev](https://theme-park.dev)
   - Click "Install" for desired application theme
   - Stylus will open with theme ready to install

### Self-Hosted Deployment

**Docker Compose Setup**

```yaml
version: '3.8'
services:
  theme-park:
    image: ghcr.io/gilbn/theme.park:latest
    container_name: theme-park
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ./theme-park/config:/config
    ports:
      - "8080:80"
    restart: unless-stopped
```

**Custom Domain Setup**

```yaml
# With reverse proxy
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.theme-park.rule=Host(`themes.yourdomain.com`)"
  - "traefik.http.routers.theme-park.entrypoints=https"
  - "traefik.http.services.theme-park.loadbalancer.server.port=80"
```

## Theme Implementation

### Docker Mod Method

**Basic Implementation**

```yaml
environment:
  - DOCKER_MODS=ghcr.io/gilbn/theme.park:[app-name]
  - TP_THEME=[theme-name]
```

**Advanced Options**

```yaml
environment:
  - DOCKER_MODS=ghcr.io/gilbn/theme.park:sonarr
  - TP_THEME=hotline
  - TP_DOMAIN=theme-park.dev
  - TP_COMMUNITY_THEME=true
  - TP_ADDON=4k-logo
```

### Manual CSS Injection

**Nginx Proxy Manager**

```nginx
# Add to advanced configuration
location / {
    proxy_pass http://sonarr:8989;
    proxy_set_header Host $host;
    
    # Inject theme CSS
    sub_filter '</head>' '<link rel="stylesheet" type="text/css" href="https://theme-park.dev/css/base/sonarr/hotline.css"></head>';
    sub_filter_once on;
}
```

### Reverse Proxy Integration

**Traefik Labels**

```yaml
labels:
  - "traefik.http.middlewares.theme-sonarr.addprefix.prefix=/css/base/sonarr/hotline.css"
  - "traefik.http.routers.sonarr.middlewares=theme-sonarr"
```

## Custom Themes

### Create Custom Theme

**CSS Structure**

```css
/* Custom theme example */
:root {
    --main-bg-color: #1f1f1f;
    --modal-bg-color: #2a2a2a;
    --accent-color: #ff6b35;
    --accent-color-hover: #ff8c42;
    --text-color: #ffffff;
    --text-muted: #b3b3b3;
}

/* Override specific elements */
.navbar {
    background-color: var(--modal-bg-color) !important;
}

.btn-primary {
    background-color: var(--accent-color) !important;
    border-color: var(--accent-color) !important;
}
```

### Host Custom Themes

**Self-Hosted Structure**

```
/config/
├── css/
│   ├── base/
│   │   ├── sonarr/
│   │   │   ├── custom.css
│   │   │   └── hotline.css
│   │   └── plex/
│   │       ├── custom.css
│   │       └── dark.css
│   └── addons/
│       ├── 4k-logo/
│       └── custom-addon/
```

## Application-Specific Setups

### Plex

**Docker Mod Implementation**

```yaml
services:
  plex:
    image: ghcr.io/linuxserver/plex:latest
    container_name: plex
    environment:
      - DOCKER_MODS=ghcr.io/gilbn/theme.park:plex
      - TP_THEME=dark
    # ... other configuration
```

### Unraid

**Community Apps Plugin**

1. **Install Plugin**: Search for "theme.park" in Community Apps
2. **Select Theme**: Choose from available Unraid themes
3. **Apply**: Theme applies automatically to Unraid webUI

### Grafana

**Manual CSS Injection**

```yaml
services:
  grafana:
    image: grafana/grafana:latest
    environment:
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./custom.css:/usr/share/grafana/public/css/custom.css
```

## Advanced Features

### Addons

**4K Logo Addon**

```yaml
environment:
  - DOCKER_MODS=ghcr.io/gilbn/theme.park:sonarr
  - TP_THEME=hotline
  - TP_ADDON=4k-logo
```

**Custom Addons**

```css
/* 4K Logo addon example */
.movie-poster::after {
    content: "4K";
    position: absolute;
    top: 5px;
    right: 5px;
    background: gold;
    color: black;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: bold;
}
```

### Theme Switching

**Dynamic Theme Changes**

```javascript
// JavaScript for theme switching
function switchTheme(themeName) {
    const themeLink = document.getElementById('theme-css');
    themeLink.href = `https://theme-park.dev/css/base/sonarr/${themeName}.css`;
}
```

## Troubleshooting

### Common Issues

**Theme Not Loading**

1. **Check URL**: Verify theme CSS URL is accessible
2. **Clear Cache**: Clear browser cache and reload
3. **Container Restart**: Restart application container

**Partial Theme Application**

```
Solutions:
- Check for conflicting CSS
- Verify theme compatibility with app version
- Update to latest theme version
- Check browser developer tools for errors
```

**Docker Mod Issues**

```bash
# Check mod installation
docker logs [container-name]

# Verify theme files
docker exec [container-name] ls -la /app/www/public/
```

### Performance Issues

**Optimization**

```
Performance Tips:
- Use local theme hosting for faster loading
- Minimize custom CSS additions
- Optimize image assets
- Use CDN for theme delivery
```

## Best Practices

### Implementation Strategy

**Gradual Rollout**

```
Recommended Approach:
1. Test with single application
2. Verify theme compatibility
3. Apply to similar applications
4. Document customizations
5. Monitor for issues
```

### Maintenance

**Keep Themes Updated**

```bash
# Update Docker mods
docker-compose pull
docker-compose up -d

# Update self-hosted themes
git pull origin main
docker-compose restart theme-park
```

### Customization Guidelines

**CSS Best Practices**

```css
/* Use CSS variables for consistency */
:root {
    --brand-primary: #your-color;
    --brand-secondary: #your-color;
}

/* Scope customizations to avoid conflicts */
.your-app-container {
    /* Custom styles here */
}

/* Use !important sparingly */
.important-override {
    color: var(--brand-primary) !important;
}
```

## Special Thanks

- **GilbN** for creating and maintaining theme.park
- **LinuxServer.io Team** for Docker mod support
- **Theme Contributors** for creating beautiful themes
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

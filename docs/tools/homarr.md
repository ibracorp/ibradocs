# Homarr Dashboard

Homarr is a customizable browser's home page designed to interact with your homeserver's Docker containers (e.g. Sonarr/Radarr). It provides a centralized dashboard for managing and monitoring your self-hosted applications.

## Key Features

- **Docker Integration** - Real-time service status indicators
- **Automatic Discovery** - Automatic icon discovery for services
- **Customizable Widgets** - Flexible dashboard layout
- **Web Search** - Built-in search functionality
- **Service Management** - Easy access to all your applications

## Installation Methods

### Unraid Installation

1. Navigate to **Community Applications** store
2. Search for "Homarr" and install
3. Configure Docker network if using custom networks
4. Map host port (default: 7575)
5. Start the container
6. Access WebUI at `http://serverip:7575`

### Docker Compose Installation

1. Create the application directory:
```bash
mkdir -p /opt/appdata/homarr && cd /opt/appdata/homarr
```

2. Create the Docker Compose file:
```bash
nano docker-compose.yml
```

3. Add the following configuration:
```yaml
version: '3'
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
```

4. Start the container:
```bash
docker-compose up -d
```

## Configuration

1. Open the web interface at `http://serverip:7575`
2. Click the **Settings** icon to access configuration
3. Enable desired modules (such as Docker integration)
4. Customize your dashboard layout
5. Add services manually or via Docker auto-discovery

## Docker Integration

When Docker integration is enabled, Homarr can:
- Automatically detect running containers
- Display real-time status indicators
- Provide quick access to container management
- Show resource usage information

## Customization

Homarr offers extensive customization options:
- **Custom Icons** - Add your own service icons
- **Widget Layout** - Drag and drop interface for organizing widgets
- **Color Themes** - Multiple color schemes available
- **Service Categories** - Group related services together

## Troubleshooting

**Container won't start:**
- Check Docker socket permissions
- Verify port availability (7575)
- Review container logs for errors

**Services not appearing:**
- Ensure Docker socket is properly mounted
- Check container labels for auto-discovery
- Verify network connectivity between containers

## Related Documentation

- [Docker Compose Guide](../tools/docker-compose.md)
- [Reverse Proxy Setup](../reverse-proxies/nginx-proxy-manager.md)
- [Authentication](../security/authelia.md)
# Docker Compose Guide

Docker Compose is a tool for defining and running multi-container Docker applications. It uses YAML files to configure application services and allows you to manage complex containerized applications with simple commands.

## Overview

Docker Compose simplifies container orchestration by:
- **Single Configuration** - Define all services in one YAML file
- **Service Dependencies** - Manage startup order and relationships
- **Environment Management** - Easy configuration for different environments
- **Network Isolation** - Automatic network creation for service communication

## Basic Structure

A typical `docker-compose.yml` file contains:

```yaml
version: '3.8'
services:
  app:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    environment:
      - ENV=production
    restart: unless-stopped
```

## Common Patterns

### Web Application Stack

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
      - REDIS_URL=redis://redis:6379

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Media Server Stack

```yaml
version: '3.8'
services:
  plex:
    image: lscr.io/linuxserver/plex:latest
    container_name: plex
    network_mode: host
    environment:
      - PUID=1000
      - PGID=1000
      - VERSION=docker
    volumes:
      - /path/to/plex/config:/config
      - /path/to/media:/media
    restart: unless-stopped

  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    container_name: sonarr
    environment:
      - PUID=1000
      - PGID=1000
    volumes:
      - /path/to/sonarr/config:/config
      - /path/to/media/tv:/tv
      - /path/to/downloads:/downloads
    ports:
      - 8989:8989
    restart: unless-stopped
```

## Essential Commands

### Service Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart app

# View service logs
docker-compose logs -f app

# Scale a service
docker-compose up -d --scale app=3
```

### Development Workflow

```bash
# Build and start services
docker-compose up --build

# Start with fresh containers
docker-compose up --force-recreate

# Run one-off commands
docker-compose run app npm install

# Execute commands in running containers
docker-compose exec app bash
```

## Configuration Best Practices

### Environment Variables

Create a `.env` file for sensitive data:

```bash
# .env
POSTGRES_PASSWORD=your_secure_password
SECRET_KEY=your_secret_key
API_TOKEN=your_api_token
```

Reference in compose file:
```yaml
environment:
  - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  - SECRET_KEY=${SECRET_KEY}
```

### Volume Management

```yaml
# Named volumes for data persistence
volumes:
  app_data:
    driver: local
  db_data:
    driver: local

# Bind mounts for development
volumes:
  - ./app:/usr/src/app
  - ./config:/etc/app/config
```

### Network Configuration

```yaml
# Custom networks
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

services:
  web:
    networks:
      - frontend
      - backend
  db:
    networks:
      - backend
```

## Production Considerations

### Security

```yaml
# Non-root user
user: "1000:1000"

# Read-only filesystem
read_only: true
tmpfs:
  - /tmp

# Resource limits
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

### Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logging

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using a port
netstat -tulpn | grep :8080

# Use different port mapping
ports:
  - "8081:8080"
```

**Permission issues:**
```bash
# Set correct PUID/PGID
environment:
  - PUID=1000
  - PGID=1000
```

**Service won't start:**
```bash
# Check logs
docker-compose logs service_name

# Validate compose file
docker-compose config
```

### Debug Commands

```bash
# Show running containers
docker-compose ps

# Show service configuration
docker-compose config

# Follow logs for all services
docker-compose logs -f

# Inspect networks
docker network ls
docker network inspect network_name
```

## Advanced Features

### Override Files

Create `docker-compose.override.yml` for local development:

```yaml
version: '3.8'
services:
  app:
    volumes:
      - ./src:/usr/src/app/src
    environment:
      - DEBUG=true
```

### Multiple Environments

```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### Secrets Management

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt

services:
  db:
    secrets:
      - db_password
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
```

## Related Documentation

- [Container Security](../security/authelia.md)
- [Network Configuration](../networking/vpn-setup.md)
- [Application Deployment](../tools/homarr.md)

Docker Compose is essential for managing complex containerized applications efficiently. Start with simple configurations and gradually adopt advanced features as your infrastructure grows.
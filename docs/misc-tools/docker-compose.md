---
title: "Docker Compose"
sidebar_position: 2
description: "Comprehensive guide to Docker Compose for defining and running multi-container Docker applications with YAML configuration files."
tags: [misc-tools, docker, containerization, orchestration, ibracorp]
---

# Docker Compose

Comprehensive guide to Docker Compose for defining and running multi-container Docker applications with YAML configuration files.

:::info Docker Compose Orchestration
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
- [Compose File Reference](https://docs.docker.com/compose/compose-file/)

**Related Videos**
- Docker Fundamentals
- Container Networking
- Multi-Service Applications
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

**Multi-Container Application Management**

- **YAML Configuration** - Define complex applications in simple files
- **Service Orchestration** - Manage multiple containers as a unit
- **Network Management** - Automatic network creation and isolation
- **Volume Management** - Persistent data storage across containers
- **Environment Variables** - Configuration through .env files
- **Dependency Management** - Service startup order control
- **Scaling Support** - Scale services up or down
- **Override Capabilities** - Environment-specific configurations
- **Development Workflows** - Perfect for development environments
- **Production Deployment** - Suitable for production with proper configuration

## Installation

### Ubuntu Installation

**Install Docker Compose v2**

```bash
# Update package database
sudo apt update

# Install Docker Compose plugin (recommended)
sudo apt install docker-compose-plugin

# Verify installation
docker compose version
```

**Alternative: Install Docker Compose v1**

```bash
# Install legacy version
sudo apt install docker-compose

# Verify installation
docker-compose --version
```

### Manual Installation

**Download Latest Release**

```bash
# Download Docker Compose binary
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

## Basic Configuration

### Simple Docker Compose File

**docker-compose.yml Structure**

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    container_name: my-nginx
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
    restart: unless-stopped
    networks:
      - webnet

  database:
    image: mysql:8.0
    container_name: my-mysql
    environment:
      MYSQL_ROOT_PASSWORD: secretpassword
      MYSQL_DATABASE: myapp
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppass
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
    networks:
      - webnet

volumes:
  mysql_data:

networks:
  webnet:
    driver: bridge
```

### Environment Variables

**Using .env Files**

```bash
# Create .env file
nano .env
```

```bash
# Database Configuration
MYSQL_ROOT_PASSWORD=your-secure-password
MYSQL_DATABASE=myapp
MYSQL_USER=appuser
MYSQL_PASSWORD=another-secure-password

# Application Configuration
APP_ENV=production
APP_DEBUG=false
```

**Reference in Compose File**

```yaml
version: '3.8'

services:
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
```

## Advanced Configuration

### Multi-Service Application

**Complete Application Stack**

```yaml
version: '3.8'

services:
  # Frontend Web Server
  nginx:
    image: nginx:alpine
    container_name: app-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - web_content:/var/www/html
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - frontend
      - backend

  # Application Server
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: app-server
    environment:
      - DATABASE_URL=mysql://appuser:${MYSQL_PASSWORD}@database:3306/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - web_content:/var/www/html
      - ./app/config:/app/config:ro
    depends_on:
      - database
      - redis
    restart: unless-stopped
    networks:
      - backend

  # Database
  database:
    image: mysql:8.0
    container_name: app-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/init:/docker-entrypoint-initdb.d:ro
    restart: unless-stopped
    networks:
      - backend

  # Redis Cache
  redis:
    image: redis:alpine
    container_name: app-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - backend

volumes:
  mysql_data:
  redis_data:
  web_content:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

### Override Files

**Development Override**

```yaml
# docker-compose.override.yml
version: '3.8'

services:
  app:
    environment:
      - APP_ENV=development
      - APP_DEBUG=true
    volumes:
      - ./app/src:/app/src
    ports:
      - "3000:3000"

  database:
    ports:
      - "3306:3306"
```

**Production Override**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  nginx:
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

## Essential Commands

### Basic Operations

**Lifecycle Management**

```bash
# Start all services
docker compose up -d

# View running services
docker compose ps

# View logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# Stop all services
docker compose stop

# Remove stopped containers
docker compose down

# Remove containers and volumes
docker compose down -v
```

### Development Workflow

**Development Commands**

```bash
# Build images
docker compose build

# Pull latest images
docker compose pull

# Restart specific service
docker compose restart nginx

# Scale a service
docker compose up -d --scale app=3

# Execute commands in container
docker compose exec app bash

# View container processes
docker compose top
```

### Troubleshooting Commands

**Debugging and Maintenance**

```bash
# Validate compose file
docker compose config

# View detailed service information
docker compose ps --services

# Check resource usage
docker stats $(docker compose ps -q)

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune
```

## Networking

### Custom Networks

**Network Configuration**

```yaml
version: '3.8'

services:
  web:
    image: nginx
    networks:
      - frontend

  app:
    image: myapp
    networks:
      - frontend
      - backend

  database:
    image: mysql
    networks:
      - backend

networks:
  frontend:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

  backend:
    driver: bridge
    internal: true
```

### External Networks

**Using Existing Networks**

```yaml
version: '3.8'

services:
  app:
    image: myapp
    networks:
      - existing-network

networks:
  existing-network:
    external: true
```

## Volume Management

### Named Volumes

**Persistent Data Storage**

```yaml
version: '3.8'

services:
  database:
    image: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups

volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/docker/postgres
```

### Bind Mounts

**Host Directory Mapping**

```yaml
version: '3.8'

services:
  web:
    image: nginx
    volumes:
      - type: bind
        source: ./html
        target: /usr/share/nginx/html
        read_only: true
      - type: bind
        source: ./nginx.conf
        target: /etc/nginx/nginx.conf
        read_only: true
```

## Best Practices

### Security

**Security Hardening**

```yaml
version: '3.8'

services:
  app:
    image: myapp
    user: "1000:1000"
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### Performance

**Resource Management**

```yaml
version: '3.8'

services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Special Thanks

- **Docker Team** for creating Docker Compose
- **Community Contributors** for extensive documentation and examples
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
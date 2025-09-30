---
title: "Traefik"
sidebar_position: 2
description: "Modern reverse proxy and load balancer with automatic service discovery"
tags: ["reverse-proxies", "ibracorp"]
source_url: https://docs.ibracorp.io/traefik/
---

# Traefik

Modern reverse proxy and load balancer with automatic service discovery

:::info Traefik Reverse Proxy
**Video**
[IBRACORP Traefik Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Traefik Official Documentation](https://doc.traefik.io/traefik/)
- [Traefik GitHub Repository](https://github.com/traefik/traefik)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

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
| Developer | Traefik Team |
| Contributor | Traefik Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Traefik Reverse Proxy Features:**

- Automatic service discovery and configuration
- Dynamic routing and load balancing
- Automated SSL certificate management (Let's Encrypt, ZeroSSL)
- Docker label-based configuration
- Multiple provider support (Docker, Kubernetes, Consul, etc.)
- Real-time configuration updates without restarts
- Built-in monitoring dashboard
- Middleware support for authentication, rate limiting, etc.
- HTTP/HTTPS redirection and HSTS
- WebSocket and gRPC support

## Prerequisites

**System Requirements:**

- **Domain:** Registered domain with configurable DNS
- **Docker:** Docker and Docker Compose environment
- **Network:** Port 80 and 443 access from internet
- **Storage:** 1GB available space for configuration and certificates
- **DNS Provider:** For automatic DNS challenge (optional)

**Network Prerequisites:**
- **Port Forwarding:** 80/tcp and 443/tcp forwarded to Traefik container
- **Domain DNS:** A/AAAA records pointing to your public IP
- **API Access:** DNS provider API credentials (for DNS challenge)

## Installation

### Docker Compose Setup

**Complete Traefik Configuration:**
```yaml
version: '3.8'
services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    command:
      # API and dashboard
      - --api.dashboard=true
      - --api.insecure=false

      # Entry points
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443

      # Docker provider
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --providers.docker.network=traefik-network

      # Certificate resolvers
      - --certificatesresolvers.letsencrypt.acme.tlschallenge=true
      - --certificatesresolvers.letsencrypt.acme.email=your-email@example.com
      - --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json

      # Cloudflare DNS challenge (optional)
      - --certificatesresolvers.cloudflare.acme.dnschallenge=true
      - --certificatesresolvers.cloudflare.acme.dnschallenge.provider=cloudflare
      - --certificatesresolvers.cloudflare.acme.email=your-email@example.com
      - --certificatesresolvers.cloudflare.acme.storage=/letsencrypt/acme-cloudflare.json

      # Logging
      - --log.level=INFO
      - --accesslog=true
    environment:
      # Cloudflare API credentials (if using DNS challenge)
      - CF_API_EMAIL=your-email@example.com
      - CF_API_KEY=your-cloudflare-api-key
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik-data/letsencrypt:/letsencrypt
      - ./traefik-data/config:/config
    labels:
      # Dashboard configuration
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.yourdomain.com`)"
      - "traefik.http.routers.dashboard.entrypoints=websecure"
      - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=auth"

      # Basic auth middleware
      - "traefik.http.middlewares.auth.basicauth.users=admin:$$2y$$10$$hashed-password"

      # HTTP to HTTPS redirect
      - "traefik.http.routers.http-catchall.rule=hostregexp(`{host:.+}`)"
      - "traefik.http.routers.http-catchall.entrypoints=web"
      - "traefik.http.routers.http-catchall.middlewares=redirect-to-https"
      - "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https"
    networks:
      - traefik-network

networks:
  traefik-network:
    external: true
```

**Installation Steps:**

1. Create the external network:
   ```bash
   docker network create traefik-network
   ```

2. Create data directories:
   ```bash
   mkdir -p traefik-data/letsencrypt traefik-data/config
   chmod 600 traefik-data/letsencrypt
   ```

3. Generate password hash for dashboard:
   ```bash
   # Generate bcrypt hash for password
   htpasswd -nb admin your-password
   ```

4. Save configuration as `docker-compose.yml` and start:
   ```bash
   docker compose up -d
   ```

5. Access dashboard at `https://traefik.yourdomain.com`

### Unraid Docker Template

**Traefik Configuration for Unraid:**

```yaml
unraid_template:
  repository: "traefik:v3.0"
  container_name: "traefik"
  network_type: "Custom: traefik-network"

  ports:
    - "80:80"
    - "443:443"

  volumes:
    - "/var/run/docker.sock:/var/run/docker.sock:ro"
    - "/mnt/user/appdata/traefik/letsencrypt:/letsencrypt"
    - "/mnt/user/appdata/traefik/config:/config"

  environment_variables:
    - name: "CF_API_EMAIL"
      value: "your-email@example.com"
    - name: "CF_API_KEY"
      value: "your-cloudflare-api-key"

  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.dashboard.rule=Host(`traefik.yourdomain.com`)"
    - "traefik.http.routers.dashboard.entrypoints=websecure"
    - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
```

## Service Configuration

### Basic Service Setup

**Simple Web Application:**
```yaml
services:
  webapp:
    image: nginx
    container_name: webapp
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.webapp.rule=Host(`app.yourdomain.com`)"
      - "traefik.http.routers.webapp.entrypoints=websecure"
      - "traefik.http.routers.webapp.tls.certresolver=letsencrypt"
      - "traefik.http.services.webapp.loadbalancer.server.port=80"
    networks:
      - traefik-network
```

**Path-Based Routing:**
```yaml
services:
  api:
    image: my-api
    container_name: api
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`yourdomain.com`) && PathPrefix(`/api`)"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"
      - "traefik.http.services.api.loadbalancer.server.port=3000"
    networks:
      - traefik-network
```

### Multiple Services Example

**Complete Stack Configuration:**
```yaml
version: '3.8'
services:
  # Portainer
  portainer:
    image: portainer/portainer-ce
    container_name: portainer
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer-data:/data
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portainer.rule=Host(`portainer.yourdomain.com`)"
      - "traefik.http.routers.portainer.entrypoints=websecure"
      - "traefik.http.routers.portainer.tls.certresolver=letsencrypt"
      - "traefik.http.services.portainer.loadbalancer.server.port=9000"
    networks:
      - traefik-network

  # Nextcloud
  nextcloud:
    image: nextcloud:latest
    container_name: nextcloud
    restart: unless-stopped
    volumes:
      - nextcloud-data:/var/www/html
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nextcloud.rule=Host(`cloud.yourdomain.com`)"
      - "traefik.http.routers.nextcloud.entrypoints=websecure"
      - "traefik.http.routers.nextcloud.tls.certresolver=letsencrypt"
      - "traefik.http.services.nextcloud.loadbalancer.server.port=80"
      - "traefik.http.routers.nextcloud.middlewares=nextcloud-headers"
      - "traefik.http.middlewares.nextcloud-headers.headers.customrequestheaders.X-Forwarded-Proto=https"
    networks:
      - traefik-network

  # Grafana
  grafana:
    image: grafana/grafana
    container_name: grafana
    restart: unless-stopped
    volumes:
      - grafana-data:/var/lib/grafana
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.grafana.rule=Host(`grafana.yourdomain.com`)"
      - "traefik.http.routers.grafana.entrypoints=websecure"
      - "traefik.http.routers.grafana.tls.certresolver=letsencrypt"
      - "traefik.http.services.grafana.loadbalancer.server.port=3000"
    networks:
      - traefik-network

volumes:
  portainer-data:
  nextcloud-data:
  grafana-data:

networks:
  traefik-network:
    external: true
```

## Advanced Configuration

### File-Based Configuration

**Static Configuration (traefik.yml):**
```yaml
# /config/traefik.yml
global:
  checkNewVersion: false
  sendAnonymousUsage: false

api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entrypoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    exposedByDefault: false
    network: traefik-network
  file:
    directory: /config/dynamic
    watch: true

certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme.json
      tlsChallenge: {}
  cloudflare:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme-cloudflare.json
      dnsChallenge:
        provider: cloudflare
        delayBeforeCheck: 10

log:
  level: INFO
  format: json

accessLog:
  format: json
```

**Dynamic Configuration (dynamic.yml):**
```yaml
# /config/dynamic/dynamic.yml
http:
  middlewares:
    secure-headers:
      headers:
        accessControlAllowMethods:
          - GET
          - OPTIONS
          - PUT
        accessControlMaxAge: 100
        hostsProxyHeaders:
          - "X-Forwarded-Host"
        referrerPolicy: "same-origin"
        customRequestHeaders:
          X-Forwarded-Proto: "https"

    default-auth:
      basicAuth:
        users:
          - "admin:$2y$10$hashed-password"

    rate-limit:
      rateLimit:
        burst: 100
        average: 50

tls:
  options:
    default:
      minVersion: "VersionTLS12"
      cipherSuites:
        - "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"
        - "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
        - "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"
```

### Middleware Configuration

**Authentication Middleware:**
```yaml
labels:
  # Basic Auth
  - "traefik.http.middlewares.auth.basicauth.users=admin:$$2y$$10$$hashed-password"

  # OAuth (with oauth2-proxy)
  - "traefik.http.middlewares.oauth.forwardauth.address=http://oauth2-proxy:4180"
  - "traefik.http.middlewares.oauth.forwardauth.trustForwardHeader=true"
```

**Security Headers:**
```yaml
labels:
  - "traefik.http.middlewares.security.headers.frameDeny=true"
  - "traefik.http.middlewares.security.headers.sslRedirect=true"
  - "traefik.http.middlewares.security.headers.browserXssFilter=true"
  - "traefik.http.middlewares.security.headers.contentTypeNosniff=true"
  - "traefik.http.middlewares.security.headers.forceSTSHeader=true"
  - "traefik.http.middlewares.security.headers.stsIncludeSubdomains=true"
  - "traefik.http.middlewares.security.headers.stsPreload=true"
  - "traefik.http.middlewares.security.headers.stsSeconds=31536000"
```

**Rate Limiting:**
```yaml
labels:
  - "traefik.http.middlewares.ratelimit.ratelimit.burst=100"
  - "traefik.http.middlewares.ratelimit.ratelimit.average=50"
  - "traefik.http.middlewares.ratelimit.ratelimit.period=1m"
```

**IP Whitelisting:**
```yaml
labels:
  - "traefik.http.middlewares.whitelist.ipwhitelist.sourcerange=192.168.1.0/24,10.0.0.0/8"
```

### Load Balancing

**Multiple Backend Servers:**
```yaml
services:
  web1:
    image: nginx
    container_name: web1
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`app.yourdomain.com`)"
      - "traefik.http.routers.web.entrypoints=websecure"
      - "traefik.http.routers.web.tls.certresolver=letsencrypt"
      - "traefik.http.services.web.loadbalancer.server.port=80"
    networks:
      - traefik-network

  web2:
    image: nginx
    container_name: web2
    labels:
      - "traefik.enable=true"
      - "traefik.http.services.web.loadbalancer.server.port=80"
    networks:
      - traefik-network

  web3:
    image: nginx
    container_name: web3
    labels:
      - "traefik.enable=true"
      - "traefik.http.services.web.loadbalancer.server.port=80"
    networks:
      - traefik-network
```

**Health Checks:**
```yaml
labels:
  - "traefik.http.services.web.loadbalancer.healthcheck.path=/health"
  - "traefik.http.services.web.loadbalancer.healthcheck.interval=30s"
  - "traefik.http.services.web.loadbalancer.healthcheck.timeout=5s"
```

## SSL/TLS Configuration

### Certificate Management

**Multiple Certificate Resolvers:**
```yaml
command:
  # Let's Encrypt HTTP challenge
  - --certificatesresolvers.letsencrypt.acme.httpchallenge=true
  - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
  - --certificatesresolvers.letsencrypt.acme.email=your-email@example.com
  - --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json

  # Let's Encrypt DNS challenge
  - --certificatesresolvers.cloudflare.acme.dnschallenge=true
  - --certificatesresolvers.cloudflare.acme.dnschallenge.provider=cloudflare
  - --certificatesresolvers.cloudflare.acme.email=your-email@example.com
  - --certificatesresolvers.cloudflare.acme.storage=/letsencrypt/acme-cloudflare.json

  # ZeroSSL
  - --certificatesresolvers.zerossl.acme.caserver=https://acme.zerossl.com/v2/DV90
  - --certificatesresolvers.zerossl.acme.email=your-email@example.com
  - --certificatesresolvers.zerossl.acme.storage=/letsencrypt/acme-zerossl.json
  - --certificatesresolvers.zerossl.acme.httpchallenge=true
  - --certificatesresolvers.zerossl.acme.httpchallenge.entrypoint=web
```

**Wildcard Certificates:**
```yaml
labels:
  - "traefik.http.routers.app.tls.certresolver=cloudflare"
  - "traefik.http.routers.app.tls.domains[0].main=yourdomain.com"
  - "traefik.http.routers.app.tls.domains[0].sans=*.yourdomain.com"
```

### Custom Certificates

**File-Based Certificates:**
```yaml
# dynamic.yml
tls:
  certificates:
    - certFile: /certs/yourdomain.com.crt
      keyFile: /certs/yourdomain.com.key
      stores:
        - default
    - certFile: /certs/wildcard.yourdomain.com.crt
      keyFile: /certs/wildcard.yourdomain.com.key
      stores:
        - default
```

## Monitoring and Observability

### Dashboard Configuration

**Enhanced Dashboard:**
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.dashboard.rule=Host(`traefik.yourdomain.com`)"
  - "traefik.http.routers.dashboard.entrypoints=websecure"
  - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
  - "traefik.http.routers.dashboard.service=api@internal"
  - "traefik.http.routers.dashboard.middlewares=dashboard-auth,dashboard-headers"

  # Authentication
  - "traefik.http.middlewares.dashboard-auth.basicauth.users=admin:$$2y$$10$$hashed-password"

  # Security headers
  - "traefik.http.middlewares.dashboard-headers.headers.frameDeny=true"
  - "traefik.http.middlewares.dashboard-headers.headers.browserXssFilter=true"
```

### Metrics and Logging

**Prometheus Metrics:**
```yaml
command:
  - --metrics.prometheus=true
  - --metrics.prometheus.addEntryPointsLabels=true
  - --metrics.prometheus.addServicesLabels=true
  - --entrypoints.metrics.address=:8080

labels:
  - "traefik.http.routers.prometheus.rule=Host(`traefik.yourdomain.com`) && PathPrefix(`/metrics`)"
  - "traefik.http.routers.prometheus.entrypoints=metrics"
  - "traefik.http.routers.prometheus.middlewares=prometheus-auth"
```

**Log Configuration:**
```yaml
command:
  - --log.level=INFO
  - --log.format=json
  - --log.filepath=/logs/traefik.log
  - --accesslog=true
  - --accesslog.format=json
  - --accesslog.filepath=/logs/access.log
  - --accesslog.fields.names.StartUTC=drop
```

## Troubleshooting

### Common Issues

**Certificate Generation Problems:**
```bash
# Check certificate resolver status
docker exec traefik traefik version

# View certificate information
docker exec traefik cat /letsencrypt/acme.json | jq

# Test DNS resolution
dig TXT _acme-challenge.yourdomain.com

# Check API credentials
docker logs traefik 2>&1 | grep -i certificate
```

**Routing Issues:**
```bash
# Check service discovery
docker exec traefik traefik healthcheck

# View active routes
curl -s http://traefik:8080/api/http/routers | jq

# Check service connectivity
docker exec traefik wget -qO- http://target-service:port/health
```

**Network Connectivity:**
```bash
# Test container networking
docker network inspect traefik-network

# Check port accessibility
telnet yourdomain.com 443

# Test internal DNS resolution
docker exec traefik nslookup target-service
```

### Debug Configuration

**Debug Mode:**
```yaml
command:
  - --log.level=DEBUG
  - --accesslog=true
  - --api.debug=true
```

**Health Checks:**
```bash
# Traefik health check
curl -f http://localhost:8080/ping || exit 1

# Service health monitoring
curl -f http://localhost:8080/api/overview || exit 1
```

## Performance Optimization

### Resource Management

**Container Limits:**
```yaml
services:
  traefik:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M
```

**Connection Tuning:**
```yaml
command:
  - --entrypoints.websecure.transport.respondingTimeouts.readTimeout=300s
  - --entrypoints.websecure.transport.respondingTimeouts.writeTimeout=300s
  - --entrypoints.websecure.transport.respondingTimeouts.idleTimeout=180s
```

### Caching and Compression

**Response Compression:**
```yaml
labels:
  - "traefik.http.middlewares.compression.compress=true"
  - "traefik.http.routers.app.middlewares=compression"
```

### Load Balancer Optimization

**Sticky Sessions:**
```yaml
labels:
  - "traefik.http.services.app.loadbalancer.sticky.cookie=true"
  - "traefik.http.services.app.loadbalancer.sticky.cookie.name=traefik-session"
```

## Backup and Recovery

### Configuration Backup

**Backup Script:**
```bash
#!/bin/bash
# traefik-backup.sh

BACKUP_DIR="/backup/traefik"
CONFIG_DIR="/path/to/traefik-data"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup certificates and configuration
tar -czf "$BACKUP_DIR/traefik-backup-$DATE.tar.gz" \
  "$CONFIG_DIR/letsencrypt" \
  "$CONFIG_DIR/config" \
  docker-compose.yml

# Keep only last 30 backups
find "$BACKUP_DIR" -name "traefik-backup-*.tar.gz" -mtime +30 -delete
```

### Certificate Backup

**ACME Data Backup:**
```bash
# Backup ACME certificates
cp /path/to/traefik-data/letsencrypt/acme.json /backup/acme-$(date +%Y%m%d).json

# Verify certificate backup
jq . /backup/acme-$(date +%Y%m%d).json > /dev/null && echo "Backup valid"
```

## Integration Examples

### Complete Homelab Stack

**Production-Ready Configuration:**
```yaml
version: '3.8'
services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    command:
      - --api.dashboard=true
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --certificatesresolvers.cloudflare.acme.dnschallenge=true
      - --certificatesresolvers.cloudflare.acme.dnschallenge.provider=cloudflare
      - --certificatesresolvers.cloudflare.acme.email=admin@yourdomain.com
      - --certificatesresolvers.cloudflare.acme.storage=/letsencrypt/acme.json
      - --metrics.prometheus=true
    environment:
      - CF_API_EMAIL=admin@yourdomain.com
      - CF_API_KEY=your-api-key
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik-data:/letsencrypt
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.yourdomain.com`)"
      - "traefik.http.routers.dashboard.entrypoints=websecure"
      - "traefik.http.routers.dashboard.tls.certresolver=cloudflare"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=auth"
      - "traefik.http.middlewares.auth.basicauth.users=admin:$$2y$$10$$hashed-password"
    networks:
      - traefik-network

networks:
  traefik-network:
    external: true
```

## Special Thanks

- **Traefik Team** for developing this excellent modern reverse proxy
- **Containous/Traefik Labs** for continuous innovation in cloud-native networking
- **Let's Encrypt** for providing free SSL certificates
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
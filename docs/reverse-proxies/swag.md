---
title: "SWAG"
sidebar_position: 1
description: "Secure Web Application Gateway with Nginx reverse proxy and automated SSL"
tags: ["reverse-proxies", "ibracorp"]
source_url: https://docs.ibracorp.io/swag-2/
---

# SWAG

Secure Web Application Gateway with Nginx reverse proxy and automated SSL

:::info SWAG Reverse Proxy
**Video**
[IBRACORP SWAG Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [LinuxServer.io SWAG Documentation](https://docs.linuxserver.io/general/swag)
- [SWAG GitHub Repository](https://github.com/linuxserver/docker-swag)
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
| Developer | LinuxServer.io Team |
| Contributor | SWAG Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**SWAG (Secure Web Application Gateway) Features:**

- Nginx web server with advanced reverse proxy capabilities
- Automated SSL certificate generation and renewal (Let's Encrypt/ZeroSSL)
- Built-in Certbot client for certificate management
- Fail2ban intrusion prevention system
- Docker container auto-discovery and configuration
- Multiple DNS validation methods (Cloudflare, Route53, etc.)
- Subdomain and path-based routing
- Authentication integration (Authelia, OAuth)
- DDoS protection and rate limiting
- Real IP detection and logging

## Prerequisites

**System Requirements:**

- **Domain:** Registered domain with configurable DNS
- **DNS Provider:** Cloudflare, Route53, or compatible provider
- **Docker:** Docker and Docker Compose environment
- **Network:** Port 80 and 443 access from internet
- **Storage:** 2GB available space for configuration and logs

**Network Prerequisites:**
- **Port Forwarding:** 80/tcp and 443/tcp forwarded to SWAG container
- **Domain DNS:** A/AAAA records pointing to your public IP
- **API Access:** DNS provider API credentials for automatic validation

## Installation

### Unraid Docker Template

**SWAG / LinuxServer.io Repository / Web Servers**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **SWAG** from **LinuxServer.io**
3. Configure the container settings:
   - **Network Type:** Custom Docker network (recommended)
   - **WebUI Ports:** 443 (HTTPS), 80 (HTTP)
   - **Config Path:** `/mnt/user/appdata/swag`
4. **Configure Environment Variables:**
   - **URL:** Your domain name (example.com)
   - **SUBDOMAINS:** wildcard or specific subdomains
   - **VALIDATION:** dns (recommended) or http
   - **DNSPLUGIN:** cloudflare, route53, etc.
   - **EMAIL:** Your email for Let's Encrypt notifications
   - **PUID/PGID:** 1000/1000
   - **TZ:** Your timezone
5. **DNS Provider Configuration:**
   - **Cloudflare:** Set CF_API_TOKEN or CF_EMAIL + CF_API_KEY
   - **Route53:** Set AWS credentials
6. Click Apply and wait for certificate generation

### Docker Compose

```yaml
version: '3.8'
services:
  swag:
    image: lscr.io/linuxserver/swag:latest
    container_name: swag
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - URL=yourdomain.com
      - SUBDOMAINS=wildcard
      - VALIDATION=dns
      - DNSPLUGIN=cloudflare
      - EMAIL=your-email@example.com
      - CF_API_TOKEN=your_cloudflare_api_token
    volumes:
      - ./swag-config:/config
    ports:
      - "443:443"
      - "80:80"
    networks:
      - swag-network

networks:
  swag-network:
    driver: bridge
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Configure your domain and DNS provider credentials
3. Create the swag network:
   ```bash
   docker network create swag-network
   ```
4. Start the container:
   ```bash
   docker compose up -d
   ```
5. Monitor logs for certificate generation:
   ```bash
   docker logs -f swag
   ```

## DNS Provider Configuration

### Cloudflare Setup

**API Token Creation:**
1. Visit https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use **"Custom token"** template
4. **Permissions:**
   - Zone:Zone:Read
   - Zone:DNS:Edit
5. **Zone Resources:**
   - Include → Specific zone → yourdomain.com
6. Copy the generated token

**SWAG Configuration:**
```yaml
environment:
  - DNSPLUGIN=cloudflare
  - CF_API_TOKEN=your_cloudflare_api_token
```

### Route53 Setup

**AWS Credentials:**
```yaml
environment:
  - DNSPLUGIN=route53
  - AWS_ACCESS_KEY_ID=your_access_key
  - AWS_SECRET_ACCESS_KEY=your_secret_key
  - AWS_DEFAULT_REGION=us-east-1
```

### Duck DNS Setup

**Duck DNS Configuration:**
```yaml
environment:
  - DNSPLUGIN=duckdns
  - DUCKDNSTOKEN=your_duckdns_token
```

## Reverse Proxy Configuration

### Container Auto-Discovery

**Docker Labels Method:**
```yaml
# Example application with SWAG labels
services:
  app:
    image: nginx
    container_name: my-app
    labels:
      - "swag=enable"
      - "swag.port=80"
      - "swag.subdomain=app"
    networks:
      - swag-network
```

**SWAG Environment Variables:**
```yaml
swag:
  environment:
    - DOCKER_MODS=linuxserver/mods:swag-auto-proxy
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
```

### Manual Nginx Configuration

**Subdomain Configuration:**
```nginx
# /config/nginx/proxy-confs/app.subdomain.conf
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name app.*;

    include /config/nginx/ssl.conf;

    client_max_body_size 0;

    location / {
        include /config/nginx/proxy.conf;
        include /config/nginx/resolver.conf;
        set $upstream_app my-app;
        set $upstream_port 80;
        set $upstream_proto http;
        proxy_pass $upstream_proto://$upstream_app:$upstream_port;
    }
}
```

**Path-Based Configuration:**
```nginx
# /config/nginx/proxy-confs/app.subfolder.conf
location /app {
    return 301 $scheme://$host/app/;
}

location ^~ /app/ {
    include /config/nginx/proxy.conf;
    include /config/nginx/resolver.conf;
    set $upstream_app my-app;
    set $upstream_port 80;
    set $upstream_proto http;
    proxy_pass $upstream_proto://$upstream_app:$upstream_port/;
}
```

### Advanced Proxy Configuration

**WebSocket Support:**
```nginx
# WebSocket configuration
location /ws {
    include /config/nginx/proxy.conf;
    include /config/nginx/resolver.conf;
    set $upstream_app websocket-app;
    set $upstream_port 8080;
    set $upstream_proto http;
    proxy_pass $upstream_proto://$upstream_app:$upstream_port;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

**Custom Headers and Timeouts:**
```nginx
# Custom proxy configuration
location / {
    include /config/nginx/proxy.conf;
    include /config/nginx/resolver.conf;
    set $upstream_app my-app;
    set $upstream_port 80;
    set $upstream_proto http;
    proxy_pass $upstream_proto://$upstream_app:$upstream_port;

    # Custom headers
    proxy_set_header X-Custom-Header "Value";

    # Timeouts
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;

    # Buffer settings
    proxy_buffering off;
    proxy_request_buffering off;
}
```

## Authentication Integration

### Authelia Setup

**Authelia Docker Configuration:**
```yaml
services:
  authelia:
    image: authelia/authelia:latest
    container_name: authelia
    restart: unless-stopped
    environment:
      - TZ=America/New_York
    volumes:
      - ./authelia-config:/config
    networks:
      - swag-network
```

**SWAG + Authelia Integration:**
```nginx
# /config/nginx/proxy-confs/app.subdomain.conf
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name app.*;

    include /config/nginx/ssl.conf;

    # Authelia protection
    include /config/nginx/authelia-server.conf;

    client_max_body_size 0;

    location / {
        include /config/nginx/authelia-location.conf;
        include /config/nginx/proxy.conf;
        include /config/nginx/resolver.conf;
        set $upstream_app my-app;
        set $upstream_port 80;
        set $upstream_proto http;
        proxy_pass $upstream_proto://$upstream_app:$upstream_port;
    }
}
```

### OAuth Integration

**OAuth Configuration:**
```nginx
# OAuth endpoint configuration
location /oauth2/ {
    proxy_pass http://oauth2-proxy:4180;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Scheme $scheme;
    proxy_set_header X-Auth-Request-Redirect $request_uri;
}

location /oauth2/auth {
    proxy_pass http://oauth2-proxy:4180;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
}
```

## Security Configuration

### Fail2ban Setup

**Fail2ban Configuration:**
```yaml
swag:
  environment:
    - DOCKER_MODS=linuxserver/mods:swag-fail2ban
  cap_add:
    - NET_ADMIN
```

**Custom Fail2ban Rules:**
```ini
# /config/fail2ban/jail.local
[nginx-http-auth]
enabled = true
port = http,https
logpath = /config/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /config/log/nginx/access.log

[nginx-badbots]
enabled = true
port = http,https
logpath = /config/log/nginx/access.log
```

### Rate Limiting

**Rate Limiting Configuration:**
```nginx
# /config/nginx/nginx.conf (in http block)
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# In location block
location /login {
    limit_req zone=login burst=3 nodelay;
    # ... proxy configuration
}

location /api {
    limit_req zone=api burst=20 nodelay;
    # ... proxy configuration
}
```

### SSL/TLS Security

**SSL Configuration:**
```nginx
# /config/nginx/ssl.conf
ssl_certificate /config/keys/letsencrypt/fullchain.pem;
ssl_certificate_key /config/keys/letsencrypt/privkey.pem;

ssl_session_timeout 1d;
ssl_session_cache shared:MozTLS:10m;
ssl_session_tickets off;

ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;

# HSTS
add_header Strict-Transport-Security "max-age=63072000" always;
```

## Monitoring and Maintenance

### Log Management

**Log Configuration:**
```nginx
# /config/nginx/nginx.conf
error_log /config/log/nginx/error.log warn;

http {
    access_log /config/log/nginx/access.log combined;

    # Custom log format
    log_format detailed '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent" '
                       '$request_time $upstream_response_time';
}
```

**Log Analysis:**
```bash
# View real-time access logs
docker exec swag tail -f /config/log/nginx/access.log

# Check error logs
docker exec swag tail -f /config/log/nginx/error.log

# Analyze most frequent visitors
docker exec swag awk '{print $1}' /config/log/nginx/access.log | sort | uniq -c | sort -nr | head -10

# Check SSL certificate status
docker exec swag openssl x509 -in /config/keys/letsencrypt/fullchain.pem -text -noout
```

### Certificate Management

**Certificate Renewal:**
```bash
# Force certificate renewal
docker exec swag certbot renew --force-renewal

# Check certificate expiration
docker exec swag certbot certificates

# Test renewal process
docker exec swag certbot renew --dry-run
```

**Certificate Monitoring:**
```bash
#!/bin/bash
# cert-monitor.sh
CERT_FILE="/path/to/swag-config/keys/letsencrypt/fullchain.pem"
EXPIRE_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
EXPIRE_EPOCH=$(date -d "$EXPIRE_DATE" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( ($EXPIRE_EPOCH - $NOW_EPOCH) / 86400 ))

if [ $DAYS_LEFT -lt 30 ]; then
    echo "Certificate expires in $DAYS_LEFT days!"
fi
```

## Troubleshooting

### Common Issues

**Certificate Generation Failures:**
```bash
# Check DNS propagation
dig TXT _acme-challenge.yourdomain.com

# Verify API credentials
docker exec swag certbot certificates

# Check container logs
docker logs swag 2>&1 | grep -i error
```

**Proxy Connection Issues:**
```bash
# Test upstream connectivity
docker exec swag curl -I http://target-container:80

# Check network connectivity
docker network inspect swag-network

# Verify container names resolution
docker exec swag nslookup target-container
```

**SSL/TLS Issues:**
```bash
# Test SSL configuration
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check cipher suites
nmap --script ssl-enum-ciphers -p 443 yourdomain.com

# Verify certificate chain
curl -I https://yourdomain.com
```

### Performance Optimization

**Nginx Optimization:**
```nginx
# /config/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript;

    # Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Container Resource Limits:**
```yaml
services:
  swag:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '1.0'
          memory: 512M
```

## Advanced Configuration

### Multi-Domain Setup

**Multiple Domain Configuration:**
```yaml
swag:
  environment:
    - URL=domain1.com,domain2.com
    - SUBDOMAINS=wildcard
    - VALIDATION=dns
```

### Custom Nginx Modules

**Docker Mods:**
```yaml
swag:
  environment:
    - DOCKER_MODS=linuxserver/mods:universal-docker|linuxserver/mods:swag-cloudflare-real-ip|linuxserver/mods:swag-auto-reload
```

### GeoIP Blocking

**GeoIP Configuration:**
```nginx
# /config/nginx/nginx.conf
http {
    geoip_country /config/geoip/GeoIP.dat;

    map $geoip_country_code $allowed_country {
        default no;
        US yes;
        CA yes;
    }
}

# In server block
if ($allowed_country = no) {
    return 403;
}
```

## Backup and Recovery

### Configuration Backup

**Backup Script:**
```bash
#!/bin/bash
# swag-backup.sh

BACKUP_DIR="/backup/swag"
CONFIG_DIR="/path/to/swag-config"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup configuration (excluding logs)
tar -czf "$BACKUP_DIR/swag-config-$DATE.tar.gz" \
  --exclude="$CONFIG_DIR/log" \
  --exclude="$CONFIG_DIR/fail2ban/db" \
  "$CONFIG_DIR"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "swag-config-*.tar.gz" -mtime +30 -delete
```

### Disaster Recovery

**Recovery Procedures:**
```bash
# Restore SWAG configuration
docker stop swag
tar -xzf /backup/swag/swag-config-latest.tar.gz -C /
docker start swag

# Force certificate regeneration if needed
docker exec swag rm -rf /config/keys/letsencrypt
docker restart swag
```

## Integration Examples

### Complete Homelab Stack

**Full Stack Configuration:**
```yaml
version: '3.8'
services:
  swag:
    image: lscr.io/linuxserver/swag:latest
    container_name: swag
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    environment:
      - URL=homelab.example.com
      - SUBDOMAINS=wildcard
      - VALIDATION=dns
      - DNSPLUGIN=cloudflare
      - CF_API_TOKEN=token
      - DOCKER_MODS=linuxserver/mods:swag-auto-proxy
    volumes:
      - ./swag:/config
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - "443:443"
      - "80:80"
    networks:
      - homelab

  portainer:
    image: portainer/portainer-ce
    container_name: portainer
    labels:
      - "swag=enable"
      - "swag.port=9000"
      - "swag.subdomain=portainer"
    networks:
      - homelab

networks:
  homelab:
    driver: bridge
```

## Special Thanks

- **LinuxServer.io Team** for developing and maintaining the excellent SWAG container
- **Let's Encrypt** for providing free SSL certificates
- **Nginx Community** for the powerful web server and reverse proxy
- To our fantastic Discord community and our Admins **DiscDuck** and **Hawks** for their input and documentation (as always)

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
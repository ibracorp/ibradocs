---
title: "Cloudflare Tunnel"
sidebar_position: 2
description: "Secure remote access to local services using Cloudflare Tunnel"
tags: ["networking", "ibracorp"]
source_url: https://docs.ibracorp.io/cloudflare-tunnel/
---

# Cloudflare Tunnel

Secure remote access to local services using Cloudflare Tunnel

:::info Cloudflare Tunnel Setup
**Video**
[IBRACORP Cloudflare Tunnel Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Cloudflare Terms of Service](https://www.cloudflare.com/terms/)

**Related Videos**
Check IBRACORP YouTube channel for latest tutorials
:::

:::warning Important - Terms of Service
**IT IS AGAINST CLOUDFLARE TERMS OF SERVICE TO USE PROXYING VIA CLOUDFLARE FOR ANY CONTENT THAT IS NOT HTML TRAFFIC**

Specifically, do not use Cloudflare Tunnel for:
- Media streaming (Plex, Jellyfin, etc.)
- File hosting or downloads
- Game servers
- Video conferencing

Use only for web applications and HTML content!
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
| Contributor | Cloudflare Team |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Cloudflare Tunnel Features:**

- Secure outbound-only connections to Cloudflare
- No firewall port forwarding required
- Zero Trust network access model
- Traffic encryption and authentication
- Built-in DDoS protection
- Global CDN acceleration
- Load balancing capabilities
- Access control and authentication
- Health checks and monitoring
- Multiple transport protocol support

## Prerequisites

**System Requirements:**

- **Domain:** Domain managed by Cloudflare (free plan acceptable)
- **Docker:** Docker environment for running cloudflared
- **Storage:** 1GB available space for configuration
- **Network:** Stable internet connection
- **Cloudflare Account:** Free or paid Cloudflare account

**Domain Prerequisites:**
- Domain registered and pointing to Cloudflare nameservers
- Access to Cloudflare dashboard
- DNS management permissions

## Installation

### Step 1: Prepare Environment

**Create Configuration Directory:**
```bash
# Create cloudflared directory with proper permissions
mkdir -p /mnt/user/appdata/cloudflared/
chmod -R 777 /mnt/user/appdata/cloudflared/
```

**Verify Docker Access:**
```bash
# Test Docker functionality
docker run hello-world

# Pull cloudflared image
docker pull cloudflare/cloudflared:latest
```

### Step 2: Authenticate with Cloudflare

**Login to Cloudflare:**
```bash
# Interactive authentication with Cloudflare
docker run -it --rm \
  -v /mnt/user/appdata/cloudflared:/home/nonroot/.cloudflared/ \
  cloudflare/cloudflared:latest tunnel login
```

**Authentication Process:**
1. Command opens browser to Cloudflare login
2. Authenticate with your Cloudflare account
3. Select domain to authorize
4. Certificate file saved to configuration directory

### Step 3: Create Tunnel

**Create New Tunnel:**
```bash
# Create tunnel with descriptive name
docker run -it --rm \
  -v /mnt/user/appdata/cloudflared:/home/nonroot/.cloudflared/ \
  cloudflare/cloudflared:latest tunnel create homelab-tunnel
```

**Tunnel Creation Output:**
```bash
# Example output
Tunnel credentials written to /home/nonroot/.cloudflared/a1b2c3d4-e5f6-7890-abcd-ef1234567890.json
Created tunnel homelab-tunnel with id a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Step 4: Configuration File

**Create config.yaml:**
```yaml
# /mnt/user/appdata/cloudflared/config.yaml
tunnel: a1b2c3d4-e5f6-7890-abcd-ef1234567890
credentials-file: /home/nonroot/.cloudflared/a1b2c3d4-e5f6-7890-abcd-ef1234567890.json

# Ingress rules (order matters!)
ingress:
  # Specific service routing
  - hostname: dashboard.yourdomain.com
    service: http://192.168.1.100:8080
    originRequest:
      noTLSVerify: true

  - hostname: admin.yourdomain.com
    service: http://192.168.1.100:8443
    originRequest:
      noTLSVerify: true

  # Wildcard routing for subdomains
  - hostname: "*.yourdomain.com"
    service: http://192.168.1.100:80

  # Catch-all rule (required as last rule)
  - service: http_status:404

# Optional: Transport protocol configuration
protocol: auto  # Options: auto, http2, h2mux, quic

# Optional: Logging configuration
loglevel: info  # Options: debug, info, warn, error, fatal
```

### Step 5: DNS Configuration

**Update DNS Records:**

1. **Access Cloudflare Dashboard:**
   - Navigate to DNS management
   - Locate existing A records for your domain

2. **Replace A Records with CNAME:**
   ```dns
   # Before (A record)
   dashboard  A  192.168.1.100

   # After (CNAME record)
   dashboard  CNAME  a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com
   ```

3. **Configure Multiple Subdomains:**
   ```dns
   # Multiple CNAME records pointing to tunnel
   dashboard  CNAME  a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com
   admin      CNAME  a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com
   home       CNAME  a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com
   ```

## Docker Deployment

### Docker Compose Configuration

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel --config /home/nonroot/.cloudflared/config.yaml run
    volumes:
      - ./cloudflared-config:/home/nonroot/.cloudflared/
    networks:
      - tunnel-network
    environment:
      - TUNNEL_METRICS=0.0.0.0:8081  # Optional metrics endpoint

networks:
  tunnel-network:
    external: true
```

**Deployment Steps:**
```bash
# Create external network
docker network create tunnel-network

# Start Cloudflare Tunnel
docker compose up -d

# Verify tunnel status
docker logs cloudflared
```

### Unraid Docker Template

**Unraid Configuration:**
```yaml
unraid_template:
  repository: "cloudflare/cloudflared:latest"
  container_name: "cloudflared"
  network_type: "bridge"

  volumes:
    - container_path: "/home/nonroot/.cloudflared/"
      host_path: "/mnt/user/appdata/cloudflared/"
      access_mode: "rw"

  command: "tunnel --config /home/nonroot/.cloudflared/config.yaml run"

  environment_variables:
    - name: "TUNNEL_METRICS"
      value: "0.0.0.0:8081"
```

## Advanced Configuration

### Multiple Service Routing

**Complex Ingress Rules:**
```yaml
ingress:
  # Different services on different ports
  - hostname: portainer.yourdomain.com
    service: http://192.168.1.100:9000

  - hostname: unraid.yourdomain.com
    service: https://192.168.1.100:443
    originRequest:
      noTLSVerify: true

  - hostname: pfsense.yourdomain.com
    service: https://192.168.1.1:443
    originRequest:
      noTLSVerify: true

  # Path-based routing
  - hostname: api.yourdomain.com
    path: /v1/*
    service: http://192.168.1.100:3001

  - hostname: api.yourdomain.com
    path: /v2/*
    service: http://192.168.1.100:3002

  # WebSocket support
  - hostname: websocket.yourdomain.com
    service: ws://192.168.1.100:8080

  # Catch-all
  - service: http_status:404
```

### Access Control Integration

**Zero Trust Access Policies:**
```yaml
# This configuration is set in Cloudflare Dashboard
access_policies:
  - name: "Admin Access"
    hostnames:
      - "admin.yourdomain.com"
      - "unraid.yourdomain.com"
    rules:
      - email_domain: "yourdomain.com"
      - ip_range: "192.168.1.0/24"

  - name: "Family Access"
    hostnames:
      - "home.yourdomain.com"
    rules:
      - email_list:
          - "user1@yourdomain.com"
          - "user2@yourdomain.com"
```

### Load Balancing

**Multiple Origin Configuration:**
```yaml
ingress:
  - hostname: app.yourdomain.com
    service: http://load-balancer
    originRequest:
      connectTimeout: 10s
      tlsTimeout: 10s
      keepAliveTimeout: 10s

# Load balancer configuration (via Cloudflare Dashboard)
load_balancers:
  - name: "app-lb"
    origins:
      - address: "192.168.1.100:8080"
        weight: 50
        enabled: true
      - address: "192.168.1.101:8080"
        weight: 50
        enabled: true
    health_checks:
      enabled: true
      path: "/health"
      interval: 60s
```

## Monitoring and Troubleshooting

### Health Monitoring

**Tunnel Status Commands:**
```bash
# Check tunnel status
docker exec cloudflared cloudflared tunnel info homelab-tunnel

# List all tunnels
docker exec cloudflared cloudflared tunnel list

# View tunnel configuration
docker exec cloudflared cloudflared tunnel ingress validate

# Test ingress rules
docker exec cloudflared cloudflared tunnel ingress url https://dashboard.yourdomain.com
```

### Logging and Debugging

**Enable Debug Logging:**
```yaml
# config.yaml debug settings
loglevel: debug
protocol: auto
transport-loglevel: debug

# Optional: Enable metrics
metrics: 0.0.0.0:8081
```

**Log Analysis:**
```bash
# View container logs
docker logs cloudflared

# Follow logs in real-time
docker logs -f cloudflared

# Search for specific errors
docker logs cloudflared 2>&1 | grep -i "error"

# Check connection status
docker logs cloudflared 2>&1 | grep -i "connection"
```

### Performance Monitoring

**Metrics Endpoint:**
```bash
# Enable metrics in config.yaml
metrics: 0.0.0.0:8081

# Access metrics
curl http://localhost:8081/metrics

# Key metrics to monitor:
# - cloudflared_tunnel_connections
# - cloudflared_tunnel_requests_total
# - cloudflared_tunnel_response_time_seconds
```

### Common Troubleshooting

**Connection Issues:**
```bash
# Test DNS resolution
nslookup dashboard.yourdomain.com

# Check tunnel connectivity
docker exec cloudflared cloudflared tunnel info homelab-tunnel

# Verify ingress rules
docker exec cloudflared cloudflared tunnel ingress validate

# Test specific route
docker exec cloudflared cloudflared tunnel ingress url https://dashboard.yourdomain.com
```

**SSL/TLS Issues:**
```yaml
# config.yaml SSL configuration
ingress:
  - hostname: app.yourdomain.com
    service: https://192.168.1.100:8443
    originRequest:
      noTLSVerify: true  # For self-signed certificates
      caPool: /path/to/ca-certificates.pem  # For custom CA
      originServerName: "internal.local"  # For SNI
```

**Performance Issues:**
```yaml
# config.yaml performance tuning
protocol: quic  # Try different protocols: auto, http2, h2mux, quic

originRequest:
  connectTimeout: 30s
  tlsTimeout: 10s
  tcpKeepAlive: 30s
  keepAliveTimeout: 90s
  httpHostHeader: "original-host.com"
```

## Security Best Practices

### Network Segmentation

**Firewall Rules:**
```bash
# Allow only necessary outbound connections
# Cloudflare Tunnel only requires outbound 443/tcp

# Block direct access to internal services
iptables -A INPUT -p tcp --dport 8080 -s ! 127.0.0.1 -j DROP
iptables -A INPUT -p tcp --dport 9000 -s ! 127.0.0.1 -j DROP
```

### Access Control

**Zero Trust Configuration:**
1. **Enable Cloudflare Access:**
   - Navigate to Cloudflare Dashboard → Zero Trust
   - Configure identity providers (Google, Microsoft, etc.)
   - Create access policies for each application

2. **Multi-Factor Authentication:**
   ```yaml
   access_policy:
     require:
       - email_domain: "yourdomain.com"
       - mfa: true
       - device_posture: "managed"
   ```

### Certificate Management

**Custom Certificates:**
```yaml
# config.yaml with custom certificates
ingress:
  - hostname: app.yourdomain.com
    service: https://192.168.1.100:8443
    originRequest:
      caPool: /home/nonroot/.cloudflared/custom-ca.pem
      originServerName: "internal.app.local"
```

## Maintenance and Updates

### Regular Maintenance

**Update Procedures:**
```bash
# Update cloudflared container
docker pull cloudflare/cloudflared:latest
docker compose down
docker compose up -d

# Verify tunnel after update
docker logs cloudflared
```

**Configuration Backup:**
```bash
#!/bin/bash
# cloudflared-backup.sh

BACKUP_DIR="/backup/cloudflared"
CONFIG_DIR="/mnt/user/appdata/cloudflared"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup configuration
tar -czf "$BACKUP_DIR/cloudflared-config-$DATE.tar.gz" "$CONFIG_DIR"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "cloudflared-config-*.tar.gz" -mtime +30 -delete
```

### Tunnel Management

**Tunnel Lifecycle:**
```bash
# Create new tunnel
docker run -it --rm \
  -v /mnt/user/appdata/cloudflared:/home/nonroot/.cloudflared/ \
  cloudflare/cloudflared:latest tunnel create new-tunnel

# Delete old tunnel
docker run -it --rm \
  -v /mnt/user/appdata/cloudflared:/home/nonroot/.cloudflared/ \
  cloudflare/cloudflared:latest tunnel delete old-tunnel

# Update tunnel routes
docker run -it --rm \
  -v /mnt/user/appdata/cloudflared:/home/nonroot/.cloudflared/ \
  cloudflare/cloudflared:latest tunnel route dns tunnel-id subdomain.yourdomain.com
```

## Use Cases and Examples

### Home Lab Access

**Home Lab Configuration:**
```yaml
# Home lab services
ingress:
  - hostname: unraid.yourdomain.com
    service: https://192.168.1.100:443
    originRequest:
      noTLSVerify: true

  - hostname: router.yourdomain.com
    service: https://192.168.1.1:443
    originRequest:
      noTLSVerify: true

  - hostname: portainer.yourdomain.com
    service: http://192.168.1.100:9000

  - hostname: grafana.yourdomain.com
    service: http://192.168.1.100:3000

  - service: http_status:404
```

### Development Environment

**Development Services:**
```yaml
# Development environment access
ingress:
  - hostname: api-dev.yourdomain.com
    service: http://192.168.1.100:3001

  - hostname: frontend-dev.yourdomain.com
    service: http://192.168.1.100:3000

  - hostname: database-admin.yourdomain.com
    service: http://192.168.1.100:8080

  - hostname: docs.yourdomain.com
    service: http://192.168.1.100:4000

  - service: http_status:404
```

## Special Thanks

- **Cloudflare Team** for providing excellent tunnel technology and documentation
- **Cloudflare Community** for extensive examples and troubleshooting resources
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
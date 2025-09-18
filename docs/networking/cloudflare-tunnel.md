# Cloudflare Tunnel

Cloudflare Tunnel creates a secure, outbound-only connection between your services and Cloudflare's network, eliminating the need for publicly routable IP addresses or opened firewall ports.

:::warning Important
Do not use Cloudflare Tunnel for media streaming services. This violates Cloudflare's Terms of Service and can result in account suspension.
:::

## Prerequisites

Before setting up Cloudflare Tunnel, ensure you have:

- A domain managed by Cloudflare
- Unraid server or Docker environment
- Administrative access to your Cloudflare account

## Installation Steps

### 1. Create Application Directory

Create and configure the cloudflared directory:

```bash
mkdir -p /mnt/user/appdata/cloudflared/
chmod -R 777 /mnt/user/appdata/cloudflared/
```

### 2. Authorize Cloudflared

Authenticate with your Cloudflare account:

```bash
docker run -it --rm \
  -v /mnt/user/appdata/cloudflared:/home/nonroot/.cloudflared/ \
  cloudflare/cloudflared:latest tunnel login
```

This opens a browser window for Cloudflare authentication. Select the domain you want to use for the tunnel.

### 3. Create the Tunnel

Create a new tunnel with a descriptive name:

```bash
docker run -it --rm \
  -v /mnt/user/appdata/cloudflared:/home/nonroot/.cloudflared/ \
  cloudflare/cloudflared:latest tunnel create TUNNELNAME
```

Replace `TUNNELNAME` with your desired tunnel name. Note the tunnel UUID that's generated.

### 4. Configure the Tunnel

Create the configuration file:

```bash
nano /mnt/user/appdata/cloudflared/config.yml
```

Add your tunnel configuration:

```yaml
tunnel: YOUR_TUNNEL_UUID
credentials-file: /home/nonroot/.cloudflared/YOUR_TUNNEL_UUID.json

ingress:
  - hostname: app1.yourdomain.com
    service: http://192.168.1.100:8080
  - hostname: app2.yourdomain.com
    service: http://192.168.1.100:9090
  - hostname: "*.yourdomain.com"
    service: http://192.168.1.100:80  # Your reverse proxy
  - service: http_status:404
```

Replace placeholders with your actual:
- Tunnel UUID
- Domain name
- Internal service IP addresses and ports

### 5. Install Cloudflared in Unraid

1. Open **Community Applications**
2. Search for "cloudflared"
3. Configure the container:
   - **Repository**: `cloudflare/cloudflared:latest`
   - **Post Arguments**: `tunnel --config /home/nonroot/.cloudflared/config.yml run`
   - **Volume Mapping**: `/mnt/user/appdata/cloudflared/:/home/nonroot/.cloudflared/`

### 6. Configure DNS Records

In your Cloudflare DNS settings:

1. **Remove existing A records** for domains you want to tunnel
2. **Create CNAME records** pointing to `YOUR_TUNNEL_UUID.cfargotunnel.com`
3. Ensure **Proxy status is enabled** (orange cloud icon)

Example DNS configuration:
```
Type: CNAME
Name: app1
Target: 550e8400-e29b-41d4-a716-446655440000.cfargotunnel.com
Proxy: Enabled
```

## Configuration Examples

### Basic Web Application

```yaml
ingress:
  - hostname: myapp.example.com
    service: http://localhost:3000
  - service: http_status:404
```

### Multiple Services with Path-Based Routing

```yaml
ingress:
  - hostname: services.example.com
    path: /app1/*
    service: http://localhost:8080
  - hostname: services.example.com
    path: /app2/*
    service: http://localhost:9090
  - service: http_status:404
```

### Reverse Proxy Integration

```yaml
ingress:
  - hostname: "*.example.com"
    service: http://reverse-proxy-ip:80
  - service: http_status:404
```

## Security Features

### Built-in Protection
- **DDoS Protection** - Cloudflare's network-level protection
- **Web Application Firewall** - Optional WAF rules
- **Access Control** - Cloudflare Access integration
- **SSL/TLS Encryption** - Automatic certificate management

### Access Policies
Configure Cloudflare Access for additional security:
- **Identity Provider Integration** - Google, GitHub, SAML
- **Multi-factor Authentication** - Required for sensitive applications
- **Geographic Restrictions** - Block or allow specific countries
- **IP Allowlisting** - Restrict access to known IP ranges

## Monitoring and Logging

### Tunnel Status
Monitor tunnel health:
```bash
docker logs cloudflared
```

### Cloudflare Analytics
Access detailed analytics in your Cloudflare dashboard:
- **Traffic Patterns** - Request volume and geographic distribution
- **Security Events** - Blocked requests and threats
- **Performance Metrics** - Response times and caching efficiency

## Troubleshooting

### Connection Issues

**Tunnel not connecting:**
```bash
# Check container logs
docker logs cloudflared

# Verify configuration
docker exec cloudflared cat /home/nonroot/.cloudflared/config.yml
```

**DNS not resolving:**
- Verify CNAME records point to correct tunnel UUID
- Check Cloudflare proxy status (orange cloud)
- Allow time for DNS propagation (up to 24 hours)

### Common Error Messages

**"Failed to create tunnel":**
- Check Cloudflare authentication
- Verify domain ownership
- Ensure sufficient account permissions

**"Service unavailable":**
- Verify target service is running
- Check internal network connectivity
- Confirm service ports are correct

### Performance Issues

**Slow response times:**
- Enable Cloudflare caching where appropriate
- Optimize origin server performance
- Consider geographic proximity of Cloudflare edge servers

## Best Practices

### Configuration Management
- **Use descriptive tunnel names** for easy identification
- **Document service mappings** in configuration comments
- **Version control** your configuration files
- **Test changes** in development before production

### Security Hardening
- **Enable Cloudflare Access** for sensitive applications
- **Use strong authentication** for Cloudflare account
- **Regularly rotate** tunnel credentials
- **Monitor access logs** for suspicious activity

### Maintenance
- **Keep cloudflared updated** to latest version
- **Monitor tunnel health** and connectivity
- **Review and update** access policies regularly
- **Backup configuration files** and credentials

## Related Documentation

- [Reverse Proxy Setup](../reverse-proxies/nginx-proxy-manager.md)
- [Security Configuration](../security/authelia.md)
- [VPN Setup](../networking/vpn-setup.md)

For advanced configuration options and enterprise features, consult the official Cloudflare Tunnel documentation.
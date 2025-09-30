---
title: "Tailscale"
sidebar_position: 3
description: "Secure mesh VPN networking with Tailscale on Unraid"
tags: ["networking", "ibracorp"]
source_url: https://docs.ibracorp.io/tailscale/
---

# Tailscale

Secure mesh VPN networking with Tailscale on Unraid

:::info Tailscale Mesh VPN
**Video**
[IBRACORP Tailscale Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Tailscale Official Website](https://tailscale.com/)
- [Tailscale Documentation](https://tailscale.com/kb/)
- [Tailscale Admin Console](https://login.tailscale.com/admin/)

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
| Contributor | Tailscale Team |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Tailscale Mesh VPN Features:**

- Zero-configuration mesh VPN networking
- End-to-end encryption using WireGuard protocol
- Magic DNS for easy device discovery
- Cross-platform support (Windows, macOS, Linux, iOS, Android)
- Subnet routing for entire network access
- Exit node functionality for internet routing
- NAT traversal and firewall bypassing
- Multi-user and team management
- Access control lists and device sharing
- Free tier for personal use (up to 20 devices)

## Prerequisites

**System Requirements:**

- **Unraid Server:** Version 6.9+ recommended
- **Internet Connection:** Stable connection for initial setup
- **Authentication Account:** Google, Microsoft, or GitHub account
- **Devices:** Client devices to connect to the network

**Account Prerequisites:**
- **Tailscale Account:** Free registration at https://tailscale.com/
- **Identity Provider:** Google, Microsoft, or GitHub account for SSO

## Installation

### Unraid Installation

**Tailscale / Community Applications / Networking**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Tailscale**
3. Configure the container settings:
   - **Network Type:** Host (required for proper functionality)
   - **Privileged:** Yes (required for network access)
   - **Config Path:** `/mnt/user/appdata/tailscale`
4. **Configure Environment Variables:**
   - **TS_EXTRA_ARGS:** Additional startup arguments
   - **TS_STATE_DIR:** `/var/lib/tailscale` (default)
5. Click Apply and wait for the container to start

### Docker Compose Installation

```yaml
version: '3.8'
services:
  tailscale:
    image: tailscale/tailscale:latest
    container_name: tailscale
    restart: unless-stopped
    network_mode: host
    privileged: true
    environment:
      - TS_AUTHKEY=tskey-your-auth-key-here
      - TS_EXTRA_ARGS=--advertise-routes=192.168.1.0/24
      - TS_STATE_DIR=/var/lib/tailscale
    volumes:
      - ./tailscale-data:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Generate an auth key from Tailscale admin console
3. Update the `TS_AUTHKEY` environment variable
4. Start the container:
   ```bash
   docker compose up -d
   ```

## Configuration

### Initial Setup and Authentication

**Account Creation:**

1. Visit https://tailscale.com/ and click **"Get started for free"**
2. **Authentication Options:**
   - Google Account
   - Microsoft Account
   - GitHub Account
3. Complete account setup and email verification

**Device Authentication:**

1. **Access Container Console:**
   ```bash
   docker exec -it tailscale tailscale up
   ```

2. **Follow Authentication URL:**
   - Copy the provided URL
   - Open in web browser
   - Complete device authentication
   - Name your device appropriately

3. **Verify Connection:**
   ```bash
   docker exec tailscale tailscale status
   ```

### Basic Network Configuration

**Enable IP Forwarding:**
```bash
# Enable IP forwarding on Unraid
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' >> /etc/sysctl.conf
sysctl -p
```

**Advertise Subnet Routes:**
```bash
# Advertise local subnet to other Tailscale devices
docker exec tailscale tailscale up --advertise-routes=192.168.1.0/24
```

**Configure Exit Node:**
```bash
# Set device as exit node for internet traffic
docker exec tailscale tailscale up --advertise-exit-node
```

### Advanced Configuration

**Custom Startup Arguments:**
```yaml
# Environment variables for Docker
environment:
  - TS_EXTRA_ARGS=--advertise-routes=192.168.1.0/24,10.0.0.0/24 --advertise-exit-node --ssh
```

**Magic DNS Configuration:**
```bash
# Enable Magic DNS (usually enabled by default)
docker exec tailscale tailscale up --accept-dns=true
```

**SSH Server Integration:**
```bash
# Enable Tailscale SSH server
docker exec tailscale tailscale up --ssh
```

## Client Device Setup

### Windows Client

**Installation Steps:**
1. Download Tailscale from https://tailscale.com/download/windows
2. Run installer with administrator privileges
3. Launch Tailscale and sign in with same account
4. Device appears in admin console automatically

**Windows Configuration:**
```powershell
# Enable subnet routing on Windows
tailscale up --accept-routes

# Use specific exit node
tailscale up --exit-node=unraid-server
```

### macOS Client

**Installation Steps:**
1. Download from Mac App Store or https://tailscale.com/download/mac
2. Install and launch application
3. Sign in with Tailscale account
4. Grant necessary permissions for VPN

**macOS Configuration:**
```bash
# Command line configuration
sudo tailscale up --accept-routes --accept-dns

# Check status
tailscale status
```

### Linux Client

**Installation via Package Manager:**
```bash
# Ubuntu/Debian
curl -fsSL https://tailscale.com/install.sh | sh

# CentOS/RHEL
sudo yum install tailscale
sudo systemctl enable --now tailscaled

# Arch Linux
sudo pacman -S tailscale
sudo systemctl enable --now tailscaled
```

**Linux Configuration:**
```bash
# Authenticate device
sudo tailscale up

# Enable subnet routing
sudo tailscale up --accept-routes

# Check connection
tailscale status
```

### Mobile Clients

**iOS Installation:**
1. Install Tailscale from App Store
2. Sign in with account credentials
3. Enable VPN configuration when prompted
4. Device appears in network automatically

**Android Installation:**
1. Install Tailscale from Google Play Store
2. Sign in and grant VPN permissions
3. Configure DNS and routing preferences
4. Enable always-on VPN if desired

## Network Administration

### Admin Console Management

**Accessing Admin Console:**
1. Visit https://login.tailscale.com/admin/
2. Sign in with your account credentials
3. View all connected devices and network status

**Device Management:**
```yaml
device_management:
  device_naming: "Assign descriptive names"
  device_authorization: "Approve new device connections"
  device_expiry: "Manage key expiration settings"
  device_deletion: "Remove unused or compromised devices"
```

### Access Control Lists (ACLs)

**Basic ACL Configuration:**
```json
{
  "tagOwners": {
    "tag:server": ["user@example.com"],
    "tag:client": ["user@example.com"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:client"],
      "dst": ["tag:server:*"]
    },
    {
      "action": "accept",
      "src": ["tag:server"],
      "dst": ["tag:client:22"]
    }
  ]
}
```

**Advanced ACL Rules:**
```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["user@example.com"],
      "dst": ["192.168.1.0/24:*"]
    },
    {
      "action": "accept",
      "src": ["tag:homelab"],
      "dst": ["tag:servers:80,443,22"]
    },
    {
      "action": "deny",
      "src": ["*"],
      "dst": ["tag:sensitive:*"]
    }
  ]
}
```

### Subnet Routing

**Configure Subnet Router:**
```bash
# On Unraid (subnet router)
docker exec tailscale tailscale up \
  --advertise-routes=192.168.1.0/24,192.168.50.0/24 \
  --accept-dns=false

# Enable routes in admin console
# Navigate to admin console → Machines → Enable routes
```

**Client Route Acceptance:**
```bash
# On client devices to accept advertised routes
tailscale up --accept-routes

# Windows PowerShell
tailscale up --accept-routes

# Verify routes
tailscale status
ip route | grep tailscale  # Linux
route print | findstr Tailscale  # Windows
```

### Exit Node Configuration

**Setup Exit Node:**
```bash
# Configure Unraid as exit node
docker exec tailscale tailscale up \
  --advertise-exit-node \
  --advertise-routes=192.168.1.0/24

# Enable in admin console
# Navigate to admin console → Machines → Enable exit node
```

**Use Exit Node:**
```bash
# Route all traffic through exit node
tailscale up --exit-node=unraid-server

# Route only specific traffic
tailscale up --exit-node=unraid-server --exit-node-allow-lan-access

# Disable exit node
tailscale up --exit-node=""
```

## Advanced Features

### Magic DNS

**DNS Configuration:**
```bash
# View current DNS settings
docker exec tailscale tailscale debug dns-cache

# Access devices by name
ping unraid-server
ssh user@desktop-computer
```

**Custom DNS Settings:**
```json
{
  "dns": {
    "nameservers": ["1.1.1.1", "8.8.8.8"],
    "domains": ["internal.company.com"],
    "routes": {
      "company.com": ["10.0.0.1"]
    }
  }
}
```

### MagicDNS and Split DNS

**Split DNS Configuration:**
```bash
# Configure custom DNS for specific domains
tailscale up --accept-dns=false --dns=192.168.1.1

# Use Tailscale DNS only for Tailscale domains
tailscale up --accept-dns=true --dns-routing=true
```

### Device Sharing

**Share Device Access:**
1. Navigate to admin console
2. Select device to share
3. Click **"Share"** button
4. Enter email addresses of users
5. Set permissions and access duration

**Shared Device Management:**
```yaml
sharing_options:
  full_access: "Complete device access"
  limited_ports: "Specific port access only"
  time_limited: "Temporary access with expiration"
  read_only: "View-only access to services"
```

## Monitoring and Troubleshooting

### Network Diagnostics

**Connection Status:**
```bash
# Check Tailscale status
docker exec tailscale tailscale status

# Detailed network information
docker exec tailscale tailscale netcheck

# Debug connectivity
docker exec tailscale tailscale ping target-device

# View logs
docker logs tailscale
```

**Network Testing:**
```bash
# Test connectivity between devices
ping 100.64.0.1  # Tailscale IP
curl http://unraid-server:8080

# Trace network path
traceroute 100.64.0.1
mtr 100.64.0.1  # Linux
```

### Performance Monitoring

**Bandwidth Testing:**
```bash
# Between Tailscale devices
iperf3 -s  # On server
iperf3 -c target-device  # On client

# Monitor connection quality
docker exec tailscale tailscale ping --verbose target-device
```

**Connection Metrics:**
```bash
# View connection details
docker exec tailscale tailscale debug watch-ipn

# Network statistics
docker exec tailscale tailscale debug prefs
docker exec tailscale tailscale debug daemon-logs
```

### Common Issues and Solutions

**Connection Problems:**
```bash
# Restart Tailscale service
docker restart tailscale

# Re-authenticate device
docker exec tailscale tailscale logout
docker exec tailscale tailscale login

# Check firewall settings
# Ensure UDP port 41641 is accessible
```

**DNS Resolution Issues:**
```bash
# Check DNS configuration
docker exec tailscale tailscale debug dns-cache

# Flush DNS cache
# Windows: ipconfig /flushdns
# macOS: sudo dscacheutil -flushcache
# Linux: sudo systemctl restart systemd-resolved
```

**Subnet Routing Problems:**
```bash
# Verify IP forwarding
cat /proc/sys/net/ipv4/ip_forward  # Should return 1

# Check advertised routes
docker exec tailscale tailscale status

# Enable routes in admin console
echo "Check admin console for route approval"
```

## Security Best Practices

### Access Control

**Device Authentication:**
```yaml
security_settings:
  key_expiry: "Regular key rotation (90 days recommended)"
  device_approval: "Manual approval for new devices"
  user_management: "Regular user access review"
  audit_logging: "Enable comprehensive logging"
```

**Network Segmentation:**
```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:admin"],
      "dst": ["*:*"]
    },
    {
      "action": "accept",
      "src": ["tag:user"],
      "dst": ["tag:services:80,443"]
    },
    {
      "action": "deny",
      "src": ["tag:guest"],
      "dst": ["tag:internal:*"]
    }
  ]
}
```

### Key Management

**Authentication Keys:**
```bash
# Generate one-time auth key
# Via admin console: Settings → Keys → Generate auth key

# Use pre-auth key for automated deployment
docker run -d --name tailscale \
  --privileged --network host \
  -e TS_AUTHKEY=tskey-auth-your-key-here \
  tailscale/tailscale:latest
```

**Key Rotation:**
```bash
# Regular key rotation (automated)
docker exec tailscale tailscale up --force-reauth

# Manual key refresh
docker exec tailscale tailscale logout
docker exec tailscale tailscale login
```

## Integration Examples

### Home Lab Integration

**Complete Home Lab Setup:**
```yaml
home_lab_config:
  unraid_server:
    role: "subnet_router_exit_node"
    routes: ["192.168.1.0/24"]
    services: ["web_ui", "docker_containers"]

  workstation:
    role: "client"
    access: ["full_subnet", "exit_node_optional"]

  mobile_devices:
    role: "client"
    access: ["specific_services", "exit_node_when_traveling"]

  remote_site:
    role: "site_to_site"
    routes: ["10.0.0.0/24"]
    connection: "always_on"
```

### Site-to-Site VPN

**Multi-Site Configuration:**
```bash
# Site A (Main office)
docker exec tailscale tailscale up \
  --advertise-routes=192.168.1.0/24 \
  --accept-routes

# Site B (Remote office)
docker exec tailscale tailscale up \
  --advertise-routes=10.0.0.0/24 \
  --accept-routes

# Enable routes in admin console for both sites
```

### Container Network Access

**Docker Integration:**
```yaml
# Access Docker containers via Tailscale
version: '3.8'
services:
  app:
    image: nginx
    container_name: webapp
    networks:
      - tailscale-net
    labels:
      - "tailscale.hostname=webapp"

networks:
  tailscale-net:
    external: true
```

## Backup and Recovery

### Configuration Backup

**Backup Tailscale State:**
```bash
#!/bin/bash
# tailscale-backup.sh

BACKUP_DIR="/backup/tailscale"
STATE_DIR="/mnt/user/appdata/tailscale"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup Tailscale state
tar -czf "$BACKUP_DIR/tailscale-state-$DATE.tar.gz" "$STATE_DIR"

# Export device configuration
docker exec tailscale tailscale debug prefs > "$BACKUP_DIR/tailscale-prefs-$DATE.json"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "tailscale-*-*.tar.gz" -mtime +30 -delete
```

### Disaster Recovery

**Recovery Procedures:**
```bash
# Restore Tailscale configuration
docker stop tailscale
tar -xzf /backup/tailscale/tailscale-state-latest.tar.gz -C /
docker start tailscale

# Re-authenticate if necessary
docker exec tailscale tailscale login

# Verify connectivity
docker exec tailscale tailscale status
```

## Special Thanks

- **Tailscale Team** for providing excellent mesh VPN technology
- **WireGuard Project** for the underlying secure tunneling protocol
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
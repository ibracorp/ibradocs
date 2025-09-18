---
title: "Vaultwarden on Oracle Cloud VPS"
sidebar_position: 1
description: "Complete guide to deploying Vaultwarden password manager on Oracle Cloud's free tier VPS with Cloudflare Argo Tunneling for secure access."
tags: [misc-tools, vaultwarden, oracle-cloud, password-manager, security, ibracorp]
---

# Vaultwarden on Oracle Cloud VPS

Complete guide to deploying Vaultwarden password manager on Oracle Cloud's free tier VPS with Cloudflare Argo Tunneling for secure access.

:::info Vaultwarden Password Manager
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Vaultwarden Repository](https://github.com/dani-garcia/vaultwarden)
- [Oracle Cloud Website](https://cloud.oracle.com/)
- [Cloudflare Argo Tunnels](https://www.cloudflare.com/products/tunnel/)

**Related Videos**
- Password Security Best Practices
- Oracle Cloud Setup
- Cloudflare Configuration
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

**Comprehensive Password Management Solution**

- **Self-Hosted Bitwarden Server** - Open-source alternative to Bitwarden
- **Oracle Cloud Free Tier** - Leverage free VPS hosting
- **Cloudflare Argo Tunneling** - Secure external access without port forwarding
- **Docker Containerization** - Easy deployment and management
- **Web Vault Interface** - Access from any browser
- **Mobile App Support** - iOS and Android compatibility
- **Browser Extensions** - Chrome, Firefox, Safari support
- **Two-Factor Authentication** - Enhanced security options
- **Secure File Attachments** - Store files alongside passwords
- **Organization Support** - Share passwords with teams
- **Import/Export Tools** - Migrate from other password managers
- **API Access** - Programmatic password management

## Prerequisites

**Required Accounts and Tools**

- Oracle Cloud account (free tier available)
- Cloudflare account with domain management
- SSH client (PuTTY for Windows, Terminal for Mac/Linux)
- Basic Linux command line knowledge
- Docker and Docker Compose understanding

## Oracle Cloud VPS Setup

### Create Oracle Cloud Instance

**Instance Configuration**

1. **Sign in to Oracle Cloud**: Visit [cloud.oracle.com](https://cloud.oracle.com)
2. **Create Compute Instance**: Navigate to Compute → Instances
3. **Choose Image**: Select Ubuntu 22.04 LTS
4. **Shape Configuration**:
   ```
   Shape: VM.Standard.A1.Flex (Ampere ARM)
   OCPUs: 4 (maximum for free tier)
   Memory: 24 GB (maximum for free tier)
   ```

5. **Network Configuration**:
   ```
   Virtual Cloud Network: Create new or use existing
   Subnet: Public subnet
   Assign Public IP: Yes
   ```

### SSH Key Generation

**Using PuTTYgen (Windows)**

1. **Download PuTTYgen**: From PuTTY download page
2. **Generate Keys**:
   - Key type: RSA
   - Number of bits: 2048
   - Click "Generate"
   - Move mouse for randomness

3. **Save Keys**:
   - Save public key (.pub file)
   - Save private key (.ppk file)
   - Copy public key text for Oracle Cloud

4. **Add to Oracle Cloud**: Paste public key in SSH Keys section

### Initial Server Configuration

**Connect via SSH**

```bash
# Connect to your Oracle Cloud instance
ssh ubuntu@your-public-ip

# Switch to root user
sudo -i

# Update system packages
apt-get update && apt-get upgrade -y
```

### Install Docker and Docker Compose

**Docker Installation**

```bash
# Install Docker dependencies
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package database
apt-get update

# Install Docker
apt-get install -y docker-ce docker-ce-cli containerd.io

# Enable Docker service
systemctl enable docker
systemctl start docker
```

**Docker Compose Installation**

```bash
# Download Docker Compose for ARM64
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-aarch64" -o /usr/local/bin/docker-compose

# Make executable
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

## Vaultwarden Deployment

### Create Directory Structure

**Setup Project Directories**

```bash
# Navigate to home directory
cd /home/ubuntu/

# Create project structure
mkdir -p containers/vaultwarden
cd containers/vaultwarden

# Create data directory
mkdir data
```

### Docker Compose Configuration

**Create docker-compose.yml**

```yaml
version: '3.8'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    environment:
      # Basic Configuration
      - DOMAIN=https://vault.yourdomain.com
      - WEBSOCKET_ENABLED=true
      - WEBSOCKET_PORT=3012
      - WEBSOCKET_ADDRESS=0.0.0.0

      # Security Settings
      - SIGNUPS_ALLOWED=false
      - SIGNUPS_VERIFY=true
      - SIGNUPS_DOMAINS_WHITELIST=yourdomain.com
      - EMERGENCY_ACCESS_ALLOWED=true
      - SENDS_ALLOWED=true

      # Email Configuration (Optional)
      - SMTP_HOST=smtp.gmail.com
      - SMTP_FROM=your-email@gmail.com
      - SMTP_PORT=587
      - SMTP_SECURITY=starttls
      - SMTP_USERNAME=your-email@gmail.com
      - SMTP_PASSWORD=your-app-password

      # Admin Panel
      - ADMIN_TOKEN=your-secure-admin-token

      # Performance
      - ROCKET_WORKERS=10

    volumes:
      - ./data:/data

    ports:
      - "80:80"
      - "3012:3012"

    networks:
      - vaultwarden

networks:
  vaultwarden:
    driver: bridge
```

### Environment Variables

**Create .env File**

```bash
# Create environment file
nano .env
```

```bash
# Domain Configuration
DOMAIN=https://vault.yourdomain.com

# Admin Configuration
ADMIN_TOKEN=your-very-secure-random-token-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_FROM=your-email@gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-google-app-password

# Security Settings
SIGNUPS_ALLOWED=false
SIGNUPS_DOMAINS_WHITELIST=yourdomain.com
```

### Deploy Vaultwarden

**Start the Service**

```bash
# Deploy Vaultwarden
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f vaultwarden
```

## Cloudflare Argo Tunnel Setup

### Install Cloudflared

**Install Cloudflare Tunnel Client**

```bash
# Download cloudflared for ARM64
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64

# Make executable and move to PATH
chmod +x cloudflared-linux-arm64
mv cloudflared-linux-arm64 /usr/local/bin/cloudflared

# Verify installation
cloudflared --version
```

### Authenticate with Cloudflare

**Login to Cloudflare**

```bash
# Authenticate with Cloudflare
cloudflared tunnel login
```

This will open a browser window to authenticate with your Cloudflare account.

### Create Tunnel

**Setup Tunnel Configuration**

```bash
# Create a new tunnel
cloudflared tunnel create vaultwarden-tunnel

# Note the tunnel UUID from output
# Create tunnel configuration directory
mkdir -p /home/ubuntu/.cloudflared

# Create tunnel configuration
nano /home/ubuntu/.cloudflared/config.yml
```

**Tunnel Configuration (config.yml)**

```yaml
tunnel: vaultwarden-tunnel
credentials-file: /home/ubuntu/.cloudflared/your-tunnel-uuid.json

ingress:
  # Vaultwarden web interface
  - hostname: vault.yourdomain.com
    service: http://localhost:80
    originRequest:
      noTLSVerify: true

  # Vaultwarden websocket
  - hostname: vault.yourdomain.com
    path: /notifications/hub
    service: http://localhost:3012
    originRequest:
      noTLSVerify: true

  # Catch-all rule (required)
  - service: http_status:404
```

### Configure DNS

**Create DNS Records**

```bash
# Create DNS record for your domain
cloudflared tunnel route dns vaultwarden-tunnel vault.yourdomain.com
```

### Install Tunnel as Service

**Create systemd Service**

```bash
# Install tunnel as a service
cloudflared service install

# Start and enable the service
systemctl start cloudflared
systemctl enable cloudflared

# Check service status
systemctl status cloudflared
```

## Initial Vaultwarden Configuration

### Create Admin Account

**First User Setup**

1. **Access Vaultwarden**: Navigate to `https://vault.yourdomain.com`
2. **Create Account**: Click "Create Account"
3. **Fill Details**:
   ```
   Email: your-email@yourdomain.com
   Name: Your Name
   Master Password: Strong, unique password
   ```

4. **Verify Email**: Check email for verification link

### Admin Panel Configuration

**Access Admin Panel**

1. **Navigate**: `https://vault.yourdomain.com/admin`
2. **Enter Admin Token**: Use token from .env file
3. **Configure Settings**:
   - Disable user registrations
   - Configure SMTP settings
   - Set up backup schedules
   - Configure two-factor authentication

### Security Hardening

**Additional Security Measures**

```bash
# Create backup script
nano /home/ubuntu/backup-vaultwarden.sh
```

```bash
#!/bin/bash
# Vaultwarden backup script

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Stop Vaultwarden
cd /home/ubuntu/containers/vaultwarden
docker-compose stop

# Create backup
tar -czf $BACKUP_DIR/vaultwarden_backup_$DATE.tar.gz data/

# Start Vaultwarden
docker-compose start

# Keep only last 30 backups
find $BACKUP_DIR -name "vaultwarden_backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: vaultwarden_backup_$DATE.tar.gz"
```

```bash
# Make backup script executable
chmod +x /home/ubuntu/backup-vaultwarden.sh

# Add to crontab for daily backups
crontab -e
# Add this line:
# 0 2 * * * /home/ubuntu/backup-vaultwarden.sh
```

## Client Configuration

### Browser Extensions

**Install Bitwarden Extensions**

1. **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/bitwarden-free-password-m/nngceckbapebfimnlniiiahkandclblb)
2. **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/bitwarden-password-manager/)
3. **Safari**: [Mac App Store](https://apps.apple.com/us/app/bitwarden/id1352778147)

**Configure Extension**

1. **Open Extension**: Click Bitwarden icon
2. **Settings**: Click gear icon
3. **Server URL**: Enter `https://vault.yourdomain.com`
4. **Login**: Use your Vaultwarden credentials

### Mobile Apps

**iOS and Android Setup**

1. **Download App**: Search "Bitwarden" in app store
2. **Install and Open**: Launch the app
3. **Configure Server**:
   - Tap settings gear
   - Select "Self-hosted"
   - Enter server URL: `https://vault.yourdomain.com`
4. **Login**: Use your credentials

## Maintenance and Monitoring

### Update Vaultwarden

**Regular Updates**

```bash
# Navigate to project directory
cd /home/ubuntu/containers/vaultwarden

# Pull latest image
docker-compose pull

# Recreate container with new image
docker-compose up -d

# Clean up old images
docker image prune -f
```

### Monitor Logs

**Log Management**

```bash
# View real-time logs
docker-compose logs -f vaultwarden

# View last 100 lines
docker-compose logs --tail=100 vaultwarden

# View logs from last hour
docker-compose logs --since 1h vaultwarden
```

### Performance Monitoring

**System Monitoring**

```bash
# Check container resource usage
docker stats vaultwarden

# Check disk usage
df -h

# Check memory usage
free -h

# Check Cloudflare tunnel status
systemctl status cloudflared
```

## Troubleshooting

### Common Issues

**Connection Problems**

1. **Tunnel Not Working**: Check Cloudflare tunnel status:
   ```bash
   systemctl status cloudflared
   journalctl -u cloudflared -f
   ```

2. **Container Not Starting**: Check Docker logs:
   ```bash
   docker-compose logs vaultwarden
   ```

3. **Email Not Working**: Verify SMTP settings in admin panel

**Performance Issues**

1. **Slow Response**: Check system resources:
   ```bash
   htop
   iotop
   ```

2. **High Memory Usage**: Restart container:
   ```bash
   docker-compose restart vaultwarden
   ```

### Recovery Procedures

**Restore from Backup**

```bash
# Stop Vaultwarden
docker-compose stop

# Remove current data
rm -rf data/

# Extract backup
tar -xzf /home/ubuntu/backups/vaultwarden_backup_YYYYMMDD_HHMMSS.tar.gz

# Start Vaultwarden
docker-compose start
```

## Security Best Practices

### Regular Security Tasks

**Monthly Security Checklist**

1. **Update System**: Keep Oracle Cloud VPS updated
2. **Backup Verification**: Test backup restore process
3. **Access Review**: Review user accounts and permissions
4. **Log Analysis**: Check access logs for suspicious activity
5. **SSL Certificate**: Verify Cloudflare SSL is working
6. **Password Audit**: Use Vaultwarden's password audit tools

### Advanced Security

**Additional Hardening**

```bash
# Configure firewall (if needed)
ufw enable
ufw allow ssh
ufw allow from any to any port 80
ufw allow from any to any port 3012

# Disable password authentication
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# Enable fail2ban
apt-get install fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

## Special Thanks

- **Daniel García** for creating and maintaining Vaultwarden
- **Oracle Cloud** for providing free tier VPS hosting
- **Cloudflare** for secure tunnel technology
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
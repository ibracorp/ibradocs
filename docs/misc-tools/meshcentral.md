---
title: "MeshCentral"
sidebar_position: 6
description: "Complete computer management platform for remote desktop, terminal access, and device administration through a web interface."
tags: [misc-tools, remote-access, device-management, administration, ibracorp]
---

# MeshCentral

Complete computer management platform for remote desktop, terminal access, and device administration through a web interface.

:::info Remote Management Platform
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [MeshCentral Website](https://meshcentral.com/)
- [GitHub Repository](https://github.com/Ylianst/MeshCentral)
- [Documentation](https://meshcentral.com/info/)

**Related Videos**
- Remote Desktop Setup
- Device Management
- Security Configuration
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

**Complete Device Management**

- **Remote Desktop** - Full desktop access from web browser
- **Terminal Access** - Command-line interface for servers
- **File Management** - Upload, download, and manage files
- **Multi-Platform Support** - Windows, Linux, macOS, mobile devices
- **Agent-Based Management** - Install agents for permanent access
- **Web-Based Console** - No client software required
- **User Management** - Multi-user support with permissions
- **Device Groups** - Organize devices by function or location
- **Session Recording** - Record remote sessions for compliance
- **Two-Factor Authentication** - Enhanced security options
- **Mobile App** - iOS and Android management apps
- **API Integration** - Automate management tasks

## Installation

### Unraid Installation

**Community Applications Method**

1. **Search**: Look for "MeshCentral" in Community Apps
2. **Install**: Select MeshCentral template
3. **Configure**:
   ```
   Container Name: meshcentral
   WebUI Port: 443 (HTTPS required)
   Domain: mesh.yourdomain.com
   Allow New Accounts: false (recommended)
   ```
4. **Apply**: Start container
5. **Setup Reverse Proxy**: Configure SSL termination

### Docker Compose

```yaml
version: '3.8'
services:
  meshcentral:
    image: typhonragewind/meshcentral:latest
    container_name: meshcentral
    restart: unless-stopped
    ports:
      - "8086:443"
    environment:
      - HOSTNAME=mesh.yourdomain.com
      - REVERSE_PROXY=false
      - REVERSE_PROXY_TLS_PORT=443
      - IFRAME=false
      - ALLOW_NEW_ACCOUNTS=false
      - WEBRTC=false
    volumes:
      - ./meshcentral/data:/opt/meshcentral/meshcentral-data
      - ./meshcentral/user_files:/opt/meshcentral/meshcentral-files
      - ./meshcentral/backup:/opt/meshcentral/meshcentral-backup
    networks:
      - mesh

networks:
  mesh:
    driver: bridge
```

## Configuration

### Initial Setup

**First Admin Account**

1. **Access Interface**: Navigate to `https://mesh.yourdomain.com`
2. **Create Admin**: Register first account (becomes administrator)
3. **Email Verification**: Complete email verification if configured
4. **Disable Registration**: Turn off new account creation in settings

### Device Groups

**Organize Devices**

1. **Create Group**: Click "Add Device Group"
2. **Group Settings**:
   ```
   Name: Office Computers
   Description: Main office workstations
   Features: Desktop, Terminal, Files
   ```
3. **Agent Installation**: Download appropriate agent
4. **Deploy Agent**: Install on target devices

### User Management

**Add Users**

```
User Roles:
- Administrator: Full access to all devices and settings
- User: Access to assigned device groups only
- Guest: Limited read-only access

Permissions:
- Remote Desktop
- Terminal Access
- File Operations
- Chat/Messaging
- Wake-on-LAN
```

## Device Management

### Install Agents

**Agent Deployment**

1. **Download Agent**: From device group page
2. **Installation Methods**:
   ```
   Windows: meshagent.exe
   Linux: meshagent (chmod +x required)
   macOS: meshagent.dmg
   ```
3. **Verification**: Device appears in MeshCentral console

### Remote Access

**Connect to Devices**

```
Remote Desktop:
- Click device → Desktop
- Full screen or windowed mode
- Keyboard and mouse control

Terminal Access:
- Click device → Terminal
- Command-line interface
- Support for various shells

File Management:
- Click device → Files
- Upload/download files
- Directory navigation
```

## Security

### SSL Configuration

**HTTPS Setup**

```yaml
# With reverse proxy
environment:
  - REVERSE_PROXY=true
  - REVERSE_PROXY_TLS_PORT=443
  - HOSTNAME=mesh.yourdomain.com
```

### Two-Factor Authentication

**Enable 2FA**

1. **User Settings**: Access account settings
2. **Security**: Enable two-factor authentication
3. **Authenticator App**: Use Google Authenticator or similar
4. **Backup Codes**: Save recovery codes

### Access Control

**Security Best Practices**

```
Network Security:
- Use HTTPS only
- Implement firewall rules
- VPN access for external connections

Account Security:
- Strong passwords
- Regular password changes
- Enable 2FA for all users
- Audit user permissions

Device Security:
- Regular agent updates
- Monitor connection logs
- Use device groups for isolation
```

## Integration

### Reverse Proxy Setup

**Nginx Configuration**

```nginx
server {
    listen 443 ssl;
    server_name mesh.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass https://localhost:8086;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Authelia Integration

**Enhanced Authentication**

```yaml
# Authelia configuration
access_control:
  rules:
    - domain: mesh.yourdomain.com
      policy: two_factor
      subject: "group:admin"
```

## Troubleshooting

### Common Issues

**Agent Connection Problems**

1. **Firewall**: Check firewall rules
2. **Network**: Verify network connectivity
3. **Certificate**: Ensure SSL certificate is valid

**Performance Issues**

```
Optimization:
- Increase container memory
- Use SSD storage for data
- Optimize network bandwidth
- Close unused sessions
```

**Web Interface Issues**

1. **Browser Compatibility**: Use modern browsers
2. **SSL Errors**: Check certificate configuration
3. **Connection Timeouts**: Adjust proxy settings

## Special Thanks

- **Ylian Saint-Hilaire** for creating and maintaining MeshCentral
- **MeshCentral Community** for ongoing development and support
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

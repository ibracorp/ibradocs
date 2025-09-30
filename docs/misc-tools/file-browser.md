---
title: "File Browser"
sidebar_position: 4
description: "Web-based file management interface for uploading, downloading, and managing files with user access control and sharing capabilities."
tags: [misc-tools, file-management, web-interface, sharing, ibracorp]
---

# File Browser

Web-based file management interface for uploading, downloading, and managing files with user access control and sharing capabilities.

:::info File Management Interface
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [File Browser Website](https://filebrowser.org/)
- [GitHub Repository](https://github.com/filebrowser/filebrowser)
- [Documentation](https://filebrowser.org/installation)

**Related Videos**
- Web File Management
- User Access Control
- File Sharing Solutions
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

**Comprehensive File Management**

- **Web-Based Interface** - Access files from any browser
- **File Operations** - Upload, download, rename, delete, move
- **Directory Management** - Create, organize, and navigate folders
- **File Preview** - View images, videos, and documents
- **Text Editor** - Edit text files directly in browser
- **User Management** - Multi-user support with permissions
- **File Sharing** - Create temporary download links
- **Search Functionality** - Find files and folders quickly
- **Bulk Operations** - Select and manage multiple files
- **Mobile Responsive** - Works on phones and tablets
- **Custom Branding** - Customize appearance and logo
- **Plugin Support** - Extend functionality with addons

## Installation

### Unraid Installation

**Community Applications Method**

1. **Navigate to Apps**: Go to Community Applications in Unraid
2. **Search**: Type "File Browser"
3. **Install**: Select File Browser from available templates
4. **Configure Settings**:
   ```
   Container Name: filebrowser
   Network Type: Bridge (or custom network)
   WebUI Port: 8080 (change if needed)
   Root Directory: /mnt/user (or specific path)
   Database Path: /config/filebrowser.db
   ```
5. **Apply**: Click Apply and wait for container to start
6. **Access WebUI**: Click WebUI button in Docker tab

### Docker Installation

**Docker Run Command**

```bash
docker run -d \
  --name=filebrowser \
  -p 8080:80 \
  -v /path/to/files:/srv:rw \
  -v /path/to/database:/database \
  -v /path/to/config:/config \
  -e PUID=1000 \
  -e PGID=1000 \
  --restart unless-stopped \
  filebrowser/filebrowser:s6
```

### Docker Compose

**Complete Configuration**

```yaml
version: '3.8'

services:
  filebrowser:
    image: filebrowser/filebrowser:s6
    container_name: filebrowser
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - /mnt/user:/srv:rw
      - ./filebrowser/database:/database
      - ./filebrowser/config:/config
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.filebrowser.rule=Host(`files.yourdomain.com`)"
      - "traefik.http.routers.filebrowser.entrypoints=https"
      - "traefik.http.routers.filebrowser.tls=true"
      - "traefik.http.services.filebrowser.loadbalancer.server.port=80"
    networks:
      - web

networks:
  web:
    external: true
```

## Initial Setup

### First Login

**Default Credentials**

```
Username: admin
Password: admin
```

**⚠️ Important**: Change default password immediately after first login!

### Basic Configuration

**Initial Setup Steps**

1. **Access Interface**: Navigate to `http://your-server-ip:8080`
2. **Login**: Use default credentials
3. **Change Password**:
   - Click profile icon (top right)
   - Select "Settings"
   - Update password under "Change Password"
4. **Configure Settings**: Adjust interface preferences

## User Management

### Create Users

**Add New Users**

1. **Access Users**: Click "Settings" → "Users"
2. **Add User**: Click "New" button
3. **User Configuration**:
   ```
   Username: john_doe
   Password: secure_password
   Scope: /srv/john (user's directory)
   Locale: en
   Role: User or Admin
   ```
4. **Permissions**: Set file and admin permissions
5. **Save**: Create the user account

### User Permissions

**Permission Settings**

```
File Permissions:
- Create: Allow file/folder creation
- Read: Allow file viewing and downloading
- Update: Allow file modification
- Delete: Allow file/folder deletion
- Share: Allow creating share links
- Download: Allow file downloads

Admin Permissions:
- Admin: Full administrative access
- Execute: Run executable files
- Modify: Change file permissions
```

### User Roles

**Role-Based Access**

```
Administrator:
- Full system access
- User management
- Global settings
- All file operations

Editor:
- File management within scope
- Limited settings access
- No user management

Viewer:
- Read-only access
- Download permissions
- No modification rights
```

## File Operations

### Basic File Management

**Common Operations**

```
Upload Files:
- Drag and drop files
- Click upload button
- Bulk upload support

Download Files:
- Single file download
- Multiple file selection
- Folder download as ZIP

File Actions:
- Rename: F2 or right-click
- Delete: Delete key or right-click
- Move: Drag and drop
- Copy: Ctrl+C, Ctrl+V
```

### File Editing

**Built-in Editor**

1. **Open File**: Click on text file
2. **Edit Mode**: Click "Edit" button
3. **Supported Formats**:
   ```
   Text Files: .txt, .md, .json, .xml
   Configuration: .conf, .ini, .yaml, .yml
   Code Files: .js, .py, .html, .css
   ```
4. **Save Changes**: Ctrl+S or click Save

### File Preview

**Preview Support**

```
Images: JPG, PNG, GIF, SVG, WebP
Videos: MP4, WebM, OGG
Audio: MP3, WAV, OGG
Documents: PDF (basic viewer)
Text: All text-based files
```

## Sharing Features

### Create Shares

**Temporary File Sharing**

1. **Select File**: Right-click on file/folder
2. **Share**: Click "Share" option
3. **Configure Share**:
   ```
   Expires: Set expiration time
   Password: Optional password protection
   Allow editing: Permit modifications
   ```
4. **Generate Link**: Copy shareable URL

### Share Management

**Share Settings**

```
Expiration Options:
- 1 hour
- 1 day
- 1 week
- 1 month
- Custom duration
- Never expire

Security Options:
- Password protection
- Download limit
- IP restriction
- Access logging
```

### QR Code Sharing

**Mobile Access**

1. **Create Share**: Generate share link
2. **QR Code**: Automatically generated
3. **Mobile Scan**: Use phone camera to scan
4. **Instant Access**: Direct file download

## Customization

### Branding

**Custom Appearance**

1. **Settings**: Access global settings
2. **Branding**: Configure custom branding
3. **Options**:
   ```
   Instance Name: Your Organization
   Logo: Upload custom logo
   Theme: Light or Dark mode
   Color Scheme: Custom colors
   ```

### Interface Settings

**User Interface**

```
Language: Multiple language support
Date Format: Customize date display
File View: List or grid view
Hidden Files: Show/hide dot files
Default Sort: Name, date, size
```

## Advanced Configuration

### Custom Settings

**Configuration File**

```json
{
  "port": 80,
  "baseURL": "",
  "address": "",
  "log": "stdout",
  "database": "/database/filebrowser.db",
  "root": "/srv",
  "noauth": false,
  "signup": false,
  "commands": {
    "after_upload": ["echo", "File uploaded"],
    "before_delete": ["echo", "Deleting file"]
  }
}
```

### Command Hooks

**Automated Actions**

```bash
# Example: Auto-scan media after upload
after_upload:
  - /scripts/scan_media.sh
  - notify-send "File uploaded"

# Example: Backup before delete
before_delete:
  - /scripts/backup_file.sh
  - echo "File backed up"
```

### Reverse Proxy Setup

**Nginx Configuration**

```nginx
server {
    listen 80;
    server_name files.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # File upload size limit
        client_max_body_size 500M;
    }
}
```

## Security

### Access Control

**Security Best Practices**

```
Strong Passwords:
- Enforce password complexity
- Regular password changes
- Unique passwords per user

Network Security:
- Use HTTPS with SSL certificates
- Restrict network access
- VPN access for external users

File Permissions:
- Principle of least privilege
- Regular permission audits
- Scope users to specific directories
```

### SSL/TLS Setup

**HTTPS Configuration**

```yaml
# Docker Compose with Traefik
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.filebrowser.rule=Host(`files.yourdomain.com`)"
  - "traefik.http.routers.filebrowser.tls=true"
  - "traefik.http.routers.filebrowser.tls.certresolver=letsencrypt"
```

## Troubleshooting

### Common Issues

**Permission Problems**

```bash
# Fix file permissions
sudo chown -R 1000:1000 /path/to/files
sudo chmod -R 755 /path/to/files

# Fix database permissions
sudo chown -R 1000:1000 /path/to/database
```

**Upload Issues**

1. **File Size Limits**: Check container memory limits
2. **Disk Space**: Verify available storage
3. **Network Timeout**: Adjust proxy timeout settings

**Database Issues**

```bash
# Reset database (loses users and settings)
rm /path/to/database/filebrowser.db

# Backup database
cp /path/to/database/filebrowser.db /backup/location/
```

## Best Practices

### Organization

**File Structure**

```
/srv/
├── public/          # Shared files
├── users/           # User directories
│   ├── john/
│   ├── jane/
│   └── admin/
├── uploads/         # Temporary uploads
└── shared/          # Team folders
```

### Backup Strategy

**Data Protection**

```bash
#!/bin/bash
# Backup script
DATE=$(date +%Y%m%d)

# Backup database
cp /path/to/database/filebrowser.db /backup/filebrowser_${DATE}.db

# Backup configuration
tar -czf /backup/filebrowser_config_${DATE}.tar.gz /path/to/config/
```

## Special Thanks

- **File Browser Development Team** for creating this excellent file management solution
- **Community Contributors** for ongoing development and support
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
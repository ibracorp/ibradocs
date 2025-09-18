# File Browser

File Browser is a web-based file manager that provides a clean interface for managing files and folders on your server. It's particularly useful for managing files in Docker containers and remote servers through a web interface.

## Overview

File Browser offers:
- **Web-based Interface** - Access files from any browser
- **User Management** - Multi-user support with permissions
- **File Operations** - Upload, download, edit, and organize files
- **Preview Support** - View images, videos, and documents
- **Command Execution** - Run shell commands from the interface

## Key Features

### File Management
- **Upload/Download** - Drag and drop file uploads
- **File Editing** - Built-in text editor for code and configuration files
- **Archive Support** - Create and extract ZIP archives
- **Search Functionality** - Find files and folders quickly
- **Bulk Operations** - Select and manage multiple files

### Access Control
- **User Accounts** - Create multiple users with different permissions
- **Permission System** - Fine-grained access control
- **Scope Limitation** - Restrict users to specific directories
- **Share Links** - Generate temporary download links

## Installation

### Docker Installation

```bash
# Create directory for File Browser
mkdir -p /opt/filebrowser/{config,data}

# Docker run command
docker run -d \
  --name filebrowser \
  -p 8080:80 \
  -v /opt/filebrowser/data:/srv \
  -v /opt/filebrowser/config:/config \
  -v /opt/filebrowser/database.db:/database.db \
  filebrowser/filebrowser:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    container_name: filebrowser
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - /path/to/files:/srv
      - ./filebrowser/config:/config
      - ./filebrowser/database.db:/database.db
    environment:
      - FB_DATABASE=/database.db
      - FB_CONFIG=/config/settings.json
```

### Unraid Installation

1. Open **Community Applications**
2. Search for "File Browser"
3. Configure container settings:
   - **WebUI Port**: 8080
   - **Volume Mappings**: Map directories you want to access
   - **User/Group**: Set appropriate PUID/PGID

## Configuration

### Initial Setup

1. Access the web interface at `http://serverip:8080`
2. Login with default credentials:
   - **Username**: admin
   - **Password**: admin
3. Change the default password immediately
4. Configure users and permissions as needed

### Settings Configuration

Create `/config/settings.json`:

```json
{
  "port": 80,
  "baseURL": "",
  "address": "",
  "log": "stdout",
  "database": "/database.db",
  "root": "/srv",
  "username": "admin",
  "password": "",
  "signup": false,
  "createUserDir": false,
  "defaults": {
    "scope": ".",
    "locale": "en",
    "viewMode": "list",
    "singleClick": false,
    "sorting": {
      "by": "name",
      "asc": true
    },
    "perm": {
      "admin": false,
      "execute": true,
      "create": true,
      "rename": true,
      "modify": true,
      "delete": true,
      "share": true,
      "download": true
    }
  }
}
```

### User Management

#### Creating Users

1. Navigate to **Settings** > **User Management**
2. Click **New User**
3. Configure user settings:
   - **Username/Password**
   - **Scope** (directory access)
   - **Permissions** (what they can do)

#### Permission Levels

```json
{
  "admin": false,        // Admin privileges
  "execute": true,       // Run commands
  "create": true,        // Create files/folders
  "rename": true,        // Rename items
  "modify": true,        // Edit files
  "delete": true,        // Delete items
  "share": true,         // Create share links
  "download": true       // Download files
}
```

## Usage Examples

### Media Server File Management

```yaml
version: '3.8'
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    container_name: media-filebrowser
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - /mnt/media:/srv/media
      - /mnt/downloads:/srv/downloads
      - ./filebrowser:/config
    environment:
      - FB_BASEURL=/files
```

### Development Environment

```yaml
version: '3.8'
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    container_name: dev-filebrowser
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - /home/user/projects:/srv/projects
      - /var/log:/srv/logs:ro
      - ./filebrowser:/config
```

## Advanced Features

### Command Execution

Enable command execution in settings:

```json
{
  "commands": {
    "after_upload": ["echo 'File uploaded'"],
    "before_delete": ["echo 'Deleting file'"]
  }
}
```

### Custom Branding

```json
{
  "branding": {
    "name": "My Files",
    "disableExternal": true,
    "files": "/config/branding"
  }
}
```

### Plugin Support

File Browser supports plugins for extended functionality:
- **Preview Plugins** - Additional file type support
- **Editor Plugins** - Enhanced editing capabilities
- **Authentication Plugins** - LDAP, OAuth integration

## Security Considerations

### Authentication

- **Change Default Credentials** immediately
- **Use Strong Passwords** for all accounts
- **Enable 2FA** if available
- **Regular Password Updates**

### Access Control

```json
{
  "defaults": {
    "scope": "/restricted",
    "perm": {
      "admin": false,
      "execute": false,
      "create": true,
      "rename": false,
      "modify": true,
      "delete": false,
      "share": false,
      "download": true
    }
  }
}
```

### Network Security

- **Use HTTPS** in production
- **Firewall Rules** to restrict access
- **VPN Access** for remote connections
- **Regular Updates** for security patches

## Integration Examples

### With Reverse Proxy

```nginx
location /files {
    proxy_pass http://filebrowser:80;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### With Authentication

```yaml
version: '3.8'
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    depends_on:
      - authelia
    labels:
      - "traefik.http.middlewares.auth.forwardauth.address=http://authelia:9091/api/verify?rd=https://auth.domain.com/"
```

## Troubleshooting

### Common Issues

**Permission Problems:**
```bash
# Check container user
docker exec filebrowser id

# Fix file permissions
chown -R 1000:1000 /path/to/files
```

**Database Issues:**
```bash
# Reset database
rm /path/to/database.db
docker restart filebrowser
```

**Upload Failures:**
- Check disk space
- Verify file permissions
- Review size limits in configuration

### Performance Optimization

**Large File Handling:**
```json
{
  "defaults": {
    "singleClick": true,
    "viewMode": "mosaic"
  }
}
```

**Memory Usage:**
- Monitor container resource usage
- Adjust Docker memory limits if needed
- Use file indexing sparingly for large directories

## Best Practices

### Organization
- **Logical Structure** - Organize files in clear directory hierarchies
- **Naming Conventions** - Use consistent file and folder naming
- **Regular Cleanup** - Remove unnecessary files periodically
- **Backup Strategy** - Implement regular backups for important data

### Maintenance
- **Regular Updates** - Keep File Browser updated
- **Log Monitoring** - Check logs for errors and issues
- **User Auditing** - Review user access and permissions regularly
- **Database Backup** - Backup user database and settings

### Performance
- **Resource Monitoring** - Track CPU and memory usage
- **Network Optimization** - Use appropriate network settings
- **Cache Management** - Configure caching for better performance
- **Index Optimization** - Optimize file indexing for large directories

## Related Documentation

- [Docker Compose Guide](../tools/docker-compose.md)
- [Reverse Proxy Setup](../reverse-proxies/nginx-proxy-manager.md)
- [Security Configuration](../security/authelia.md)
- [Network Management](../networking/vpn-setup.md)

File Browser provides an essential web-based interface for file management in containerized and remote environments. Its flexibility and extensive configuration options make it suitable for both personal and enterprise use cases.
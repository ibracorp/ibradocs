---
title: "PWM"
sidebar_position: 4
description: "Open-source password self-service application for LDAP directories that enables users to change their passwords and manage their accounts."
tags: [security, password-management, ldap, self-service, ibracorp]
---

# PWM

Open-source password self-service application for LDAP directories that enables users to change their passwords and manage their accounts.

:::info PWM Password Self-Service
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Official Documentation](https://github.com/pwm-project/pwm/wiki)
- [GitHub Repository](https://github.com/pwm-project/pwm)
- [PWM Project Website](https://www.pwm-project.org/)

**Related Videos**
- FreeIPA Server Setup
- LDAP Authentication Configuration
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

**Comprehensive Password Self-Service Features**

- **Password Change** interface for LDAP users
- **Password Reset** with email verification
- **Account Unlock** functionality
- **Password Policy Enforcement** with complexity requirements
- **Multi-language Support** for international deployments
- **Email Notifications** for password changes and resets
- **Audit Logging** for compliance and security monitoring
- **LDAP Integration** with Active Directory, FreeIPA, OpenLDAP
- **Token-based Authentication** for secure password resets
- **Challenge/Response Questions** for account verification
- **Password Expiration Notifications** via email
- **Self-Registration** for new user accounts
- **Administrator Interface** for user management
- **REST API** for integration with other systems
- **Customizable UI** with themes and branding options

## Prerequisites

**Required Components**

- LDAP directory server (FreeIPA, Active Directory, OpenLDAP)
- MariaDB or MySQL database
- Java application server environment
- SMTP server for email notifications
- SSL certificate for secure connections
- Administrative access to LDAP directory

## Installation

### Unraid Installation

**PWM from Sycotix's Repository**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **PWM** from **Sycotix's Repository**
3. Configure the following settings:
   - **Network Type**: Select your custom Docker network if using one
   - **WebUI Port**: Default is 8080 (change if port is in use)
   - **Database Settings**: Configure MariaDB connection
   - **Time Zone**: Set your local time zone
4. Click Apply and wait for the container to pull down and start
5. In your Docker tab in Unraid, left-click the **PWM** container and select 'WebUI'

### Docker Compose

**PWM with MariaDB Database**

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  pwm:
    image: fjudith/pwm:latest
    container_name: pwm
    restart: unless-stopped
    environment:
      - TZ=America/New_York
    volumes:
      - /opt/appdata/pwm/config:/config
      - /opt/appdata/pwm/logs:/usr/share/pwm/logs
    labels:
      - traefik.enable=true
      - traefik.http.routers.pwm.rule=Host(`pwm.yourdomain.com`)
      - traefik.http.routers.pwm.entrypoints=https
      - traefik.http.routers.pwm.tls=true
      - traefik.http.routers.pwm.tls.certresolver=cloudflare
      - traefik.http.services.pwm.loadbalancer.server.port=8080
    networks:
      - proxy
      - pwm
    depends_on:
      - mariadb

  mariadb:
    image: linuxserver/mariadb:latest
    container_name: pwm-mariadb
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=YOUR_ROOT_PASSWORD
      - MYSQL_DATABASE=pwm
      - MYSQL_USER=pwm
      - MYSQL_PASSWORD=YOUR_PWM_PASSWORD
      - TZ=America/New_York
    volumes:
      - /opt/appdata/pwm/mariadb:/config
    networks:
      - pwm

networks:
  proxy:
    external: true
  pwm:
    driver: bridge
```

**Installation Steps**

1. Create the directory structure:
   ```bash
   mkdir -p /opt/appdata/pwm/{config,logs,mariadb}
   ```

2. Generate secure database passwords:
   ```bash
   ROOT_PASSWORD=$(openssl rand -base64 32)
   PWM_PASSWORD=$(openssl rand -base64 32)
   ```

3. Update the docker-compose.yml with your passwords and domain

4. Start the services:
   ```bash
   docker compose up -d
   ```

5. Check container logs:
   ```bash
   docker compose logs pwm
   ```

## Database Setup

### MariaDB Configuration

**Create PWM Database**

1. Access the MariaDB container:
   ```bash
   docker exec -it pwm-mariadb mysql -u root -p
   ```

2. Create the PWM database and user:
   ```sql
   CREATE DATABASE pwm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'pwm'@'%' IDENTIFIED BY 'YOUR_PWM_PASSWORD';
   GRANT ALL PRIVILEGES ON pwm.* TO 'pwm'@'%';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. Download MySQL Connector/J:
   ```bash
   # Download the MySQL connector
   wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-8.0.33.tar.gz
   tar -xzf mysql-connector-java-8.0.33.tar.gz

   # Copy the JAR file to PWM lib directory
   cp mysql-connector-java-8.0.33/mysql-connector-java-8.0.33.jar /opt/appdata/pwm/config/lib/
   ```

## Configuration

### Initial Setup

1. **Access PWM**: Navigate to `https://pwm.yourdomain.com`

2. **Configuration Mode**: Select "Manual Configuration" for first-time setup

3. **Set Configuration Password**: Create a strong password for configuration access

4. **Basic Settings**: Configure the following core settings:
   - Application Name: Your Organization Name
   - Site URL: https://pwm.yourdomain.com
   - Configuration Password Policy

### LDAP Configuration

**Configure LDAP Connection**

1. Navigate to **LDAP** → **LDAP Directories**

2. **LDAP Profile Configuration**:
   ```
   LDAP URLs: ldaps://your-freeipa-server.domain.com:636
   LDAP Vendor: Red Hat Directory Server
   Proxy User DN: uid=pwm-service,cn=sysaccounts,cn=etc,dc=yourdomain,dc=com
   Proxy User Password: YOUR_SERVICE_ACCOUNT_PASSWORD
   ```

3. **User Search Settings**:
   ```
   User Context: cn=users,cn=accounts,dc=yourdomain,dc=com
   User Search Filter: (uid={0})
   Username Attribute: uid
   ```

4. **Test LDAP Connection**: Use the built-in test function to verify connectivity

### Database Storage Configuration

**Configure Database Storage**

1. Navigate to **Database** → **Database Storage**

2. **Database Settings**:
   ```
   Database Class: com.mysql.cj.jdbc.Driver
   Database URL: jdbc:mysql://mariadb:3306/pwm?useSSL=false&serverTimezone=UTC
   Database Username: pwm
   Database Password: YOUR_PWM_PASSWORD
   ```

3. **Initialize Database**: PWM will automatically create required tables

### Email Configuration

**SMTP Settings**

1. Navigate to **Email** → **SMTP Servers**

2. **Configure SMTP**:
   ```
   SMTP Server: smtp.gmail.com
   SMTP Port: 587
   Security Method: TLS
   Username: your-email@gmail.com
   Password: your-app-password
   From Address: noreply@yourdomain.com
   ```

3. **Test Email**: Send a test email to verify configuration

### Password Policy Configuration

**Define Password Requirements**

1. Navigate to **Password Policy** → **Password Rules**

2. **Configure Rules**:
   ```
   Minimum Length: 8 characters
   Maximum Length: 64 characters
   Minimum Alphabetic: 1
   Minimum Numeric: 1
   Minimum Special: 1
   Disallow Username: Yes
   Disallow Common Passwords: Yes
   ```

3. **Password History**: Set number of previous passwords to remember

### User Interface Customization

**Branding and Themes**

1. Navigate to **Display** → **Customization**

2. **Custom Settings**:
   - Logo URL: Upload your organization logo
   - Custom CSS: Add custom styling
   - Custom Text: Modify default messages
   - Color Scheme: Adjust interface colors

3. **Localization**: Configure language settings for your users

## Advanced Configuration

### Challenge/Response Questions

**Security Questions Setup**

1. Navigate to **Forgotten Password** → **Challenge/Response**

2. **Configure Questions**:
   - Minimum Required Questions: 3
   - Maximum Required Questions: 5
   - Allow User Defined Questions: Yes
   - Require Unique Responses: Yes

3. **Pre-defined Questions**: Add organization-specific security questions

### Account Unlock Configuration

**Self-Service Account Unlock**

1. Navigate to **Account Unlock** → **General**

2. **Unlock Settings**:
   - Enable Account Unlock: Yes
   - Unlock Method: Email Token
   - Token Lifetime: 15 minutes
   - Maximum Unlock Attempts: 3

### Audit and Logging

**Configure Audit Logging**

1. Navigate to **Audit** → **Audit Settings**

2. **Logging Configuration**:
   ```
   Audit Level: INFO
   Max Events: 10000
   Database Storage: Yes
   Syslog Output: Optional
   ```

3. **Event Types**: Select which events to log (login, password change, etc.)

### REST API Configuration

**Enable API Access**

1. Navigate to **Web Services** → **REST Services**

2. **API Settings**:
   - Enable REST Services: Yes
   - Require Authentication: Yes
   - CORS Settings: Configure for your domain

3. **Generate API Keys**: Create keys for external integrations

## User Management

### User Registration

**Self-Registration Process**

1. Configure registration form fields
2. Set approval workflow (manual/automatic)
3. Define email verification process
4. Configure account activation settings

### Password Reset Process

**Standard Reset Workflow**

1. User enters username/email
2. System validates user exists in LDAP
3. Email token sent to user
4. User completes challenge/response questions
5. New password set and synchronized to LDAP

### Administrative Functions

**Admin Panel Features**

- View user activity and statistics
- Generate compliance reports
- Manage user accounts and passwords
- Configure system-wide settings
- Monitor system health and performance

## Monitoring and Maintenance

### Health Monitoring

**System Health Checks**

```bash
# Check PWM container logs
docker logs pwm

# Monitor database connections
docker exec pwm-mariadb mysql -u pwm -p -e "SHOW PROCESSLIST;"

# Check LDAP connectivity
docker exec pwm curl -k https://your-freeipa-server:636
```

### Performance Optimization

**Optimization Settings**

1. **Database Tuning**: Optimize MariaDB configuration for PWM workload
2. **LDAP Connection Pooling**: Configure connection pool settings
3. **Caching**: Enable appropriate caching for better performance
4. **Resource Limits**: Set appropriate memory and CPU limits

### Backup and Recovery

**Backup Procedures**

```bash
# Backup PWM configuration
tar -czf pwm-config-backup.tar.gz /opt/appdata/pwm/config/

# Backup database
docker exec pwm-mariadb mysqldump -u root -p pwm > pwm-database-backup.sql
```

## Troubleshooting

**Common Issues**

1. **LDAP Connection Failures**: Check certificates and network connectivity
2. **Database Connection Errors**: Verify MySQL connector installation
3. **Email Delivery Issues**: Check SMTP settings and firewall rules
4. **Password Policy Conflicts**: Ensure PWM and LDAP policies align

**Debug Mode**

Enable debug logging in PWM configuration:
```
Log Level: TRACE
Log Pattern: Include timestamp and thread information
```

## Special Thanks

- **PWM Project Team** for maintaining this excellent password self-service solution
- **Jason D. Rivard** and contributors for their dedication to the PWM project
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
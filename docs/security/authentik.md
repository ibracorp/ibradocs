---
title: "Authentik"
sidebar_position: 2
description: "Open-source Identity Provider focused on flexibility and versatility that can add support for new protocols in existing environments."
tags: [security, authentication, identity, sso, oauth, ibracorp]
---

# Authentik

Open-source Identity Provider focused on flexibility and versatility that can add support for new protocols in existing environments.

:::info Authentik Identity Provider
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Official Documentation](https://goauthentik.io/docs/)
- [Main Website](https://goauthentik.io/)
- [GitHub Repository](https://github.com/goauthentik/authentik)

**Related Videos**
- Traefik Forward Auth Setup
- NPM Forward Auth Configuration
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

**Comprehensive Identity Management Features**

- **Modern Identity Provider** with OAuth2, SAML, and LDAP support
- **Flexible Authentication Flows** with custom policies
- **Multi-Factor Authentication** (TOTP, WebAuthn, SMS)
- **User Self-Service Portal** for password resets and profile management
- **Application Proxy** for legacy applications
- **LDAP Provider** for applications requiring LDAP authentication
- **RADIUS Provider** for network device authentication
- **Forward Auth Integration** with reverse proxies
- **Policy Engine** for complex access control rules
- **Branded Login Pages** with custom themes
- **API-First Design** for automation and integration
- **High Availability** cluster support

## Prerequisites

**Required Components**

- Docker and Docker Compose installed
- PostgreSQL database
- Redis for caching and message queuing
- Reverse proxy (Traefik or nginx recommended)
- External network named "proxy" created
- Domain name with SSL certificate
- SMTP server for email notifications

## Installation

### Docker Compose

**Generate Required Secrets**

1. Install password generator:
   ```bash
   sudo apt-get install -y pwgen
   ```

2. Create environment file:
   ```bash
   # Generate secure passwords and keys
   echo "PG_PASS=$(pwgen -s 40 1)" >> .env
   echo "AUTHENTIK_SECRET_KEY=$(pwgen -s 50 1)" >> .env
   echo "AUTHENTIK_ERROR_REPORTING__ENABLED=true" >> .env
   echo "PG_USER=authentik" >> .env
   echo "PG_DB=authentik" >> .env
   ```

**Docker Compose Configuration**

Create `docker-compose.yml`:

```yaml
version: '3.4'

services:
  postgresql:
    image: postgres:12-alpine
    restart: unless-stopped
    container_name: authentik-postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 5s
    volumes:
      - database:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${PG_PASS}
      - POSTGRES_USER=${PG_USER:-authentik}
      - POSTGRES_DB=${PG_DB:-authentik}
    env_file:
      - .env
    networks:
      - proxy

  redis:
    image: redis:alpine
    restart: unless-stopped
    container_name: authentik-redis
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping | grep PONG"]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 3s
    networks:
      - proxy

  server:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2023.10.6}
    restart: unless-stopped
    container_name: authentik-server
    command: server
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
    volumes:
      - /opt/appdata/authentik/media:/media
      - /opt/appdata/authentik/custom-templates:/templates
    env_file:
      - .env
    labels:
      - traefik.enable=true
      - traefik.http.routers.authentik.rule=Host(`auth.yourdomain.com`)
      - traefik.http.routers.authentik.entrypoints=https
      - traefik.http.routers.authentik.tls=true
      - traefik.http.routers.authentik.tls.certresolver=cloudflare
      - traefik.http.services.authentik.loadbalancer.server.port=9000
      # Forward Auth Middleware
      - traefik.http.middlewares.authentik.forwardauth.address=http://authentik-server:9000/outpost.goauthentik.io/auth/traefik
      - traefik.http.middlewares.authentik.forwardauth.trustForwardHeader=true
      - traefik.http.middlewares.authentik.forwardauth.authResponseHeaders=X-authentik-username,X-authentik-groups,X-authentik-email,X-authentik-name,X-authentik-uid
    networks:
      - proxy
    depends_on:
      - postgresql
      - redis

  worker:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2023.10.6}
    restart: unless-stopped
    container_name: authentik-worker
    command: worker
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
    user: root
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /opt/appdata/authentik/media:/media
      - /opt/appdata/authentik/certs:/certs
      - /opt/appdata/authentik/custom-templates:/templates
    env_file:
      - .env
    networks:
      - proxy
    depends_on:
      - postgresql
      - redis

volumes:
  database:
    driver: local

networks:
  proxy:
    external: true
```

**Installation Steps**

1. Create the directory structure:
   ```bash
   mkdir -p /opt/appdata/authentik/{media,custom-templates,certs}
   ```

2. Create the environment file with your domain:
   ```bash
   echo "AUTHENTIK_DOMAIN=yourdomain.com" >> .env
   ```

3. Start the services:
   ```bash
   docker compose up -d
   ```

4. Check the logs:
   ```bash
   docker compose logs -f server
   ```

5. Wait for initial setup to complete (this may take a few minutes)

### Unraid Installation

**Authentik from Sycotix's Repository**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Authentik** from **Sycotix's Repository**
3. Configure the following settings:
   - **Network Type**: Select your custom Docker network if using one
   - **Database Settings**: Configure PostgreSQL connection details
   - **Redis Settings**: Configure Redis connection details
   - **Domain**: Enter your domain name
4. Click Apply and wait for the containers to pull down and start
5. In your Docker tab in Unraid, left-click the **Authentik** container and select 'WebUI'

## Configuration

### Initial Setup

1. **Access Authentik**: Navigate to `https://auth.yourdomain.com/if/flow/initial-setup/`

2. **Create Admin Account**: Fill in the initial setup form:
   - Email: admin@yourdomain.com
   - Username: admin
   - Password: (choose a strong password)

3. **Complete Setup**: Follow the initial configuration wizard

### Basic Configuration

**System Settings**

1. Navigate to **System** → **Settings**
2. Configure basic settings:
   - Domain: yourdomain.com
   - Login URL: https://auth.yourdomain.com
   - Logo and branding options

**Email Configuration**

1. Go to **System** → **Tenants**
2. Edit the default tenant
3. Configure email settings:
   - SMTP Host: smtp.gmail.com
   - SMTP Port: 587
   - SMTP Username: your-email@gmail.com
   - SMTP Password: your-app-password
   - Use TLS: Yes
   - From email: your-email@gmail.com

### Application Integration

**Creating a New Application**

1. Navigate to **Applications** → **Applications**
2. Click **Create** and select application type:
   - **Proxy Provider**: For applications without OAuth support
   - **OAuth2/OpenID Provider**: For modern applications
   - **SAML Provider**: For enterprise applications

3. Configure the provider settings based on your application requirements

4. Create the application and link it to the provider

### Forward Auth Setup

**For Traefik**

1. Create an **Outpost**:
   - Navigate to **Applications** → **Outposts**
   - Create new outpost with type "Proxy"
   - Select your proxy provider

2. Add middleware to protected services:
   ```yaml
   labels:
     - traefik.http.routers.app.middlewares=authentik@docker
   ```

**For Nginx Proxy Manager**

1. Configure the outpost for NPM integration
2. Add custom headers in NPM:
   - X-Forwarded-Proto: $scheme
   - X-Forwarded-Host: $host
   - X-Forwarded-Uri: $request_uri

### User Management

**Creating Users**

1. Navigate to **Directory** → **Users**
2. Click **Create** to add new users
3. Configure user properties:
   - Username and email
   - Groups and permissions
   - Password requirements

**Group Management**

1. Navigate to **Directory** → **Groups**
2. Create groups for different access levels
3. Assign users to appropriate groups

### Multi-Factor Authentication

**TOTP Setup**

1. Navigate to **Flows & Stages** → **Stages**
2. Create or edit an **Authenticator TOTP Stage**
3. Configure TOTP settings and add to authentication flow

**WebAuthn Setup**

1. Create an **Authenticator WebAuthn Stage**
2. Configure WebAuthn settings for hardware security keys
3. Add to authentication flow

## Advanced Configuration

### Custom Policies

Create custom access policies based on:
- User groups
- Time of day
- IP address ranges
- Device compliance
- Risk assessment

### API Integration

Use Authentik's REST API for:
- User provisioning
- Application management
- Policy automation
- Monitoring and reporting

## Troubleshooting

**Common Issues**

1. **Database Connection**: Verify PostgreSQL credentials and network connectivity
2. **Redis Connection**: Ensure Redis is accessible and running
3. **Email Delivery**: Check SMTP settings and firewall rules
4. **Forward Auth**: Verify outpost configuration and middleware setup

**Log Analysis**

Check logs for issues:
```bash
docker compose logs server
docker compose logs worker
```

## Special Thanks

- **Authentik Development Team** for creating this powerful identity management solution
- **Jens Langhammer** and the Authentik community for their excellent documentation
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
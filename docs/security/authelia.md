---
title: "Authelia"
sidebar_position: 1
description: "Open-source authentication and authorization server providing two-factor authentication and single sign-on (SSO) for your applications."
tags: [security, authentication, 2fa, sso, ibracorp]
---

# Authelia

Open-source authentication and authorization server providing two-factor authentication and single sign-on (SSO) for your applications.

:::info Authelia Authentication Server
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Official Documentation](https://www.authelia.com/docs/)
- [Main Website](https://www.authelia.com/)
- [GitHub Repository](https://github.com/authelia/authelia)

**Related Videos**
- Traefik Reverse Proxy Setup
- SWAG Reverse Proxy Setup
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

**Advanced Authentication and Authorization Features**

- **Two-Factor Authentication Methods:**
  - Security Key (U2F)
  - Time-based One-Time Password (TOTP)
  - Mobile Push Notifications
- **Password Reset** with email confirmation
- **Access Restriction** after multiple failed login attempts
- **Fine-grained Access Control** for different applications and routes
- **Kubernetes Support** for container orchestration
- **OpenID Connect Support** (Beta)
- **Multiple Backend Support** (File, LDAP, Active Directory)
- **Session Management** with configurable timeouts
- **Reverse Proxy Integration** (Traefik, nginx, HAProxy)

## Prerequisites

**Required Components**

- Docker and Docker Compose installed
- Reverse proxy (Traefik or SWAG recommended)
- External network named "proxy" created
- Redis for session storage
- Database (MariaDB/MySQL or PostgreSQL)
- SMTP server for email notifications (optional but recommended)
- Domain name with SSL certificate

## Installation

### Docker Compose

**Complete Authelia Stack with Redis and MariaDB**

Create a `docker-compose.yml` file:

```yaml
version: '3'
services:
  authelia:
    container_name: authelia
    image: authelia/authelia:latest
    expose:
      - 9091
    volumes:
      - /opt/appdata/authelia:/config
    environment:
      - TZ=America/New_York
    labels:
      - traefik.enable=true
      - traefik.http.routers.authelia.rule=Host(`auth.yourdomain.com`)
      - traefik.http.routers.authelia.entrypoints=https
      - traefik.http.routers.authelia.tls=true
      - traefik.http.routers.authelia.tls.certresolver=cloudflare
      - traefik.http.middlewares.authelia.forwardauth.address=http://authelia:9091/api/verify?rd=https://auth.yourdomain.com
      - traefik.http.middlewares.authelia.forwardauth.trustForwardHeader=true
      - traefik.http.middlewares.authelia.forwardauth.authResponseHeaders=Remote-User,Remote-Groups,Remote-Name,Remote-Email
    networks:
      - proxy
    restart: unless-stopped
    depends_on:
      - redis
      - mariadb

  redis:
    container_name: authelia-redis
    image: bitnami/redis:latest
    expose:
      - 6379
    volumes:
      - /opt/appdata/authelia/redis:/bitnami/redis/data
    environment:
      - REDIS_PASSWORD=YOUR_REDIS_PASSWORD
      - REDIS_DISABLE_COMMANDS=FLUSHDB,FLUSHALL
    networks:
      - proxy
    restart: unless-stopped

  mariadb:
    container_name: authelia-mariadb
    image: linuxserver/mariadb:latest
    expose:
      - 3306
    volumes:
      - /opt/appdata/authelia/mariadb:/config
    environment:
      - MYSQL_ROOT_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD
      - MYSQL_DATABASE=authelia
      - MYSQL_USER=authelia
      - MYSQL_PASSWORD=YOUR_MYSQL_USER_PASSWORD
      - TZ=America/New_York
    networks:
      - proxy
    restart: unless-stopped

networks:
  proxy:
    external: true
```

**Installation Steps**

1. Create the directory structure:
   ```bash
   mkdir -p /opt/appdata/authelia
   ```

2. Create the environment file with your passwords:
   ```bash
   # Generate secure passwords
   REDIS_PASSWORD=$(openssl rand -base64 32)
   MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
   MYSQL_USER_PASSWORD=$(openssl rand -base64 32)
   ```

3. Update the docker-compose.yml with your domain and passwords

4. Start the Docker containers:
   ```bash
   docker compose up -d
   ```

5. Check container status:
   ```bash
   docker compose logs authelia
   ```

## Configuration

### Authelia Configuration File

Create `/opt/appdata/authelia/configuration.yml`:

```yaml
# Authelia Configuration

theme: dark
jwt_secret: YOUR_JWT_SECRET_HERE
default_redirection_url: https://yourdomain.com

server:
  host: 0.0.0.0
  port: 9091

log:
  level: info

totp:
  issuer: yourdomain.com

authentication_backend:
  file:
    path: /config/users_database.yml
    password:
      algorithm: argon2id
      iterations: 1
      salt_length: 16
      parallelism: 8
      memory: 64

access_control:
  default_policy: deny
  rules:
    - domain: auth.yourdomain.com
      policy: bypass
    - domain: "*.yourdomain.com"
      policy: one_factor

session:
  name: authelia_session
  secret: YOUR_SESSION_SECRET_HERE
  expiration: 3600
  inactivity: 300
  domain: yourdomain.com
  redis:
    host: redis
    port: 6379
    password: YOUR_REDIS_PASSWORD

regulation:
  max_retries: 3
  find_time: 120
  ban_time: 300

storage:
  mysql:
    host: mariadb
    port: 3306
    database: authelia
    username: authelia
    password: YOUR_MYSQL_USER_PASSWORD

notifier:
  smtp:
    username: your-email@gmail.com
    password: your-app-password
    host: smtp.gmail.com
    port: 587
    sender: your-email@gmail.com
    subject: "[Authelia] {title}"
```

### User Database

Create `/opt/appdata/authelia/users_database.yml`:

```yaml
users:
  admin:
    displayname: "Administrator"
    password: "$argon2id$v=19$m=65536,t=3,p=4$GENERATED_HASH_HERE"
    email: admin@yourdomain.com
    groups:
      - admins
      - dev
  user:
    displayname: "User"
    password: "$argon2id$v=19$m=65536,t=3,p=4$GENERATED_HASH_HERE"
    email: user@yourdomain.com
    groups:
      - dev
```

### Generate Password Hashes

1. Access the Authelia container:
   ```bash
   docker exec -it authelia authelia hash-password
   ```

2. Enter your desired password when prompted

3. Copy the generated hash to your users_database.yml file

### Configuration Steps

1. **Update Configuration Files**: Replace all placeholder values with your actual domain, passwords, and email settings

2. **Generate Secrets**: Use secure random strings for JWT and session secrets:
   ```bash
   openssl rand -base64 64
   ```

3. **Restart Authelia**: After configuration changes:
   ```bash
   docker compose restart authelia
   ```

4. **Test Access**: Navigate to `https://auth.yourdomain.com` and verify the login page loads

5. **Configure Protected Services**: Add Authelia middleware to your other services in Traefik

## Protecting Services with Authelia

### Traefik Labels Example

Add these labels to services you want to protect:

```yaml
labels:
  - traefik.http.routers.app.middlewares=authelia@docker
```

### Advanced Access Control

Customize access rules in `configuration.yml`:

```yaml
access_control:
  rules:
    - domain: admin.yourdomain.com
      policy: two_factor
      subject: "group:admins"
    - domain: app.yourdomain.com
      policy: one_factor
      subject: "group:dev"
    - domain: public.yourdomain.com
      policy: bypass
```

## Special Thanks

- **Authelia Development Team** for creating this excellent authentication solution
- **Clément Michaud** and the Authelia community for their comprehensive documentation
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
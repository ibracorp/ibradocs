# Authelia Authentication

Authelia is an open-source authentication and authorization server that provides two-factor authentication (2FA) and single sign-on (SSO) capabilities for your self-hosted applications.

## Overview

Authelia adds an extra layer of security to your applications by requiring users to authenticate through multiple factors before gaining access. It integrates seamlessly with reverse proxies like Traefik and NGINX Proxy Manager.

## Key Features

### Two-Factor Authentication Methods

1. **Security Key (U2F)** - Hardware tokens like YubiKey
2. **Time-based One-Time Password (TOTP)** - Apps like Google Authenticator, Authy
3. **Mobile Push Notifications** - Integration with Duo Security

### Additional Security Features

- **Password Reset** - Email verification for password recovery
- **Account Lockout** - Protection against brute force attacks
- **Fine-grained Access Control** - Configurable rules for different applications
- **Session Management** - Secure session handling and timeout controls

## Supported Platforms

- **Docker Compose** - Recommended for most installations
- **Unraid** - Community Applications support
- **Kubernetes** - Beta support available

## Authentication Backends

Authelia supports various authentication backends:

- **File-based** - Simple YAML configuration
- **LDAP** - Active Directory, OpenLDAP integration
- **OpenID Connect** - Integration with external providers

## Integration Support

- **Traefik** - Full middleware integration
- **NGINX Proxy Manager** - Forward auth configuration
- **Kubernetes Ingress** - Native ingress controller support

## Basic Configuration Steps

### 1. Choose Authentication Method

Select your preferred 2FA method:
- Hardware security keys for maximum security
- TOTP apps for convenience
- Push notifications for mobile-first workflows

### 2. Set Up Reverse Proxy

Configure your reverse proxy to use Authelia for authentication:
- Forward authentication requests to Authelia
- Configure appropriate headers and redirects
- Set up bypass rules for public endpoints

### 3. Configure Access Rules

Define granular access control:
```yaml
access_control:
  default_policy: deny
  rules:
    - domain: "*.example.com"
      policy: two_factor
    - domain: "public.example.com"
      policy: bypass
```

### 4. Identity Provider Integration (Optional)

For enterprise environments, integrate with existing identity providers:
- Active Directory/LDAP
- OIDC providers (Google, Microsoft, etc.)
- SAML providers

## Security Considerations

- **Strong Passwords** - Enforce password complexity requirements
- **Regular Updates** - Keep Authelia updated for security patches
- **Network Security** - Use HTTPS for all communications
- **Database Security** - Secure your user database and session storage

## Deployment Recommendations

### Development/Testing
- File-based user database
- SQLite for session storage
- Basic email configuration

### Production
- LDAP/AD integration
- PostgreSQL/MySQL for session storage
- Enterprise email service (SMTP)
- Hardware security key support

## Troubleshooting

**Authentication loops:**
- Check reverse proxy configuration
- Verify Authelia URL accessibility
- Review access control rules

**2FA not working:**
- Verify time synchronization
- Check TOTP secret generation
- Validate hardware key registration

**Email notifications failing:**
- Test SMTP configuration
- Check firewall rules
- Verify DNS resolution

## Related Documentation

- [Reverse Proxy Setup](../reverse-proxies/nginx-proxy-manager.md)
- [Docker Compose Guide](../tools/docker-compose.md)
- [Networking Configuration](../networking/cloudflare-tunnel.md)

For detailed configuration examples and advanced setups, refer to the official Authelia documentation.
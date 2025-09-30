---
title: "CrowdSec"
sidebar_position: 3
description: "Free, open-source, and collaborative IPS that analyzes behaviors, responds to attacks, and shares signals across the community."
tags: [security, ips, intrusion-prevention, crowdsec, ibracorp]
---

# CrowdSec

Free, open-source, and collaborative IPS that analyzes behaviors, responds to attacks, and shares signals across the community.

:::info CrowdSec Intrusion Prevention System
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Official Documentation](https://docs.crowdsec.net/)
- [Main Website](https://www.crowdsec.net/)
- [GitHub Repository](https://github.com/crowdsecurity/crowdsec)
- [Hub Collections](https://hub.crowdsec.net/)

**Related Videos**
- Traefik Integration with CrowdSec
- Nginx Integration with CrowdSec
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

**Comprehensive Intrusion Prevention and Detection**

- **Behavioral Analysis** of logs and network traffic
- **Collaborative Intelligence** sharing attack patterns globally
- **Real-time Protection** against known and emerging threats
- **Multi-tier Detection** with parsers, scenarios, and postoverflows
- **Flexible Remediation** with various bouncers (iptables, cloudflare, etc.)
- **Machine Learning** capabilities for advanced threat detection
- **API-first Architecture** for easy integration
- **Community Hub** with pre-built parsers and scenarios
- **Multi-service Support** (web servers, SSH, mail servers, etc.)
- **Dashboard and Metrics** for monitoring and analysis
- **Low Resource Usage** with efficient log parsing
- **Custom Scenarios** for specific threat patterns

## Prerequisites

**Required Components**

- Docker and Docker Compose installed
- Log files to monitor (nginx, apache, SSH, etc.)
- Network connectivity for community intelligence sharing
- Sufficient disk space for log analysis and databases
- Access to system logs and application logs

## Installation

### Docker Compose

**CrowdSec Security Engine with Local API**

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    container_name: crowdsec
    environment:
      - PGID=1000
      - PUID=1000
      - TZ=America/New_York
      - COLLECTIONS=crowdsecurity/linux crowdsecurity/traefik crowdsecurity/http-cve crowdsecurity/whitelist-good-actors
    volumes:
      - /opt/appdata/crowdsec/config:/etc/crowdsec:rw
      - /opt/appdata/crowdsec/data:/var/lib/crowdsec/data:rw
      - /var/log:/var/log:ro
      - /var/log/traefik:/var/log/traefik:ro
      - /var/log/nginx:/var/log/nginx:ro
      - /var/log/auth.log:/var/log/auth.log:ro
      - /etc/localtime:/etc/localtime:ro
    networks:
      - crowdsec
    restart: unless-stopped
    labels:
      - traefik.enable=false
    security_opt:
      - no-new-privileges:true

  bouncer-traefik:
    image: crowdsecurity/traefik-crowdsec-bouncer:latest
    container_name: crowdsec-bouncer-traefik
    environment:
      - CROWDSEC_BOUNCER_API_KEY=YOUR_BOUNCER_API_KEY
      - CROWDSEC_AGENT_HOST=crowdsec:8080
      - CROWDSEC_BOUNCER_LOG_LEVEL=INFO
    networks:
      - crowdsec
      - proxy
    restart: unless-stopped
    depends_on:
      - crowdsec

  dashboard:
    image: metabase/metabase:latest
    container_name: crowdsec-dashboard
    restart: unless-stopped
    environment:
      - MB_DB_FILE=/data/metabase.db
      - MGID=1000
      - MUID=1000
    volumes:
      - /opt/appdata/crowdsec/dashboard:/data
    labels:
      - traefik.enable=true
      - traefik.http.routers.crowdsec-dashboard.rule=Host(`crowdsec.yourdomain.com`)
      - traefik.http.routers.crowdsec-dashboard.entrypoints=https
      - traefik.http.routers.crowdsec-dashboard.tls=true
      - traefik.http.routers.crowdsec-dashboard.tls.certresolver=cloudflare
      - traefik.http.services.crowdsec-dashboard.loadbalancer.server.port=3000
    networks:
      - proxy
      - crowdsec
    depends_on:
      - crowdsec

networks:
  crowdsec:
    driver: bridge
  proxy:
    external: true
```

**Installation Steps**

1. Create the directory structure:
   ```bash
   mkdir -p /opt/appdata/crowdsec/{config,data,dashboard}
   ```

2. Start CrowdSec for initial configuration:
   ```bash
   docker compose up crowdsec -d
   ```

3. Register with CrowdSec Central API (optional but recommended):
   ```bash
   docker exec crowdsec cscli capi register
   ```

4. Generate bouncer API key:
   ```bash
   docker exec crowdsec cscli bouncers add traefik-bouncer
   ```

5. Update the docker-compose.yml with the generated API key

6. Start all services:
   ```bash
   docker compose up -d
   ```

### Unraid Installation

**CrowdSec from Community Applications**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **CrowdSec** from the available repositories
3. Configure the following settings:
   - **Network Type**: Select your custom Docker network if using one
   - **Log Paths**: Map your log directories to the container
   - **Collections**: Specify which parsers and scenarios to install
   - **Time Zone**: Set your local time zone
4. Click Apply and wait for the container to pull down and start
5. Access the container console to complete configuration

## Configuration

### Initial Setup

1. **Check CrowdSec Status**:
   ```bash
   docker exec crowdsec cscli metrics
   ```

2. **Install Additional Collections**:
   ```bash
   # Install specific collections
   docker exec crowdsec cscli collections install crowdsecurity/nginx
   docker exec crowdsec cscli collections install crowdsecurity/ssh
   docker exec crowdsec cscli collections install crowdsecurity/base-http-scenarios

   # Reload CrowdSec configuration
   docker exec crowdsec cscli collections upgrade
   ```

3. **Configure Acquisition**:
   Create `/opt/appdata/crowdsec/config/acquis.yaml`:
   ```yaml
   filenames:
     - /var/log/traefik/*.log
   labels:
     type: traefik
   ---
   filenames:
     - /var/log/nginx/access.log
     - /var/log/nginx/error.log
   labels:
     type: nginx
   ---
   filenames:
     - /var/log/auth.log
   labels:
     type: syslog
   ```

### Bouncer Configuration

**Traefik Bouncer Setup**

1. **Install Traefik Plugin**: Add to your traefik.yml:
   ```yaml
   experimental:
     plugins:
       bouncer:
         modulename: github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin
         version: v1.1.13
   ```

2. **Configure Middleware**: Add to your dynamic configuration:
   ```yaml
   http:
     middlewares:
       crowdsec:
         plugin:
           bouncer:
             enabled: true
             crowdsecLapiKey: YOUR_BOUNCER_API_KEY
             crowdsecLapiHost: http://crowdsec:8080
             crowdsecLapiScheme: http
   ```

**Nginx Bouncer Setup**

1. **Install Nginx Bouncer**:
   ```bash
   docker exec crowdsec cscli bouncers add nginx-bouncer
   ```

2. **Configure Nginx**: Add to your nginx configuration:
   ```nginx
   location / {
       access_by_lua_block {
           local crowdsec = require "crowdsec"
           crowdsec.allow()
       }
       # Your normal configuration
   }
   ```

### Dashboard Setup

**Metabase Dashboard Configuration**

1. **Access Dashboard**: Navigate to `https://crowdsec.yourdomain.com`

2. **Initial Setup**: Complete the Metabase setup wizard:
   - Create admin account
   - Skip database connection (we'll configure CrowdSec database)

3. **Configure CrowdSec Database**:
   - Database type: SQLite
   - Database file: `/data/crowdsec.db`
   - Name: CrowdSec

4. **Import Dashboard**: Download and import the official CrowdSec dashboard from the hub

### Useful Commands

**Management Commands**

```bash
# Check metrics and status
docker exec crowdsec cscli metrics
docker exec crowdsec cscli alerts list
docker exec crowdsec cscli decisions list

# Manage collections and parsers
docker exec crowdsec cscli collections list
docker exec crowdsec cscli parsers list
docker exec crowdsec cscli scenarios list

# Bouncer management
docker exec crowdsec cscli bouncers list
docker exec crowdsec cscli bouncers delete BOUNCER_NAME

# Whitelist management
docker exec crowdsec cscli decisions add --ip 192.168.1.100 --type ban --duration 4h
docker exec crowdsec cscli decisions delete --ip 192.168.1.100

# Hub operations
docker exec crowdsec cscli hub list
docker exec crowdsec cscli hub update
docker exec crowdsec cscli hub upgrade
```

**Log Analysis**

```bash
# View CrowdSec logs
docker logs crowdsec

# Test configuration
docker exec crowdsec cscli config show
docker exec crowdsec cscli config validate

# Simulation mode (for testing)
docker exec crowdsec cscli simulation enable crowdsecurity/ssh-bf
```

## Advanced Configuration

### Custom Scenarios

Create custom scenarios for specific threats:

```yaml
# /opt/appdata/crowdsec/config/scenarios/custom-scenario.yaml
type: leaky
name: custom/multiple-failed-requests
description: "Detect multiple failed requests"
filter: "evt.Meta.service == 'http'"
leakspeed: "10s"
capacity: 5
groupby: "evt.Meta.source_ip"
distinct: "evt.Meta.http_path"
debug: false
labels:
  service: http
  type: bruteforce
  remediation: true
```

### Integration with External Services

**Slack Notifications**

```bash
# Install notification plugin
docker exec crowdsec cscli notifications install slack

# Configure notifications
docker exec crowdsec cscli notifications add slack slack-alerts \
  --webhook-url "YOUR_SLACK_WEBHOOK_URL"
```

**Custom Remediation**

Create custom bouncers for:
- Cloud provider firewalls
- Network equipment
- Application-level blocking
- Custom APIs

## Monitoring and Maintenance

### Health Checks

Regular monitoring tasks:

```bash
# Check system health
docker exec crowdsec cscli metrics

# Verify log processing
docker exec crowdsec cscli metrics --buckets

# Monitor decisions
docker exec crowdsec cscli decisions list --type ban

# Check hub updates
docker exec crowdsec cscli hub list --upgradable
```

### Performance Optimization

- **Log Rotation**: Ensure proper log rotation to prevent disk space issues
- **Memory Tuning**: Adjust container memory limits based on log volume
- **Database Maintenance**: Regular cleanup of old decisions and alerts
- **Network Optimization**: Use local caching for frequently accessed data

## Troubleshooting

**Common Issues**

1. **Log Parsing Errors**: Check acquis.yaml and log file permissions
2. **API Connectivity**: Verify network configuration and firewall rules
3. **High Memory Usage**: Review log volume and parsing configuration
4. **Dashboard Not Loading**: Check Metabase configuration and database connectivity

**Debug Mode**

Enable debug logging:
```bash
docker exec crowdsec cscli config set api.server.log_level debug
docker compose restart crowdsec
```

## Special Thanks

- **CrowdSec Development Team** for creating this innovative security solution
- **Thibault "bui" KOECHLIN** and the CrowdSec community for their collaborative approach
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
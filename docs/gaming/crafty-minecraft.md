---
title: "Crafty Minecraft Server"
sidebar_position: 4
description: "Unraid dedicated server hosting for Minecraft using Crafty Controller"
tags: ["gaming", "ibracorp"]
source_url: https://docs.ibracorp.io/crafty-minecraft-server/
---

# Crafty Minecraft Server

Unraid dedicated server hosting for Minecraft using Crafty Controller

:::info Crafty Minecraft Server Setup
**Video**
[![IBRACORP Crafty Minecraft Tutorial](https://img.youtube.com/vi/Xqsc9sNTq0I/0.jpg)](https://www.youtube.com/watch?v=Xqsc9sNTq0I)

https://www.youtube.com/watch?v=Xqsc9sNTq0I

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/Xqsc9sNTq0I"
  title="IBRACORP Crafty Minecraft Tutorial"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>

**Useful Links**
- [Crafty Controller Official GitHub](https://gitlab.com/crafty-controller/crafty-4)
- [Minecraft Official Website](https://minecraft.net/)
- [PaperMC Download](https://papermc.io/downloads)

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
| Contributor | Crafty Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Crafty Minecraft Server Controller Features:**

- Web-based Minecraft server management interface
- Support for vanilla, Paper, Forge, and modded servers
- Multiple Java version compatibility
- Real-time server monitoring and logs
- Player management and operator controls
- Automated backups and scheduling
- Plugin and mod management
- Resource usage monitoring

## Prerequisites

**System Requirements:**

- **CPU:** 4+ cores (2.0GHz or higher)
- **RAM:** 4GB minimum (8GB+ recommended for modded servers)
- **Storage:** 10GB available space minimum
- **Network:** Stable internet connection with port forwarding
- **Java:** Compatible Java version for chosen Minecraft version

## Installation

### Unraid Docker Template

**Crafty Controller / Community Applications / Gaming**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Crafty Controller** from the community applications
3. If you are using a custom Docker network, select it in the 'Network Type' field
4. Configure the container ports:
   - **WebUI Port:** 8443 (HTTPS) or 8000 (HTTP)
   - **Minecraft Port:** 25565 (default)
5. **Configure Container:**
   - Set **PUID** and **PGID** to match your user
   - Configure **TZ** to your timezone
   - Set volume mappings for server data
6. Click Apply and wait for the container to pull down and start
7. Access the WebUI at `https://YOUR_SERVER_IP:8443`

### Docker Compose

```yaml
version: '3.8'
services:
  crafty:
    image: registry.gitlab.com/crafty-controller/crafty-4:latest
    container_name: crafty-minecraft
    restart: unless-stopped
    environment:
      - TZ=America/New_York
      - PUID=1000
      - PGID=1000
    ports:
      - "8443:8443"  # HTTPS WebUI
      - "8000:8000"  # HTTP WebUI
      - "25565:25565" # Minecraft Server
    volumes:
      - ./crafty-data:/crafty/app/config
      - ./minecraft-servers:/crafty/servers
      - ./minecraft-backups:/crafty/backups
      - ./minecraft-logs:/crafty/logs
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Customize the timezone and user IDs as needed
3. Start the container:
   ```bash
   docker compose up -d
   ```
4. Access the WebUI at `https://YOUR_SERVER_IP:8443`

## Configuration

**Initial Setup Process:**

1. Navigate to the Crafty WebUI at `https://YOUR_SERVER_IP:8443`
2. Complete the initial setup wizard
3. Create admin account with secure credentials
4. Configure SSL certificates (optional but recommended)
5. Set up your first Minecraft server through the interface

**Server Creation:**

1. Click **"Create New Server"** in the Crafty interface
2. Choose your server type:
   - **Vanilla:** Official Minecraft server
   - **Paper:** Optimized server with plugin support
   - **Forge:** Modded server support
   - **Fabric:** Lightweight modding platform
3. Configure server settings and download server JAR

## Server Configuration

### Java Version Selection

**Java Compatibility Matrix:**

| Minecraft Version | Recommended Java | Path |
|-------------------|------------------|------|
| 1.8 - 1.16 | Java 8 | `/usr/lib/jvm/java-1.8.0-openjdk-amd64/jre/bin/java` |
| 1.17 - 1.17.1 | Java 16+ | `/usr/lib/jvm/java-1.16.0-openjdk-amd64/jre/bin/java` |
| 1.18+ | Java 17+ | `/usr/lib/jvm/java-1.17.0-openjdk-amd64/jre/bin/java` |

### Basic Server Settings

**Server Configuration (`server.properties`):**
```properties
# Server identity
server-name=My Minecraft Server
motd=Welcome to My Server!
max-players=20

# Network settings
server-ip=0.0.0.0
server-port=25565
online-mode=true

# World settings
level-name=world
level-seed=
gamemode=survival
difficulty=normal
hardcore=false

# Performance settings
view-distance=10
simulation-distance=10
max-tick-time=60000
```

### Memory Allocation

**Recommended RAM Settings:**

| Server Type | Players | Minimum RAM | Recommended RAM |
|-------------|---------|-------------|-----------------|
| Vanilla | 1-10 | 2GB | 4GB |
| Vanilla | 10-20 | 4GB | 6GB |
| Paper | 1-20 | 3GB | 5GB |
| Modded (Light) | 1-10 | 4GB | 8GB |
| Modded (Heavy) | 1-10 | 8GB | 16GB |

**JVM Arguments:**
```bash
# For 4GB allocation
-Xms4G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC

# For 8GB allocation
-Xms8G -Xmx8G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC
```

## Player Management

### Setting Up Operators

1. **Via Crafty WebUI:**
   - Navigate to **"Players"** section
   - Add player username to **"Operators"** list
   - Set permission level (1-4)

2. **Via Server Console:**
   ```bash
   op USERNAME
   deop USERNAME
   ```

### Player Commands

**Essential Operator Commands:**
```bash
# Player management
/kick PLAYER reason
/ban PLAYER reason
/pardon PLAYER
/whitelist add PLAYER
/whitelist remove PLAYER

# World management
/gamemode creative PLAYER
/tp PLAYER1 PLAYER2
/give PLAYER ITEM AMOUNT

# Server management
/save-all
/stop
/reload
```

## Plugin Management

### Installing Plugins (Paper/Spigot)

1. **Via Crafty Interface:**
   - Navigate to **"Files"** section
   - Upload plugins to `/plugins/` directory
   - Restart server to load plugins

2. **Popular Plugins:**
   - **EssentialsX** - Core commands and utilities
   - **WorldGuard** - World protection and regions
   - **LuckPerms** - Advanced permissions management
   - **Vault** - Economy API
   - **PlaceholderAPI** - Plugin compatibility

### Mod Management (Forge/Fabric)

1. **Forge Mods:**
   - Place `.jar` files in `/mods/` directory
   - Ensure client-server compatibility
   - Check mod dependencies

2. **Fabric Mods:**
   - Install Fabric API as base dependency
   - Add compatible mods to `/mods/` directory
   - Verify Minecraft version compatibility

## Backup Configuration

### Automated Backups

**Backup Settings in Crafty:**
1. Navigate to **"Schedules"** section
2. Create new scheduled task
3. Configure backup frequency:
   - **Daily:** For active servers
   - **Weekly:** For stable servers
   - **Manual:** Before major changes

**Backup Commands:**
```bash
# Manual backup via console
/save-all flush
# Copy world folder to backup location
```

### Backup Management

**Best Practices:**
- Keep 7 daily backups minimum
- Store backups on separate storage device
- Test backup restoration regularly
- Backup before server updates or major changes

## Performance Optimization

### Server-Side Optimizations

**server.properties Tweaks:**
```properties
# Reduce entity processing
entity-broadcast-range-percentage=80
simulation-distance=6
view-distance=8

# Network optimization
network-compression-threshold=256
max-tick-time=60000

# Performance settings
spawn-protection=0
use-native-transport=true
```

**Paper Configuration (`paper.yml`):**
```yaml
# Anti-cheat optimizations
settings:
  async-chunks:
    enable: true
    threads: 4

world-settings:
  default:
    # Mob optimization
    despawn-ranges:
      monster: 56
      creature: 32
      ambient: 32

    # Chunk optimization
    max-auto-save-chunks-per-tick: 6
    optimize-explosions: true
```

### Plugin Optimizations

**Performance Monitoring Plugins:**
- **Spark** - Performance profiler
- **Plan** - Analytics and statistics
- **LagAssist** - Automatic lag reduction

## Troubleshooting

### Common Issues

**Server Won't Start:**
- Check Java version compatibility
- Verify sufficient RAM allocation
- Review server logs for errors
- Ensure EULA is accepted

**Players Can't Connect:**
- Confirm port forwarding for 25565
- Check firewall settings
- Verify server IP configuration (`server-ip=0.0.0.0`)
- Ensure server is running and accessible

**Performance Issues:**
- Monitor RAM usage in Crafty interface
- Reduce view distance and simulation distance
- Limit entity counts with plugins
- Check for problematic plugins or mods

**Crafty WebUI Issues:**
- Clear browser cache and cookies
- Check SSL certificate configuration
- Verify container port mappings
- Review Crafty logs for errors

### Log Analysis

**Server Logs Location:**
- **Crafty Logs:** `/crafty/logs/`
- **Server Logs:** `/crafty/servers/SERVER_NAME/logs/`
- **Crash Reports:** `/crafty/servers/SERVER_NAME/crash-reports/`

**Log Commands:**
```bash
# View Crafty logs
docker logs crafty-minecraft

# View server logs
tail -f ./minecraft-servers/SERVER_NAME/logs/latest.log

# Follow logs in real-time
docker logs -f crafty-minecraft
```

## Advanced Configuration

### Multiple Server Setup

1. **Create Additional Servers:**
   - Use unique ports for each server
   - Configure separate world directories
   - Allocate appropriate resources per server

2. **Port Management:**
   ```yaml
   # Server 1: 25565
   # Server 2: 25566
   # Server 3: 25567
   ```

### Network Configuration

**Advanced Networking:**
```properties
# Proxy support (for large networks)
bungeecord=true
prevent-proxy-connections=false

# IP forwarding (for proxied servers)
server-ip=127.0.0.1
online-mode=false
```

## Special Thanks

- **Crafty Controller Team** for their excellent server management platform
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
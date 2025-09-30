---
title: "Rust Server"
sidebar_position: 2
description: "Unraid dedicated server hosting for Rust"
tags: ["gaming", "ibracorp"]
source_url: https://docs.ibracorp.io/rust/unraid-dedicated-server-hosting-for-rust.md
---

# Rust Server

Unraid dedicated server hosting for Rust

:::info Rust Dedicated Server
**Video**
[IBRACORP Rust Server Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Rust Official Website](https://rust.facepunch.com/)
- [Rust Developer Resources](https://wiki.facepunch.com/rust/)

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
| Writer / Producer | ich777 |
| Video Recording and Voice | IBRACORP |
| Contributor | ich777 |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**Rust Dedicated Server Features:**

- Full Rust multiplayer survival server
- Support for 100+ concurrent players
- Oxide plugin support for modding
- Admin controls and permissions
- Configurable world size and settings
- Automatic server updates

## Prerequisites

**System Requirements:**

- **CPU:** 4+ cores (2.0GHz or higher)
- **RAM:** 6GB minimum (8GB+ recommended)
- **Storage:** 10GB available space minimum
- **Network:** Stable internet connection with port forwarding
- **Steam Account:** Required for dedicated server

## Installation

### Unraid Docker Template

**Rust Server / ich777's Repository / Gaming**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Rust Server** from **ich777's Repository**
3. If you are using a custom Docker network, select it in the 'Network Type' field
4. Enter the host port you want to map for the server. By default it is **28015**. Only change it if this port is already in use
5. **Configure Server Settings:**
   - Set **SERVER_NAME** to your desired server name
   - Configure **WORLD_SIZE** (default: 3000)
   - Set **MAX_PLAYERS** (default: 100)
   - Configure **SERVER_DESCRIPTION** with server details
6. Click Apply and wait for the container to pull down and start
7. **Port Forwarding:** Forward port **28015** (UDP) on your router to your Unraid server

### Docker Compose

```yaml
version: '3.8'
services:
  rust-server:
    image: ich777/steamcmd:rust
    container_name: rust-server
    restart: unless-stopped
    environment:
      - SERVER_NAME=My Rust Server
      - WORLD_SIZE=3000
      - MAX_PLAYERS=100
      - SERVER_DESCRIPTION=A great Rust server
      - PUID=1000
      - PGID=1000
    ports:
      - "28015:28015/udp"
    volumes:
      - ./rust-data:/serverdata/steamcmd/rust
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Customize the environment variables as needed
3. Start the container:
   ```bash
   docker compose up -d
   ```
4. Monitor logs for successful startup

## Configuration

**Server Setup Process:**

1. The server will automatically download Rust files on first startup
2. Wait for the download and world generation to complete (15-45 minutes)
3. Your server will be available at `YOUR_SERVER_IP:28015`
4. Players can connect by pressing **F1** in Rust and typing: `connect YOUR_SERVER_IP:28015`

**World Generation:**
- World size determines map complexity and player capacity
- Larger worlds require more RAM and processing power
- Default seed generates a random world each wipe

## Server Management

### Becoming Server Admin

1. Join your server as a player
2. Press **F1** to open the console
3. Note your Steam ID (displayed in console)
4. Access server files and edit `/serverdata/steamcmd/rust/cfg/users.cfg`
5. Add your Steam ID with admin permissions:
   ```
   ownerid YOUR_STEAM_ID_HERE "Your Name"
   ```
6. Restart the server to apply changes

### Admin Commands

**Basic Commands:**
```bash
# Give items to player
give PLAYER_NAME ITEM_NAME QUANTITY

# Teleport to player
teleport PLAYER_NAME

# Kick player
kick PLAYER_NAME "Reason"

# Ban player
ban PLAYER_NAME "Reason"

# Save server
save
```

### Oxide Plugin Support

**Enable Oxide:**
1. Set `OXIDE_ENABLED=true` in your container environment
2. Restart the container
3. Plugins will be automatically downloaded and installed

**Popular Plugins:**
- **AdminRadar** - Admin map overlay
- **Kits** - Give players starter kits
- **Economics** - In-game economy system
- **Teleportation** - Player teleport commands

## Configuration Options

### Server Settings

| Setting | Description | Default | Example |
|---------|-------------|---------|---------|
| `SERVER_NAME` | Server display name | `Rust Server` | `My PvP Server` |
| `WORLD_SIZE` | Map size | `3000` | `2000`, `4000` |
| `MAX_PLAYERS` | Player limit | `100` | `50`, `200` |
| `SERVER_DESCRIPTION` | Server description | Empty | `Vanilla PvP` |
| `SAVE_INTERVAL` | Auto-save interval | `300` | `600` (10 mins) |

### Advanced Configuration

**Server Configuration File (`server.cfg`):**
```cfg
# Server identity
server.hostname "My Rust Server"
server.description "A great Rust server"
server.maxplayers 100
server.worldsize 3000

# Gameplay settings
server.pve false
server.pvp true
decay.scale 1.0

# Performance settings
fps.limit 256
server.tickrate 30
```

## Wipe Management

### Manual Wipe

**Map Wipe Only:**
```bash
# Stop server
docker stop rust-server

# Remove map files
rm -rf ./rust-data/server/WORLD_IDENTITY/

# Start server
docker start rust-server
```

**Full Wipe (Map + Blueprints):**
```bash
# Stop server
docker stop rust-server

# Remove all server data
rm -rf ./rust-data/server/

# Start server
docker start rust-server
```

### Automated Wipes

Configure automatic wipes using cron jobs or environment variables:
```bash
# Weekly Thursday wipe at 2 PM
WIPE_SCHEDULE="0 14 * * 4"
```

## Troubleshooting

### Common Issues

**Server Won't Start:**
- Check available disk space (minimum 10GB)
- Verify port 28015 is not in use
- Review container logs for error messages

**Players Can't Connect:**
- Confirm port forwarding for 28015 UDP
- Check firewall settings
- Ensure server startup is complete

**Performance Issues:**
- Monitor RAM usage (upgrade if consistently high)
- Reduce world size for better performance
- Limit concurrent players based on hardware

**Connection Issues:**
- Verify server IP and port are correct
- Check if server is listed in community browser
- Ensure players are using correct Rust client version

### Log Analysis

```bash
# View container logs
docker logs rust-server

# Follow logs in real-time
docker logs -f rust-server

# Check Rust server logs
tail -f ./rust-data/server/IDENTITY/logs/latest.txt
```

## Performance Optimization

### Hardware Recommendations

**Minimum (50 players):**
- 4 core CPU, 8GB RAM
- World size: 2000

**Recommended (100 players):**
- 6+ core CPU, 16GB RAM
- World size: 3000

**High Performance (200+ players):**
- 8+ core CPU, 32GB RAM
- World size: 4000

### Server Settings

```cfg
# Optimize for performance
fps.limit 60
graphics.quality 0
render.level 0
terrain.quality 0
```

## Special Thanks

- **ich777** developer for their excellent Docker container and guidance
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
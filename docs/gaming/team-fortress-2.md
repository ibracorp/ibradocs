---
title: "Team Fortress 2"
sidebar_position: 1
description: "Unraid dedicated server hosting for Team Fortress 2"
tags: ["gaming", "ibracorp"]
source_url: https://docs.ibracorp.io/team-fortress-2/unraid-dedicated-server-hosting-for-team-fortress-2.md
---

# Team Fortress 2

Unraid dedicated server hosting for Team Fortress 2

:::info Team Fortress 2 Server Setup
**Video**
[IBRACORP Team Fortress 2 Server Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [Steam Developer Documentation](https://developer.valvesoftware.com/wiki/Team_Fortress_2)
- [Team Fortress 2 Official Website](https://www.teamfortress.com/)

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

**Team Fortress 2 Dedicated Server Features:**

- Full Team Fortress 2 multiplayer server
- Support for up to 24+ players
- Custom map support
- MetaMod and SourceMod compatibility
- RCON remote administration
- Configurable game modes and settings

## Prerequisites

**System Requirements:**

- **CPU:** 4+ cores (2.0GHz or higher)
- **RAM:** 6GB minimum
- **Storage:** 10GB available space
- **Network:** Stable internet connection with port forwarding capability
- **Steam Account:** Required for server token generation

## Installation

### Unraid Docker Template

**Team Fortress 2 / ich777's Repository / Gaming**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **Team Fortress 2** from **ich777's Repository**
3. If you are using a custom Docker network, select it in the 'Network Type' field
4. Enter the host port you want to map for the server. By default it is **27015**. Only change it if this port is already in use
5. **Generate Steam Token:**
   - Visit [Steam Token Generator](https://steamcommunity.com/dev/managegameservers)
   - Log in with your Steam account
   - Create a new token for App ID **440** (Team Fortress 2)
   - Copy the generated token
6. **Configure Container:**
   - Paste your Steam token in the **STEAMTOKEN** field
   - Set **GAMEMODE** to your preferred game mode (e.g., cp, ctf, pl)
   - Configure **MAXPLAYERS** (default: 24)
7. Click Apply and wait for the container to pull down and start
8. **Port Forwarding:** Forward port **27015** (UDP/TCP) on your router to your Unraid server

### Docker Compose

```yaml
version: '3.8'
services:
  tf2-server:
    image: ich777/steamcmd:tf2
    container_name: tf2-server
    restart: unless-stopped
    environment:
      - STEAMTOKEN=YOUR_STEAM_TOKEN_HERE
      - GAMEMODE=cp
      - MAXPLAYERS=24
      - PUID=1000
      - PGID=1000
    ports:
      - "27015:27015/tcp"
      - "27015:27015/udp"
    volumes:
      - ./tf2-data:/serverdata/steamcmd/tf2
```

**Installation Steps:**

1. Save the above configuration as `docker-compose.yml`
2. Replace `YOUR_STEAM_TOKEN_HERE` with your Steam token
3. Start the container:
   ```bash
   docker compose up -d
   ```
4. Monitor logs for successful startup

## Configuration

**Server Setup Process:**

1. The server will automatically download Team Fortress 2 files on first startup
2. Wait for the download to complete (this may take 15-30 minutes)
3. Once complete, your server will be available at `YOUR_SERVER_IP:27015`
4. Players can connect using the console command: `connect YOUR_SERVER_IP:27015`

**Server Customization:**

- **Configuration Files:** Located in `/serverdata/steamcmd/tf2/tf/cfg/`
- **Custom Maps:** Place in `/serverdata/steamcmd/tf2/tf/maps/`
- **Server Settings:** Edit `server.cfg` for advanced configuration

## Server Modification

### Adding Custom Maps

1. Access your server files through Unraid shares or container console
2. Navigate to `/serverdata/steamcmd/tf2/tf/maps/`
3. Upload your custom map files (`.bsp` format)
4. Restart the server or use RCON to change maps

### MetaMod & SourceMod Installation

**MetaMod Setup:**
1. Download MetaMod from [official website](https://www.sourcemm.net/)
2. Extract files to `/serverdata/steamcmd/tf2/tf/`
3. Add `"metamod"` to your `gameinfo.txt`

**SourceMod Setup:**
1. Download SourceMod from [official website](https://www.sourcemod.net/)
2. Extract files to `/serverdata/steamcmd/tf2/tf/`
3. Restart server to load plugins

## Configuration Options

### Server Settings

| Setting | Description | Default | Example |
|---------|-------------|---------|---------|
| `GAMEMODE` | Game mode type | `cp` | `cp`, `ctf`, `pl`, `koth` |
| `MAXPLAYERS` | Maximum players | `24` | `16`, `32` |
| `STEAMTOKEN` | Steam server token | Required | Generated from Steam |
| `HOSTNAME` | Server name | `TF2 Server` | `My TF2 Server` |

### Advanced Configuration

Edit `server.cfg` for advanced settings:

```cfg
// Server name
hostname "My Team Fortress 2 Server"

// RCON password
rcon_password "your_secure_password"

// Server password (leave empty for public)
sv_password ""

// Game settings
mp_timelimit 30
mp_maxrounds 5
tf_weapon_criticals 1
```

## FAQs

### How do I host a private server?

Set a server password in your configuration:
```cfg
sv_password "your_password"
```

### How do I change the server name?

Edit the `hostname` setting in `server.cfg`:
```cfg
hostname "Your Server Name Here"
```

### How do I set an RCON password?

Add the following to `server.cfg`:
```cfg
rcon_password "your_secure_rcon_password"
```

### Server not visible in browser?

1. Ensure port **27015** is forwarded properly
2. Check your Steam token is valid and properly configured
3. Verify the server is running without errors in the logs
4. Make sure `sv_lan 0` is set in your configuration

## Troubleshooting

### Common Issues

**Server Won't Start:**
- Verify Steam token is correct for App ID 440
- Check available disk space (minimum 10GB)
- Review container logs for error messages

**Players Can't Connect:**
- Confirm port forwarding is configured correctly
- Check firewall settings on router and server
- Ensure server is not set to LAN mode (`sv_lan 0`)

**Performance Issues:**
- Monitor CPU and RAM usage
- Reduce maximum players if experiencing lag
- Consider upgrading server hardware

### Log Analysis

```bash
# View container logs
docker logs tf2-server

# Follow logs in real-time
docker logs -f tf2-server
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
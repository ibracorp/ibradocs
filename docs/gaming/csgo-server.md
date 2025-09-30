---
title: "CS:GO Server"
sidebar_position: 3
description: "Unraid dedicated server hosting for Counter-Strike: Global Offensive"
tags: ["gaming", "ibracorp"]
source_url: https://docs.ibracorp.io/counterstrike-global-offensive/unraid-dedicated-server-hosting-for-counterstrike-global-offensive.md
---

# CS:GO Server

Unraid dedicated server hosting for Counter-Strike: Global Offensive

:::info CS:GO Dedicated Server
**Video**
[IBRACORP CS:GO Server Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [CS:GO Official Website](https://blog.counter-strike.net/)
- [Valve Developer Community](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Dedicated_Servers)

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

**CS:GO Dedicated Server Features:**

- Full Counter-Strike: Global Offensive multiplayer server
- Support for competitive and casual game modes
- Custom map support and workshop integration
- MetaMod and SourceMod plugin compatibility
- RCON remote administration
- Configurable round settings and gameplay options

## Prerequisites

**System Requirements:**

- **CPU:** 4+ cores (2.0GHz or higher)
- **RAM:** 6GB minimum
- **Storage:** 35GB available space
- **Network:** Stable internet connection with port forwarding capability
- **Steam Account:** Required for server token generation

## Installation

### Unraid Docker Template

**CS:GO Server / ich777's Repository / Gaming**

**Installation Steps:**

1. Head to the Community Applications store in Unraid
2. Search for and click to install **CS:GO Server** from **ich777's Repository**
3. If you are using a custom Docker network, select it in the 'Network Type' field
4. Enter the host port you want to map for the server. By default it is **27015**. Only change it if this port is already in use
5. **Generate Steam Token:**
   - Visit [Steam Token Generator](https://steamcommunity.com/dev/managegameservers)
   - Log in with your Steam account
   - Create a new token for App ID **740** (Counter-Strike: Global Offensive)
   - Copy the generated token
6. **Configure Container:**
   - Paste your Steam token in the **STEAMTOKEN** field
   - Set **GAMEMODE** to your preferred mode (competitive, casual, deathmatch)
   - Configure **MAXPLAYERS** (default: 10 for competitive, 20 for casual)
   - Set **TICKRATE** (64 or 128)
7. Click Apply and wait for the container to pull down and start
8. **Port Forwarding:** Forward port **27015** (UDP/TCP) on your router to your Unraid server

### Docker Compose

```yaml
version: '3.8'
services:
  csgo-server:
    image: ich777/steamcmd:csgo
    container_name: csgo-server
    restart: unless-stopped
    environment:
      - STEAMTOKEN=YOUR_STEAM_TOKEN_HERE
      - GAMEMODE=competitive
      - MAXPLAYERS=10
      - TICKRATE=128
      - MAPGROUP=mg_active
      - STARTMAP=de_dust2
      - PUID=1000
      - PGID=1000
    ports:
      - "27015:27015/tcp"
      - "27015:27015/udp"
    volumes:
      - ./csgo-data:/serverdata/steamcmd/csgo
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

1. The server will automatically download CS:GO files on first startup
2. Wait for the download to complete (this may take 30-60 minutes for full installation)
3. Once complete, your server will be available at `YOUR_SERVER_IP:27015`
4. Players can connect using the console command: `connect YOUR_SERVER_IP:27015`

**Game Modes:**
- **Competitive:** 5v5, MR15, 128-tick recommended
- **Casual:** 10v10, relaxed rules
- **Deathmatch:** Free-for-all combat
- **Arms Race:** Gun progression mode

## Server Configuration

### Basic Server Settings

**Server Configuration (`server.cfg`):**
```cfg
// Server name and info
hostname "My CS:GO Server"
sv_contact "admin@myserver.com"
sv_tags "128tick,competitive"

// RCON settings
rcon_password "your_secure_rcon_password"

// Network settings
sv_lan 0
sv_region 3
sv_pure 1

// Game settings
mp_autoteambalance 1
mp_limitteams 1
mp_roundtime 1.92
mp_freezetime 15
mp_maxmoney 16000
mp_startmoney 800
```

### Competitive Settings

```cfg
// Competitive mode
game_type 0
game_mode 1
mapgroup "mg_active"
map "de_dust2"

// Round settings
mp_maxrounds 30
mp_overtime_enable 1
mp_overtime_maxrounds 6
mp_overtime_startmoney 10000

// Buying settings
mp_buytime 20
mp_buy_anywhere 0
mp_buy_during_immunity 0
```

## Server Modification

### Adding Custom Maps

1. **Workshop Maps:**
   - Find the map's Workshop ID from the Steam Workshop URL
   - Add to your server startup: `+host_workshop_collection COLLECTION_ID`
   - Or use individual maps: `+workshop_start_map WORKSHOP_MAP_ID`

2. **Manual Map Installation:**
   - Navigate to `/serverdata/steamcmd/csgo/csgo/maps/`
   - Upload your custom map files (`.bsp`, `.nav`, `.txt`)
   - Add map to `maplist.txt` or `mapcycle.txt`

### MetaMod & SourceMod Installation

**MetaMod Setup:**
1. Download MetaMod:Source from [official website](https://www.sourcemm.net/)
2. Extract files to `/serverdata/steamcmd/csgo/csgo/`
3. Add the following line to `/serverdata/steamcmd/csgo/csgo/gameinfo.txt`:
   ```
   Game    |gameinfo_path|addons/metamod
   ```

**SourceMod Setup:**
1. Download SourceMod from [official website](https://www.sourcemod.net/)
2. Extract files to `/serverdata/steamcmd/csgo/csgo/`
3. Restart server to load plugins
4. Access admin menu in-game with `sm_admin`

### Popular Plugins

- **Retakes** - Retake practice scenarios
- **Multi-1v1** - Multiple 1v1 arenas
- **Executes** - Team execute practice
- **WarMod** - Competition management
- **Knife Round** - Knife round for side selection

## Configuration Options

### Server Settings

| Setting | Description | Default | Values |
|---------|-------------|---------|--------|
| `GAMEMODE` | Game mode type | `competitive` | `competitive`, `casual`, `deathmatch` |
| `MAXPLAYERS` | Maximum players | `10` | `10`, `20`, `32` |
| `TICKRATE` | Server tick rate | `64` | `64`, `128` |
| `MAPGROUP` | Map group | `mg_active` | `mg_active`, `mg_reserves` |
| `STARTMAP` | Starting map | `de_dust2` | Any valid map name |

### Advanced Configuration

**Performance Optimization:**
```cfg
// CPU optimization
host_thread_mode 2
cl_threaded_bone_setup 1
mat_queue_mode 2
r_threaded_renderables 1

// Network optimization
rate 786432
sv_maxrate 786432
sv_minrate 196608
sv_mincmdrate 128
sv_maxcmdrate 128
```

## Admin Management

### Setting Up Admins

1. **SourceMod Admins:**
   - Edit `/serverdata/steamcmd/csgo/csgo/addons/sourcemod/configs/admins_simple.ini`
   - Add admin Steam IDs:
   ```ini
   "STEAM_1:0:12345678" "z" // Full admin access
   ```

2. **RCON Access:**
   - Connect to server
   - Open console and type: `rcon_password your_password`
   - Use RCON commands: `rcon status`, `rcon changelevel de_mirage`

### Admin Commands

```bash
# Map management
rcon changelevel de_mirage
rcon mp_restartgame 1

# Player management
rcon kick "PlayerName"
rcon ban "PlayerName"
rcon status

# Server control
rcon exec server.cfg
rcon mp_pause_match
rcon mp_unpause_match
```

## Troubleshooting

### Common Issues

**Server Won't Start:**
- Verify Steam token is correct for App ID 740
- Check available disk space (minimum 35GB)
- Review container logs for download progress

**Players Can't Connect:**
- Confirm port forwarding for 27015 TCP/UDP
- Check `sv_lan` is set to `0`
- Ensure Steam token is valid and active

**Performance Issues:**
- Use 64-tick for casual servers, 128-tick for competitive
- Monitor CPU usage during matches
- Reduce player count if experiencing lag

**Map Issues:**
- Verify custom maps are properly installed
- Check Workshop collection IDs are correct
- Ensure map files have correct permissions

### Log Analysis

```bash
# View container logs
docker logs csgo-server

# Follow logs in real-time
docker logs -f csgo-server

# Server console logs
tail -f ./csgo-data/csgo/console.log
```

## Match Configuration

### Competitive Match Setup

```cfg
// Warmup settings
mp_warmup_pausetimer 0
mp_warmuptime 300
mp_warmuptime_all_players_connected 60

// Match settings
mp_maxrounds 30
mp_match_can_clinch 1
mp_match_end_changelevel 1

// Economy settings
mp_maxmoney 16000
mp_startmoney 800
mp_round_restart_delay 5
```

### Practice Configuration

```cfg
// Practice mode settings
sv_cheats 1
mp_limitteams 0
mp_autoteambalance 0
mp_maxmoney 16000
mp_startmoney 16000
mp_buytime 9999
mp_buy_anywhere 1
mp_freezetime 0
mp_roundtime 60
mp_roundtime_defuse 60
ammo_grenade_limit_total 5
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
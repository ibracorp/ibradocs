---
title: "Traefik"
sidebar_position: 2
description: "Modern reverse proxy and load balancer with automatic service discovery"
tags: ["reverse-proxies", "ibracorp"]
source_url: https://docs.ibracorp.io/traefik/
---

# Traefik

Modern reverse proxy and load balancer with automatic service discovery for your Docker containers on Unraid.

Traefik sits in front of your apps and routes requests based on hostnames (e.g. `sonarr.example.com`) or paths. It integrates directly with Docker, so new containers are picked up automatically using labels.

---

## Features

- Automatic discovery of Docker containers via labels
- HTTP and HTTPS entrypoints (`web` / `websecure`)
- Let’s Encrypt support (HTTP-01 or DNS with Cloudflare)
- Central dashboard to inspect routers, services, and middlewares
- Works with other IBRACORP guides such as:
  - Authelia / Authentik for authentication
  - SWAG / Nginx Proxy Manager for alternative setups

---

## Prerequisites

Before you start, you should have:

- Unraid 6.12 or newer
- A domain name (e.g. `example.com`)
- Public DNS that you control (Cloudflare recommended)
- Optional but recommended:
  - Cloudflare API token with DNS edit permissions for your zone (for DNS)
  - Either:
    - Port forwarding from your router (80/443 → Unraid),
    - **or** Cloudflare Tunnel pointing to Traefik on Unraid:contentReference[oaicite:2]{index=2}

---

## 1. Install Traefik from Community Applications

1. In Unraid, go to **Apps**.
2. Search for **Traefik (IBRACORP)**.
3. Click **Install**.

You’ll see fields coming from the `traefik.xml` template:

- **Config Folder**  
  - Default: `/mnt/user/appdata/traefik`  
  - This will contain `traefik.yml` and any dynamic config files.
- **Docker Socket**  
  - Default: `/var/run/docker.sock` (read-only)  
  - Required for Docker provider and automatic discovery.
- **HTTP Port (external)**  
  - Default: `8001` → Container port `80`  
  - Traefik’s `web` entrypoint.  
  - If using port forwarding, forward external port 80 → `UNRAID-IP:8001`.
  - If using Cloudflare Tunnel, set the origin URL to `http://UNRAID-IP:8001`.
- **HTTPS Port (external, optional)**  
  - Default: `44301` → Container port `443`  
  - Traefik’s `websecure` entrypoint (for TLS termination in Traefik).
- **Web UI Port (LAN/VPN)**  
  - Default: `8183` → Container port `8080`  
  - Traefik dashboard at: `http://UNRAID-IP:8183`.
- **Cloudflare API Token (optional)**  
  - Only required if you use Cloudflare DNS for Let’s Encrypt certificates.

Click **Apply** to create the container. It will start, but you still need to add the configuration file.

---

## 2. Create `traefik.yml` (static configuration)

Traefik uses a static config file that is read at startup. The template is set to use:

> `/mnt/user/appdata/traefik/traefik.yml` → `/etc/traefik/traefik.yml` in the container.

On your Unraid server:

1. Open a terminal (SSH or WebTerminal).
2. Create the file:

```bash
mkdir -p /mnt/user/appdata/traefik
nano /mnt/user/appdata/traefik/traefik.yml

global:
  sendAnonymousUsage: false

log:
  level: INFO

accessLog: {}

api:
  dashboard: true
  insecure: true        # Dashboard via http://UNRAID-IP:8183 (LAN/VPN only)

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    # IMPORTANT: This should be set to the name of your proxy network
    # (e.g. "proxynet" or "dockernetwork"). Update this after you
    # attach Traefik and your apps to the same custom Docker network.
    network: "proxynet"
  file:
    directory: "/etc/traefik/dynamic"
    watch: true
```

Restart the Traefik container from the Docker tab.

You should now be able to reach the dashboard on your LAN: `http://UNRAID-IP:8183`

The dashboard will show entrypoints and providers but no routers/services yet. Those appear when you add labels to your app containers.

### 3. (Optional) Enable Cloudflare DNS for HTTPS

If you want Traefik to request Let’s Encrypt certificates using Cloudflare DNS:

- Create a Cloudflare API token with:
  - Permissions: Zone → DNS → Edit
  - Scope: Your domain’s zone
- Put the token value into the Cloudflare API Token field in the Traefik container template (this sets the `CF_DNS_API_TOKEN` environment variable).
- Edit traefik.yml and add:

```bash
certificatesResolvers:
  cloudflare:
    acme:
      email: "you@example.com"               # change this
      storage: "/etc/traefik/acme.json"
      dnsChallenge:
        provider: "cloudflare"
        delayBeforeCheck: 0
```

### 4. Unraid ACME File

On Unraid, create the ACME storage file and set permissions:

```bash
touch /mnt/user/appdata/traefik/acme.json
chmod 600 /mnt/user/appdata/traefik/acme.json
```

Restart the Traefik container.

Later, for any router that should use HTTPS, you can add labels such as:

```bash
traefik.http.routers.myapp.entrypoints=websecure
traefik.http.routers.myapp.tls.certresolver=cloudflare
```

Traefik will then create certificates via Cloudflare DNS automatically.

### 5. Expose your first container (EXAMPLE Jellyfish)

On the Jellyfin container (attached to proxynet), add labels:

```bash
traefik.enable=true

traefik.http.routers.jellyfin.rule=Host(`jellyfin.example.com`)
traefik.http.routers.jellyfin.entrypoints=websecure
traefik.http.routers.jellyfin.tls.certresolver=cloudflare

traefik.http.services.jellyfin.loadbalancer.server.port=8096
```

- `server.port` is Jellyfin’s internal port.
- This assumes you’ve enabled the Cloudflare `certificatesResolver` in `traefik.yml`.

### 6. Securing the Traefik dashboard

By default, the dashboard is available only on:

`http://UNRAID-IP:8183`

For most setups, LAN/VPN-only access is fine. If you want to expose the dashboard on a domain (e.g. traefik.example.com), you must protect it with authentication.

One approach is to use a file provider and basic auth middleware.

Using the terminal in Unraid create the dynamic config directory:

```bash
mkdir -p /mnt/user/appdata/traefik/dynamic
nano /mnt/user/appdata/traefik/dynamic/dashboard.yml
```

Paste the following:

```bash
http:
  routers:
    traefik-dashboard:
      rule: Host(`traefik.example.com`)
      entryPoints:
        - websecure
      service: api@internal
      middlewares:
        - dashboard-auth

  middlewares:
    dashboard-auth:
      basicAuth:
        users:
          - "admin:$2y$05$REPLACE_WITH_BCRYPT_HASH"
```

You can generate a bcrypt hash with a tool like `htpasswd` or an online generator.

Restart the Traefik container.

Now https://traefik.example.com will:

- Route to `api@internal` (the dashboard),
- Prompt for the `admin` username and your password.

### 7. (Optional) Using Traefik with Cloudflare Tunnel 

If you prefer not to open any ports on your router, you can use Cloudflare Tunnel:

- Create a Tunnel from your Cloudflare account.
- For each hostname, set the origin URL to:

`http://UNRAID-IP:8001`

Traefik will receive HTTP traffic on its `web` entrypoint. From Traefik’s perspective, this is the same as direct port forwarding; routing and TLS (if used) are unchanged.

You can still:

- Use DNS for full end-to-end TLS in Traefik, or
- Let Cloudflare terminate TLS and keep HTTP between Cloudflare and Traefik.
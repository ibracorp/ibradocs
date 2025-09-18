---
title: "Proxmox VE with ZFS"
sidebar_position: 1
description: "Complete guide to installing Proxmox VE virtualization platform with ZFS storage on Unraid for enterprise-grade virtual machine management."
tags: [servers, proxmox, virtualization, zfs, storage, ibracorp]
---

# Proxmox VE with ZFS

Complete guide to installing Proxmox VE virtualization platform with ZFS storage on Unraid for enterprise-grade virtual machine management.

:::info Proxmox VE Virtualization Platform
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Official Documentation](https://pve.proxmox.com/wiki/Main_Page)
- [Proxmox VE Website](https://www.proxmox.com/en/proxmox-ve)
- [ZFS Documentation](https://openzfs.org/wiki/Main_Page)

**Related Videos**
- Virtual Machine Management
- Storage Configuration
- Network Setup
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
| Contributor | DiscDuck |
| Testing / Proofreading | Hawks, North |

## Feature List

**Comprehensive Virtualization Platform**

- **Virtual Machine Management** with web-based interface
- **Container Support** with LXC containers
- **ZFS Storage Integration** with snapshots and replication
- **High Availability Clustering** for enterprise environments
- **Backup and Restore** with automated scheduling
- **Network Management** with software-defined networking
- **Role-based Access Control** for multi-user environments
- **API Integration** for automation and monitoring
- **Live Migration** of VMs between cluster nodes
- **Storage Replication** for disaster recovery
- **Web Console Access** for remote management
- **Template System** for rapid VM deployment

## Prerequisites

**Hardware Requirements**

- CPU with virtualization extensions (Intel VT-x or AMD-V)
- Minimum 2GB RAM (8GB+ recommended)
- 32GB+ storage for Proxmox OS
- Additional storage for ZFS pool (3+ drives recommended)
- Network connectivity
- UEFI/BIOS with virtualization enabled

**Software Requirements**

- Unraid server (if installing as VM)
- Proxmox VE ISO (version 7.0 or later)
- Basic understanding of virtualization concepts
- SSH client for command-line access

## Installation

### Download Proxmox VE ISO

1. **Download ISO**: Visit [Proxmox Downloads](https://www.proxmox.com/en/downloads)
2. **Select Version**: Download latest stable Proxmox VE ISO
3. **Place ISO**: Copy to your Unraid's `/mnt/user/isos/` directory

### VM Creation on Unraid

**Create Proxmox VM**

1. **Enable VM Manager**: In Unraid, go to Settings → VM Manager and enable VMs
2. **Create New VM**: Click "Add VM" and select "Linux"
3. **VM Configuration**:
   ```
   Name: Proxmox-VE
   Template: Debian
   CPU: 2+ threads (4+ recommended)
   Initial Memory: 2048MB (4096MB+ recommended)
   Max Memory: Match initial memory
   ```

4. **Storage Configuration**:
   - **vDisk 1**: 32GB (Proxmox OS)
   - **vDisk 2**: 100GB (ZFS Pool Member 1)
   - **vDisk 3**: 100GB (ZFS Pool Member 2)
   - **vDisk 4**: 100GB (ZFS Pool Member 3)

5. **Network Settings**:
   ```
   Network Source: br0 (or your bridge)
   Network Model: VirtIO (paravirtualized)
   ```

6. **Graphics**: VNC for installation, can be changed later

### Proxmox VE Installation Process

**Boot and Install**

1. **Start VM**: Boot from Proxmox VE ISO
2. **Installation Menu**: Select "Install Proxmox VE"
3. **Accept EULA**: Read and accept the End User License Agreement
4. **Target Harddisk**: Select the 32GB disk for Proxmox installation
5. **Location and Time Zone**: Configure your geographic settings
6. **Administration Password**: Set strong root password
7. **Network Configuration**:
   ```
   Hostname: pve.yourdomain.local
   IP Address: 192.168.1.100/24 (adjust for your network)
   Gateway: 192.168.1.1
   DNS Server: 8.8.8.8
   ```

8. **Summary**: Review settings and confirm installation
9. **Installation**: Wait for installation to complete (5-10 minutes)
10. **Reboot**: Remove ISO and restart VM

## Initial Configuration

### First Boot Setup

1. **Access Web Interface**: Open browser to `https://your-proxmox-ip:8006`
2. **Login**: Use `root` and the password set during installation
3. **Accept Certificate**: Add security exception for self-signed certificate

### Repository Configuration

**Switch to No-Subscription Repository**

1. **Access Shell**: Click on your node → Shell
2. **Edit Sources**:
   ```bash
   nano /etc/apt/sources.list.d/pve-enterprise.list
   ```
3. **Comment Enterprise Repo**: Add `#` before the line:
   ```bash
   # deb https://enterprise.proxmox.com/debian/pve bullseye pve-enterprise
   ```

4. **Add No-Subscription Repo**:
   ```bash
   echo "deb http://download.proxmox.com/debian/pve bullseye pve-no-subscription" >> /etc/apt/sources.list
   ```

5. **Update Package Lists**:
   ```bash
   apt update
   ```

### System Updates

**Update Proxmox**

```bash
# Update package database
apt update

# Upgrade system packages
apt full-upgrade -y

# Reboot to apply kernel updates
reboot
```

## ZFS Configuration

### Create ZFS Pool

**Set Up RAIDZ-1 Pool**

1. **Access Shell**: Log into Proxmox shell
2. **Identify Disks**: List available disks:
   ```bash
   lsblk
   fdisk -l
   ```

3. **Create ZFS Pool**: Create RAIDZ-1 with three disks:
   ```bash
   zpool create -f storage raidz /dev/sdb /dev/sdc /dev/sdd
   ```

4. **Verify Pool**: Check pool status:
   ```bash
   zpool status
   zpool list
   ```

5. **Set Pool Properties**:
   ```bash
   # Enable compression
   zfs set compression=lz4 storage

   # Set deduplication (optional, uses more RAM)
   zfs set dedup=on storage

   # Set auto-snapshots
   zfs set com.sun:auto-snapshot=true storage
   ```

### Add Storage to Proxmox

**Configure ZFS Storage in Web Interface**

1. **Navigate to Storage**: Datacenter → Storage
2. **Add ZFS**: Click Add → ZFS
3. **Configuration**:
   ```
   ID: zfs-storage
   ZFS Pool: storage
   Content: Disk image, Container, VZDump backup file
   Nodes: Select your Proxmox node
   ```

4. **Enable**: Check "Enabled" and click Add

### ZFS Management Commands

**Useful ZFS Commands**

```bash
# Check pool health
zpool status -v

# View pool I/O statistics
zpool iostat -v 2

# Create snapshot
zfs snapshot storage@backup-$(date +%Y%m%d)

# List snapshots
zfs list -t snapshot

# Rollback to snapshot
zfs rollback storage@backup-20231201

# Destroy snapshot
zfs destroy storage@backup-20231201

# Check filesystem usage
zfs list

# Set quotas
zfs set quota=50G storage/vm-disk

# Monitor ZFS ARC
arc_summary
```

## VM and Container Management

### Creating Virtual Machines

**Create VM from Web Interface**

1. **Click Create VM**: Top right corner
2. **General Tab**:
   - VM ID: Auto-assigned or custom
   - Name: Descriptive name
   - Resource Pool: Optional

3. **OS Tab**:
   - ISO Image: Select from uploaded ISOs
   - Guest OS Type: Match your OS

4. **System Tab**:
   - BIOS: UEFI (recommended for modern OSes)
   - Machine: Default (q35)

5. **Hard Disk Tab**:
   - Bus/Device: SCSI (VirtIO SCSI)
   - Storage: zfs-storage
   - Disk size: As needed
   - Cache: Write back (unsafe)

6. **CPU Tab**:
   - Cores: Based on requirements
   - Type: host (best performance)

7. **Memory Tab**:
   - Memory: Set based on guest requirements
   - Ballooning: Enable for dynamic allocation

8. **Network Tab**:
   - Bridge: vmbr0
   - Model: VirtIO (paravirtualized)

### LXC Container Creation

**Create Linux Container**

1. **Click Create CT**: Next to Create VM
2. **General**:
   - CT ID: Auto or custom
   - Hostname: Container name
   - Password: Root password

3. **Template**:
   - Storage: local
   - Template: Choose from available

4. **Disks**:
   - Storage: zfs-storage
   - Disk size: Container requirements

5. **CPU**: Set core allocation
6. **Memory**: Set RAM and swap
7. **Network**: Configure as needed

## Advanced Configuration

### High Availability Setup

**Cluster Configuration**

```bash
# Create cluster (on first node)
pvecm create cluster-name

# Add node to cluster (on additional nodes)
pvecm add existing-cluster-ip

# Check cluster status
pvecm status
```

### Backup Configuration

**Automatic Backup Setup**

1. **Navigate**: Datacenter → Backup
2. **Add Backup Job**:
   - Storage: Select backup storage
   - Schedule: Cron format or preset
   - Mode: Snapshot, Suspend, or Stop
   - Compression: LZO or GZIP

3. **Backup Script Example**:
   ```bash
   #!/bin/bash
   # Backup all VMs
   vzdump --all --mode snapshot --storage zfs-storage --compress lzo
   ```

### Network Configuration

**Advanced Networking**

```bash
# Edit network configuration
nano /etc/network/interfaces

# Example bridge configuration
auto vmbr1
iface vmbr1 inet static
    address 10.0.0.1/24
    bridge-ports none
    bridge-stp off
    bridge-fd 0
    post-up iptables -t nat -A POSTROUTING -s '10.0.0.0/24' -o vmbr0 -j MASQUERADE
    post-down iptables -t nat -D POSTROUTING -s '10.0.0.0/24' -o vmbr0 -j MASQUERADE
```

### Storage Management

**Additional Storage Types**

```bash
# Add directory storage
pvesm add dir local-storage --path /mnt/extra-storage --content backup,iso

# Add NFS storage
pvesm add nfs nfs-storage --server 192.168.1.200 --export /volume1/proxmox --content backup,iso

# Add iSCSI storage
pvesm add iscsi iscsi-storage --portal 192.168.1.201 --target iqn.2021-01.local.storage:target1
```

## Monitoring and Maintenance

### Performance Monitoring

**System Monitoring Commands**

```bash
# CPU and memory usage
htop

# Disk I/O monitoring
iotop

# Network monitoring
iftop

# ZFS pool monitoring
zpool iostat -v 2

# VM resource usage
qm list
pct list
```

### Maintenance Tasks

**Regular Maintenance**

```bash
# Update Proxmox
apt update && apt upgrade

# Clean old kernels
apt autoremove

# Check ZFS pool health
zpool scrub storage

# Backup configuration
tar -czf /root/proxmox-backup-$(date +%Y%m%d).tar.gz /etc/pve

# Log rotation
logrotate -f /etc/logrotate.conf
```

## Troubleshooting

### Common Issues

**Boot Problems**

1. **Grub Issues**: Boot from rescue mode and reinstall:
   ```bash
   grub-install /dev/sda
   update-grub
   ```

2. **ZFS Import Failures**: Force import pool:
   ```bash
   zpool import -f storage
   ```

**Network Issues**

1. **Bridge Configuration**: Verify bridge settings:
   ```bash
   ip link show
   brctl show
   ```

2. **VM Network Problems**: Check VM network configuration and restart networking

**Storage Issues**

1. **ZFS Pool Degraded**: Check disk health:
   ```bash
   zpool status -v
   smartctl -a /dev/sdb
   ```

2. **Storage Full**: Clean old backups and snapshots:
   ```bash
   zfs list -t snapshot
   zfs destroy storage@old-snapshot
   ```

### Recovery Procedures

**Emergency Recovery**

1. **Boot from Live CD**: Use Proxmox installer in rescue mode
2. **Mount ZFS Pool**: Import and mount existing pool
3. **Restore Configuration**: Copy `/etc/pve` from backup
4. **Rebuild Boot**: Reinstall bootloader if needed

## Security Best Practices

### Access Control

**User Management**

1. **Create Users**: Avoid using root for daily operations
2. **Role Assignment**: Use built-in roles or create custom ones
3. **Two-Factor Authentication**: Enable 2FA for additional security
4. **API Tokens**: Use tokens instead of passwords for automation

### Network Security

**Firewall Configuration**

```bash
# Enable firewall
pve-firewall start

# Configure rules in web interface:
# Datacenter → Firewall → Options → Enable
```

### SSL Certificates

**Custom SSL Certificate**

```bash
# Generate certificate request
openssl req -new -nodes -keyout /etc/pve/local/pve-ssl.key -out /etc/pve/local/pve-ssl.csr

# Install certificate
cp your-certificate.crt /etc/pve/local/pve-ssl.pem
systemctl restart pveproxy
```

## Special Thanks

- **Proxmox Team** for creating this excellent virtualization platform
- **OpenZFS Community** for the robust ZFS filesystem
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
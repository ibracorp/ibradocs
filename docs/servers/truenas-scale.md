---
title: "TrueNAS Scale"
sidebar_position: 2
description: "Advanced TrueNAS Scale installation with single-drive optimization for cache and write intent log configuration in lab environments."
tags: [servers, truenas, zfs, storage, nas, ibracorp]
---

# TrueNAS Scale

Advanced TrueNAS Scale installation with single-drive optimization for cache and write intent log configuration in lab environments.

:::info TrueNAS Scale Network Attached Storage
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Official Documentation](https://www.truenas.com/docs/scale/)
- [TrueNAS Scale Website](https://www.truenas.com/truenas-scale/)
- [TrueNAS Community](https://www.truenas.com/community/)

**Related Videos**
- ZFS Pool Configuration
- Storage Management
- Container Deployment
:::

:::danger Important Disclaimer
**⚠️ Advanced Configuration Warning**

The method described in this guide allows using a single drive as:
- TrueNAS Scale boot device
- ZFS cache device (L2ARC)
- ZFS write intent log (ZIL/SLOG)

**This configuration is:**
- ❌ **NOT officially supported by TrueNAS**
- ❌ **NOT recommended for production environments**
- ⚠️ **Only suitable for lab/testing installations**
- 💾 **Requires SSD storage (NOT mechanical drives)**

Use at your own risk and ensure you have proper backups!
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
| Contributor | DiscDuck, Hawks |
| Testing / Proofreading | North |

## Feature List

**Comprehensive NAS and Storage Platform**

- **ZFS Storage Management** with advanced features
- **Kubernetes Integration** for container workloads
- **TrueCharts Applications** for easy service deployment
- **SMB/NFS Sharing** for network file access
- **Snapshot Management** with automated scheduling
- **Replication Services** for backup and disaster recovery
- **User and Group Management** with ACL support
- **Plugin System** for extended functionality
- **Web-based Management** interface
- **REST API** for automation and integration
- **Virtual Machine Support** with KVM
- **Monitoring and Alerting** system
- **Enterprise Features** in open-source package

## Prerequisites

**Hardware Requirements**

- **CPU**: 64-bit processor with virtualization support
- **RAM**: 8GB minimum (16GB+ recommended for VMs/containers)
- **Storage**:
  - Boot device: 16GB+ SSD (32GB+ recommended)
  - Data drives: As needed for storage pool
- **Network**: Gigabit Ethernet (10GbE recommended for high performance)

**Software Requirements**

- TrueNAS Scale ISO (latest stable version)
- Basic understanding of ZFS concepts
- Network configuration knowledge
- SSH client for advanced configuration

## Standard Installation

### Download and Prepare

1. **Download TrueNAS Scale**: Visit [TrueNAS Downloads](https://www.truenas.com/download-truenas-scale/)
2. **Create Bootable Media**: Use Rufus, Balena Etcher, or dd command
3. **Boot from USB**: Configure BIOS/UEFI to boot from USB

### Installation Process

**Standard Installation Steps**

1. **Boot Menu**: Select "Install/Upgrade" from boot menu
2. **Welcome Screen**: Press Enter to continue
3. **Select Installation Drive**: Choose your boot device
4. **Admin User Setup**:
   - Username: admin (default)
   - Password: Set strong password
   - Confirm password

5. **Installation**: Wait for installation to complete
6. **Reboot**: Remove installation media and reboot
7. **Network Configuration**: Configure via console or DHCP
8. **Web Access**: Access via `http://truenas-ip-address`

## Advanced Single-Drive Installation

### Custom Installation Method

This method allows using a single SSD for boot, cache, and ZIL/SLOG.

**⚠️ WARNING: This modifies the TrueNAS installer and is unsupported!**

### Pre-Installation Setup

**Boot to Shell**

1. **Boot from ISO**: Start TrueNAS Scale installer
2. **Access Shell**: Press `Alt + F2` or select "Shell" option
3. **Switch to Bash**:
   ```bash
   bash
   ```

4. **Navigate to Installer**:
   ```bash
   cd /usr/sbin/
   ```

### Modify Installation Script

**Edit TrueNAS Installer**

1. **Backup Original Installer**:
   ```bash
   cp truenas-install truenas-install.backup
   ```

2. **Edit Installer Script**:
   ```bash
   vi truenas-install
   ```

3. **Find Boot Pool Configuration**: Look for the section that creates the boot pool (around line 400-500)

4. **Modify Boot Pool Creation**: Change the boot pool configuration to allow additional partitions:
   ```bash
   # Original line (approximate):
   # zpool create -f -o cachefile=/tmp/zpool.cache boot-pool ${BOOT_DEVICE}2

   # Modified line to allow more partitions:
   zpool create -f -o cachefile=/tmp/zpool.cache boot-pool ${BOOT_DEVICE}2
   ```

5. **Save and Exit**: Press `Esc`, type `:wq`, press Enter

### Run Modified Installation

**Execute Custom Installation**

1. **Run Modified Installer**:
   ```bash
   ./truenas-install
   ```

2. **Follow Installation Prompts**:
   - Select installation drive (your SSD)
   - Choose "Fresh Install"
   - Create admin password
   - Complete installation

3. **Do NOT Create Swap**: When prompted, skip swap partition creation

4. **Reboot**: Complete installation and reboot

### Post-Installation Configuration

**Create Additional Partitions**

1. **Boot into TrueNAS**: Complete initial setup
2. **Enable SSH**: System → General → SSH (for easier command execution)
3. **SSH into TrueNAS**: Connect as admin user
4. **Switch to Root**:
   ```bash
   sudo -i
   ```

### Partition Management

**Add Cache and ZIL Partitions**

1. **Check Current Partitions**:
   ```bash
   sgdisk -p /dev/sda
   ```

2. **Add Cache Partition** (Partition 4):
   ```bash
   sgdisk -n4:0:+8G -t4:BF01 /dev/sda
   ```

3. **Add ZIL/SLOG Partition** (Partition 5):
   ```bash
   sgdisk -n5:0:+2G -t5:BF01 /dev/sda
   ```

4. **Update Kernel Partition Table**:
   ```bash
   partprobe
   ```

5. **Verify Partitions**:
   ```bash
   sgdisk -p /dev/sda
   lsblk
   ```

### ZFS Pool Configuration

**Add Cache and ZIL to Storage Pool**

1. **Create Storage Pool** (via Web UI first):
   - Navigate to Storage → Pools
   - Create your main data pool with available drives

2. **Add Cache Device**:
   ```bash
   zpool add [your-pool-name] cache /dev/sda4
   ```

3. **Add ZIL/SLOG Device**:
   ```bash
   zpool add [your-pool-name] log /dev/sda5
   ```

4. **Verify Configuration**:
   ```bash
   zpool status [your-pool-name]
   ```

### Example Commands

**Useful Partition Commands**

```bash
# View partition table
sgdisk -p /dev/sda

# Delete a partition (if needed)
sgdisk -d 4 /dev/sda

# List all block devices
lsblk

# Check ZFS pool status
zpool status

# Remove cache device (if needed)
zpool remove [pool-name] /dev/sda4

# Remove log device (if needed)
zpool remove [pool-name] /dev/sda5
```

## Standard Configuration

### Initial Setup

**Web Interface Setup**

1. **Access Web UI**: Navigate to `http://truenas-ip`
2. **Login**: Use admin credentials created during installation
3. **Initial Configuration Wizard**:
   - Set timezone
   - Configure NTP servers
   - Set up email notifications
   - Configure network settings

### Network Configuration

**Network Setup**

1. **Navigate**: Network → Interfaces
2. **Configure Interface**:
   ```
   Interface: em0 (or your network interface)
   Type: Static IP or DHCP
   IP Address: 192.168.1.100/24
   Gateway: 192.168.1.1
   DNS Servers: 8.8.8.8, 1.1.1.1
   ```

3. **Apply Configuration**: Test and apply changes

### Storage Pool Creation

**Create ZFS Pool**

1. **Navigate**: Storage → Pools
2. **Create Pool**: Click "Add"
3. **Pool Configuration**:
   - Name: tank (or your preferred name)
   - Select drives for pool
   - Choose RAID level (RAIDZ-1, RAIDZ-2, or mirror)

4. **Advanced Options**:
   - Encryption: Enable if needed
   - Compression: LZ4 (recommended)
   - Deduplication: Usually not recommended

### Dataset Management

**Create Datasets**

1. **Navigate**: Storage → Pools → [Your Pool]
2. **Add Dataset**: Click "Add Dataset"
3. **Dataset Configuration**:
   ```
   Name: documents
   Compression: LZ4
   Quota: Optional
   Snapshot Directory: Visible
   ```

### Share Configuration

**SMB/CIFS Shares**

1. **Navigate**: Sharing → Windows (SMB) Shares
2. **Add Share**:
   ```
   Path: /mnt/tank/documents
   Name: documents
   Purpose: Default share parameters
   ```

3. **Configure ACL**: Set appropriate permissions
4. **Start SMB Service**: Services → SMB

**NFS Shares**

1. **Navigate**: Sharing → Unix (NFS) Shares
2. **Add Share**:
   ```
   Path: /mnt/tank/documents
   Networks: 192.168.1.0/24
   ```

3. **Start NFS Service**: Services → NFS

## Advanced Features

### Kubernetes and Applications

**Enable Kubernetes**

1. **Navigate**: Apps → Settings
2. **Choose Pool**: Select pool for Kubernetes
3. **Configure**: Set resource limits
4. **Install**: Wait for Kubernetes deployment

**TrueCharts Integration**

1. **Add Catalog**: Apps → Manage Catalogs
2. **Add TrueCharts**:
   ```
   Catalog Name: truecharts
   Repository: https://github.com/truecharts/catalog
   Branch: main
   ```

3. **Browse Apps**: Install applications from TrueCharts

### Snapshot and Replication

**Automated Snapshots**

1. **Navigate**: Tasks → Periodic Snapshot Tasks
2. **Create Task**:
   ```
   Dataset: tank/documents
   Recursive: Yes
   Snapshot Lifetime: 1 month
   Schedule: Daily at 2:00 AM
   ```

**Replication Setup**

1. **Navigate**: Tasks → Replication Tasks
2. **Create SSH Connection**: To destination TrueNAS
3. **Configure Replication**:
   ```
   Source: Local datasets
   Destination: Remote TrueNAS
   Schedule: After snapshot creation
   ```

### User and Group Management

**Create Users**

1. **Navigate**: Accounts → Users
2. **Add User**:
   ```
   Username: john
   Full Name: John Doe
   Password: Strong password
   Primary Group: users
   Home Directory: /mnt/tank/home/john
   ```

**Configure Groups**

1. **Navigate**: Accounts → Groups
2. **Create Group**:
   ```
   Group Name: family
   GID: Auto-assign
   ```

3. **Add Users to Group**: Edit group membership

### Monitoring and Alerts

**Configure Alerts**

1. **Navigate**: System → Alert Services
2. **Add Email Service**:
   ```
   Name: email-alerts
   Type: Email
   SMTP Server: smtp.gmail.com
   Port: 587
   Security: TLS
   ```

**System Monitoring**

1. **Navigate**: Reporting
2. **View Metrics**:
   - CPU usage
   - Memory utilization
   - Network traffic
   - Storage I/O

## Troubleshooting

### Common Issues

**Boot Problems**

1. **Boot Device Full**: Clean old boot environments:
   ```bash
   beadm list
   beadm destroy old-environment-name
   ```

2. **Partition Table Corruption**: Restore from backup:
   ```bash
   sgdisk --backup=table.backup /dev/sda
   sgdisk --load-backup=table.backup /dev/sda
   ```

**Storage Issues**

1. **Pool Import Failure**: Force import:
   ```bash
   zpool import -f tank
   ```

2. **Cache/Log Device Errors**: Remove and re-add:
   ```bash
   zpool remove tank /dev/sda4
   zpool add tank cache /dev/sda4
   ```

**Network Problems**

1. **Web UI Inaccessible**: Check network configuration:
   ```bash
   ifconfig
   ping 8.8.8.8
   ```

2. **Share Access Issues**: Verify SMB/NFS services:
   ```bash
   systemctl status smbd
   systemctl status nfs-server
   ```

### Recovery Procedures

**Emergency Recovery**

1. **Boot from USB**: Use TrueNAS installer in shell mode
2. **Import Pool**: Import existing pools to recover data
3. **Backup Configuration**: Export system configuration
4. **Reinstall**: Fresh installation if needed

### Log Analysis

**System Logs**

```bash
# View system logs
tail -f /var/log/messages

# Check ZFS events
zpool events

# View SMB logs
tail -f /var/log/samba4/log.smbd

# Check pool scrub status
zpool status -v
```

## Best Practices

### Security

**Security Hardening**

1. **Change Default Passwords**: Use strong, unique passwords
2. **Enable 2FA**: Configure two-factor authentication
3. **Firewall Rules**: Restrict access to necessary ports
4. **Regular Updates**: Keep TrueNAS updated
5. **Backup Configuration**: Regular config backups

### Performance Optimization

**Performance Tips**

1. **SSD Cache**: Use SSDs for L2ARC cache
2. **Dedicated ZIL**: Separate ZIL/SLOG device
3. **Network Tuning**: Use 10GbE for high throughput
4. **Memory**: More RAM improves ZFS performance
5. **Pool Layout**: Choose appropriate RAID level

### Maintenance

**Regular Maintenance**

```bash
# Pool scrub (monthly)
zpool scrub tank

# Check disk health
smartctl -a /dev/sda

# Update system
truenas-update

# Monitor pool health
zpool status
```

## Special Thanks

- **iXsystems Team** for developing TrueNAS Scale
- **OpenZFS Community** for the excellent filesystem
- **DiscDuck** and **Hawks** for testing and feedback
- To our fantastic Discord community for their input and support

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
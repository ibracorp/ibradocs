---
title: "Virtual Unraid"
sidebar_position: 3
description: "Complete guide to creating a virtual Unraid server within an existing Unraid host system for testing and development purposes."
tags: [servers, unraid, virtualization, vm, testing, ibracorp]
---

# Virtual Unraid

Complete guide to creating a virtual Unraid server within an existing Unraid host system for testing and development purposes.

:::info Virtual Unraid Server
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Official Unraid Documentation](https://docs.unraid.net/)
- [Unraid Community Forums](https://forums.unraid.net/)
- [Unraid Website](https://unraid.net/)

**Related Videos**
- Unraid Server Setup
- Virtual Machine Management
- Storage Configuration
:::

:::danger Important Warnings
**⚠️ Data Loss Risk**

Creating a virtual Unraid server involves advanced configurations that can potentially cause:
- **Data loss** if misconfigured
- **System instability** on the host
- **License conflicts** between host and guest

**Before proceeding:**
- ✅ **Backup all important data**
- ✅ **Have recovery plans ready**
- ✅ **Test in non-production environment first**
- ✅ **Understand the risks involved**

This guide is intended for **testing and development purposes only**.
:::

:::warning Disclaimer
Thank you for choosing to collaborate with IBRACORP 🙏

Please read our disclaimer https://docs.ibracorp.io/disclaimer
:::

## Credits

| Role | Contributor |
|------|------------|
| Writer / Producer | DiscDuck |
| Video Recording and Voice | Sycotix |
| Contributor | Hawks |
| Testing / Proofreading | North, Sycotix |

## Feature List

**Virtual Unraid Capabilities**

- **Full Unraid Experience** within a virtual machine
- **Testing Environment** for new configurations
- **Development Platform** for plugin and Docker testing
- **Backup Unraid Instance** for disaster recovery testing
- **Learning Environment** without affecting production
- **License Testing** before hardware migration
- **Container Development** and testing platform
- **Storage Array Simulation** for planning
- **Plugin Development** environment
- **Docker Application Testing** without main server impact

## Prerequisites

**Host System Requirements**

- **Unraid 6.9.2 or later** on host system
- **Hardware Virtualization** enabled in BIOS/UEFI
- **IOMMU/VT-d support** enabled
- **Sufficient RAM**: 8GB+ for host, 4GB+ for virtual Unraid
- **CPU cores**: At least 4 cores (2 for host, 2 for VM)
- **Storage space**: 50GB+ for virtual Unraid
- **Spare USB stick**: For virtual Unraid license
- **Valid Unraid license**: Basic, Plus, or Pro

**Knowledge Requirements**

- Basic understanding of Unraid
- VM management experience
- USB preparation skills
- Network configuration knowledge

## USB Preparation

### Prepare Virtual Unraid USB

**Download and Prepare Unraid**

1. **Download Unraid**: Get latest version from [unraid.net](https://unraid.net/download)
2. **Format USB Stick**: Use FAT32 file system
3. **Extract Unraid Files**: Extract downloaded ZIP to USB root

### Modify Boot Configuration

**Edit syslinux.cfg**

1. **Navigate to USB**: Open USB drive in file explorer
2. **Open syslinux folder**: Find syslinux.cfg file
3. **Edit Configuration**: Open in text editor

**Add Custom Boot Parameters**:

```bash
# Original append line (example):
append initrd=/bzroot

# Modified append line for virtual environment:
append initrd=/bzroot pcie_acs_override=downstream,multifunction vfio-pci.ids=
```

**Alternative Boot Menu Entry**:

```bash
label Unraid OS (Virtual)
  menu default
  kernel /bzimage
  append initrd=/bzroot pcie_acs_override=downstream,multifunction acpi=off
```

### Make USB Bootable

**Install Bootloader**

1. **Run make_bootable script**:
   - Windows: Run `make_bootable.bat` as administrator
   - Linux/Mac: Run `make_bootable_linux` or `make_bootable_mac`

2. **Alternative Method** (Windows):
   ```cmd
   # From syslinux folder on USB
   syslinux.exe -m -a -d /syslinux /dev/USB_DRIVE
   ```

### Configure License

**License Setup Options**

1. **New License**: Purchase separate license for virtual instance
2. **Trial Mode**: Use 30-day trial for testing
3. **Existing License**: Transfer temporarily (requires USB swap)

**GUID Configuration**:

```bash
# Check USB GUID (on Linux/Mac)
lsusb

# Set specific GUID in config (if needed)
echo "GUID=YOUR_USB_GUID" >> config/ident.cfg
```

## VM Creation on Host Unraid

### Enable Virtualization

**Host Unraid Configuration**

1. **Enable VMs**: Settings → VM Manager → Enable VMs
2. **Check IOMMU**: Verify IOMMU groups are available
3. **VM Storage**: Create or select storage location for VMs

### Create Virtual Machine

**VM Configuration**

1. **Add VM**: Click "Add VM" in VM Manager
2. **Select Template**: Choose "Linux" template
3. **Basic Configuration**:
   ```
   Name: Virtual-Unraid
   Description: Virtual Unraid for testing
   Template: Slackware (closest to Unraid)
   ```

4. **CPU Configuration**:
   ```
   CPUs: 2-4 cores
   CPU Model: Host passthrough (recommended)
   CPU Pinning: Optional for better performance
   ```

5. **Memory Configuration**:
   ```
   Initial Memory: 4096 MB (minimum)
   Max Memory: 8192 MB (recommended)
   ```

6. **Machine Configuration**:
   ```
   BIOS: UEFI (recommended)
   Machine: q35
   ```

### Storage Configuration

**Virtual Disk Setup**

1. **Primary vDisk**:
   ```
   Bus: VirtIO
   Cache: Writeback
   Format: qcow2
   Size: 50GB (minimum)
   ```

2. **Additional vDisks** (for array simulation):
   ```
   vDisk 2: 20GB (Parity simulation)
   vDisk 3: 10GB (Data disk 1)
   vDisk 4: 10GB (Data disk 2)
   vDisk 5: 10GB (Data disk 3)
   ```

### Network Configuration

**Network Setup**

```
Network Source: br0
Network Model: VirtIO-net
MAC Address: Auto-generate
```

### USB Passthrough

**Attach Unraid USB**

1. **USB Devices Section**: In VM template
2. **Add USB Device**: Select your prepared Unraid USB
3. **USB Controller**: xHCI (USB 3.0)

## VM Boot and Installation

### First Boot

**Initial Startup**

1. **Start VM**: Click start button
2. **VNC Console**: Open VNC viewer
3. **Boot Menu**: Select Unraid boot option
4. **Wait for Boot**: Allow Unraid to fully load

### Initial Configuration

**Network Setup**

1. **Check IP Assignment**: Note assigned IP address
2. **Access Web Interface**: Open browser to VM's IP
3. **Network Configuration**:
   ```
   Interface: eth0
   IP Assignment: DHCP (initial)
   Static IP: Configure later if needed
   ```

### Array Configuration

**Set Up Virtual Array**

1. **Assign Devices**:
   ```
   Parity: Largest virtual disk
   Disk 1: First data virtual disk
   Disk 2: Second data virtual disk
   Cache: Optional SSD simulation
   ```

2. **Format Array**: Initialize new array
3. **Start Array**: Begin array operation

## Advanced Configuration

### Static IP Configuration

**Network Settings**

1. **Settings → Network**: In virtual Unraid
2. **Interface Configuration**:
   ```
   Interface: eth0
   IP Address: 192.168.1.150/24
   Gateway: 192.168.1.1
   DNS Servers: 8.8.8.8, 1.1.1.1
   ```

3. **Apply Changes**: Restart networking

### Performance Optimization

**VM Performance Tuning**

1. **CPU Pinning**: Pin VM CPUs to specific host cores
2. **Memory Allocation**: Use hugepages for better performance
3. **Storage Optimization**: Use VirtIO drivers
4. **Network Optimization**: Enable VirtIO-net multiqueue

**Host Configuration**:

```xml
<!-- Add to VM XML configuration -->
<vcpu placement='static' cpuset='2-3'>2</vcpu>
<cputune>
  <vcpupin vcpu='0' cpuset='2'/>
  <vcpupin vcpu='1' cpuset='3'/>
</cputune>
```

### SSH Access Configuration

**Enable SSH in Virtual Unraid**

1. **Settings → Management Access**: Enable SSH
2. **SSH Configuration**:
   ```
   SSH Port: 22 (default)
   Password Authentication: Enabled
   Root Login: Enabled (for testing)
   ```

3. **Connect via SSH**:
   ```bash
   ssh root@virtual-unraid-ip
   ```

## Troubleshooting

### Common Boot Issues

**EFI Boot Problems**

1. **BIOS vs UEFI**: Ensure consistent boot mode
2. **Boot Order**: Check VM boot priority
3. **USB Detection**: Verify USB passthrough working

**Solutions**:
```bash
# Force legacy boot in VM template
<os>
  <type arch='x86_64' machine='pc-q35-2.11'>hvm</type>
  <loader>/usr/share/qemu/bios.bin</loader>
</os>
```

### Network Issues

**IP Address Problems**

1. **DHCP Issues**: Check host DHCP server
2. **Bridge Configuration**: Verify br0 bridge
3. **VM Network Model**: Try different network models

**Manual IP Configuration**:
```bash
# From Unraid console
ifconfig eth0 192.168.1.150 netmask 255.255.255.0
route add default gw 192.168.1.1
```

### Performance Issues

**Slow Performance**

1. **CPU Allocation**: Increase CPU cores
2. **Memory**: Add more RAM to VM
3. **Storage**: Use SSD for VM storage
4. **VirtIO Drivers**: Ensure VirtIO drivers loaded

### USB Passthrough Issues

**USB Not Detected**

1. **USB Controller Type**: Try different USB controller
2. **Host USB Policy**: Check host USB settings
3. **VM Template**: Verify USB device mapping

**Alternative USB Methods**:
```xml
<!-- USB device passthrough by vendor/product ID -->
<hostdev mode='subsystem' type='usb' managed='yes'>
  <source>
    <vendor id='0x1234'/>
    <product id='0x5678'/>
  </source>
</hostdev>
```

## Manual XML Configuration

### Advanced VM Template

**Custom XML Configuration**

If VM template editor doesn't provide needed options:

1. **Edit VM Template**: Go to VM tab
2. **Form View → XML View**: Switch to XML editing
3. **Custom Configuration**: Add advanced options

**Example XML Modifications**:

```xml
<domain type='kvm'>
  <name>Virtual-Unraid</name>
  <memory unit='KiB'>4194304</memory>
  <vcpu placement='static'>2</vcpu>
  <os>
    <type arch='x86_64' machine='pc-q35-6.2'>hvm</type>
    <loader readonly='yes' type='pflash'>/usr/share/qemu/edk2-x86_64-secure-code.fd</loader>
    <nvram>/etc/libvirt/qemu/nvram/Virtual-Unraid_VARS.fd</nvram>
  </os>
  <features>
    <acpi/>
    <apic/>
    <hyperv>
      <relaxed state='on'/>
      <vapic state='on'/>
      <spinlocks state='on' retries='8191'/>
    </hyperv>
  </features>
  <cpu mode='host-passthrough' check='none'>
    <topology sockets='1' cores='2' threads='1'/>
  </cpu>
  <devices>
    <!-- Custom device configurations -->
  </devices>
</domain>
```

## Use Cases and Applications

### Testing Environment

**Development Testing**

1. **Plugin Development**: Test custom plugins safely
2. **Docker Configuration**: Test container setups
3. **Network Changes**: Test network configurations
4. **Storage Testing**: Test different array configurations

### Learning Environment

**Educational Purposes**

1. **Unraid Training**: Learn without affecting production
2. **Disaster Recovery**: Practice recovery procedures
3. **Configuration Testing**: Test settings changes
4. **Version Testing**: Test new Unraid versions

### Backup Strategy Testing

**Disaster Recovery**

1. **Backup Procedures**: Test backup and restore
2. **Migration Testing**: Test hardware migrations
3. **Recovery Scenarios**: Practice disaster recovery
4. **Configuration Backup**: Test config preservation

## Security Considerations

### Network Isolation

**Security Best Practices**

1. **Separate Network**: Use isolated network segment
2. **Firewall Rules**: Restrict VM network access
3. **Access Control**: Limit SSH and web access
4. **License Management**: Keep licenses separate

### Data Protection

**Safety Measures**

1. **Host Isolation**: Prevent VM from affecting host
2. **Storage Separation**: Keep VM storage separate
3. **Backup Strategy**: Regular VM backups
4. **Snapshot Management**: Use VM snapshots for testing

## Best Practices

### Resource Management

**Efficient Resource Usage**

1. **CPU Allocation**: Don't over-allocate CPUs
2. **Memory Management**: Leave sufficient RAM for host
3. **Storage Planning**: Plan storage allocation carefully
4. **Network Bandwidth**: Monitor network usage

### Maintenance

**Regular Maintenance Tasks**

1. **VM Updates**: Keep virtual Unraid updated
2. **Host Maintenance**: Maintain host Unraid system
3. **Backup Verification**: Verify VM backups regularly
4. **Performance Monitoring**: Monitor VM performance

### Documentation

**Keep Records**

1. **Configuration Documentation**: Document VM settings
2. **Change Log**: Track configuration changes
3. **Troubleshooting Notes**: Document solutions
4. **Recovery Procedures**: Document recovery steps

## Special Thanks

- **Lime Technology** for creating Unraid
- **DiscDuck** for developing this virtualization method
- **Hawks** for extensive testing and feedback
- To our fantastic Discord community for their input and support

Please support the developers and creators involved in this work to help show them some love. ❤️

## Final Words

This guide was conceptualized and written by **DiscDuck** for IBRACORP, with contributions from the entire team.

## Support Us

Our work sometimes takes months to research and develop.

If you want to help support us please consider:

- Liking and Subscribing to our [Youtube channel](https://youtube.com/@ibracorp)
- Joining our [Discord server](https://discord.gg/ibracorp)
- Becoming a paid member on our [IBRACORP website](https://ibracorp.io)
- Donating via [Paypal](https://paypal.me/ibracorp)

**Thank you for being part of our community!**
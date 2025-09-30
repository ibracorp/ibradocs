---
title: "OPNsense"
sidebar_position: 1
description: "OPNsense firewall traffic shaping and bufferbloat optimization"
tags: ["networking", "ibracorp"]
source_url: https://docs.ibracorp.io/opnsense/
---

# OPNsense

OPNsense firewall traffic shaping and bufferbloat optimization

:::info OPNsense Traffic Shaping
**Video**
[IBRACORP OPNsense Tutorial](https://youtube.com/@ibracorp)

**Useful Links**
- [OPNsense Official Website](https://opnsense.org/)
- [OPNsense Documentation](https://docs.opnsense.org/)
- [BufferBloat Testing](https://www.waveform.com/tools/bufferbloat)

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
| Contributor | OPNsense Community |
| Testing / Proofreading | IBRACORP Community |

## Feature List

**OPNsense Traffic Shaping Features:**

- Advanced traffic shaping with fq_codel algorithm
- Bufferbloat reduction and latency optimization
- Quality of Service (QoS) management
- Bandwidth allocation and limiting
- FlowQueue-CoDel (FQ-CoDel) scheduler implementation
- ECN (Explicit Congestion Notification) support
- Per-flow fair queuing
- Real-time traffic monitoring and statistics
- Rule-based traffic classification
- Network performance optimization

## Prerequisites

**System Requirements:**

- **OPNsense Firewall:** Installed and configured
- **Administrative Access:** Full admin privileges
- **Network Information:** ISP bandwidth specifications
- **Testing Tools:** BufferBloat testing websites

**Network Prerequisites:**
- **Internet Connection:** Active ISP connection
- **Bandwidth Knowledge:** Upload and download speeds
- **Network Topology:** Understanding of your network layout

## Traffic Shaping Overview

### What is BufferBloat?

**BufferBloat Definition:**
BufferBloat occurs when excessive buffering of network packets causes high latency and poor network performance. This happens when network equipment stores too many packets in memory, causing delays.

**Symptoms of BufferBloat:**
- High ping times during file downloads/uploads
- Video call quality degradation during network usage
- Gaming lag when other devices use bandwidth
- Web browsing slowdown during large transfers

### FQ-CoDel Algorithm

**FlowQueue-CoDel Benefits:**
- **Fair Queuing:** Separate queues for different flows
- **Active Queue Management:** Dynamic packet dropping
- **Low Latency:** Reduced buffering delays
- **Automatic Configuration:** Self-tuning parameters
- **ECN Support:** Congestion notification without packet loss

## Configuration

### Step 1: Pipes Configuration

**Navigate to Traffic Shaping:**
1. Log into OPNsense web interface
2. Navigate to **Firewall → Shaper → Pipes**
3. Click **"Add"** to create new pipe

**Download Pipe Configuration:**
```yaml
download_pipe:
  enabled: true
  bandwidth: 950  # Mbps (set to 95% of actual download speed)
  bandwidth_metric: "Mbit/s"
  mask: "none"
  buckets: 64
  scheduler: "FlowQueue-CoDel"
  fq_codel_ecn: true
  fq_codel_quantum: 1500  # 300 per 100 Mbps
  codel_target: 10  # milliseconds
  codel_interval: 100  # milliseconds
  description: "Download bandwidth shaping"
```

**Upload Pipe Configuration:**
```yaml
upload_pipe:
  enabled: true
  bandwidth: 45  # Mbps (set to 95% of actual upload speed)
  bandwidth_metric: "Mbit/s"
  mask: "none"
  buckets: 64
  scheduler: "FlowQueue-CoDel"
  fq_codel_ecn: true
  fq_codel_quantum: 450  # 300 per 100 Mbps (adjusted for 50 Mbps)
  codel_target: 10  # milliseconds
  codel_interval: 100  # milliseconds
  description: "Upload bandwidth shaping"
```

**Pipe Configuration Steps:**
1. **Enable Advanced Mode:** Check advanced options
2. **Set Bandwidth:** Enter your ISP speed (minus 5% buffer)
3. **Select Scheduler:** Choose "FlowQueue-CoDel"
4. **Enable ECN:** Check "(FQ-)CoDel ECN" option
5. **Configure Quantum:** Calculate as 300 per 100 Mbps
6. **Save Configuration:** Apply settings

### Step 2: Queues Configuration

**Navigate to Queues:**
1. Switch to **Queues** tab
2. Click **"Add"** to create new queue

**Download Queue Configuration:**
```yaml
download_queue:
  enabled: true
  pipe: "download_pipe"
  weight: 100
  mask: "destination"
  mask_bits: 32
  buckets: 64
  description: "Download queue for shaping"
```

**Upload Queue Configuration:**
```yaml
upload_queue:
  enabled: true
  pipe: "upload_pipe"
  weight: 100
  mask: "source"
  mask_bits: 32
  buckets: 64
  description: "Upload queue for shaping"
```

**Queue Configuration Steps:**
1. **Select Pipe:** Choose corresponding pipe
2. **Set Weight:** Use 100 for balanced priority
3. **Configure Mask:**
   - Download: "destination" mask
   - Upload: "source" mask
4. **Set Buckets:** Default 64 buckets
5. **Save Queue:** Apply configuration

### Step 3: Rules Configuration

**Navigate to Rules:**
1. Switch to **Rules** tab
2. Click **"Add"** to create new rule

**Download Rule Configuration:**
```yaml
download_rule:
  enabled: true
  sequence: 100
  interface: "LAN"
  direction: "in"
  protocol: "any"
  source: "any"
  destination: "any"
  target_pipe: "download_pipe"
  target_queue: "download_queue"
  description: "Shape incoming traffic (download)"
```

**Upload Rule Configuration:**
```yaml
upload_rule:
  enabled: true
  sequence: 200
  interface: "WAN"
  direction: "out"
  protocol: "any"
  source: "any"
  destination: "any"
  target_pipe: "upload_pipe"
  target_queue: "upload_queue"
  description: "Shape outgoing traffic (upload)"
```

**Rule Configuration Steps:**
1. **Set Direction:**
   - Download: "in" direction on LAN interface
   - Upload: "out" direction on WAN interface
2. **Configure Target:** Link to appropriate queue
3. **Set Protocol:** "any" for all traffic
4. **Apply Rules:** Save and apply configuration

## Advanced Configuration

### Bandwidth Calculation

**Optimal Bandwidth Settings:**
```python
# Calculate optimal bandwidth (95% of actual speed)
def calculate_bandwidth(actual_speed_mbps):
    optimal_bandwidth = actual_speed_mbps * 0.95
    return optimal_bandwidth

# Example calculations
download_speed = 1000  # Mbps
upload_speed = 50      # Mbps

optimal_download = calculate_bandwidth(download_speed)  # 950 Mbps
optimal_upload = calculate_bandwidth(upload_speed)      # 47.5 Mbps
```

**FQ-CoDel Quantum Calculation:**
```python
# Calculate quantum value (300 per 100 Mbps)
def calculate_quantum(bandwidth_mbps):
    quantum = (bandwidth_mbps / 100) * 300
    return int(quantum)

# Example calculations
download_quantum = calculate_quantum(950)  # 2850
upload_quantum = calculate_quantum(47.5)   # 142.5 → 150
```

### Priority-Based Shaping

**Gaming Traffic Priority:**
```yaml
gaming_queue:
  enabled: true
  pipe: "upload_pipe"
  weight: 200  # Higher priority
  mask: "source"
  mask_bits: 32
  protocol_filter: "UDP"
  port_range: "1024-65535"
  description: "Gaming traffic priority queue"
```

**VoIP Traffic Priority:**
```yaml
voip_queue:
  enabled: true
  pipe: "upload_pipe"
  weight: 150  # High priority
  mask: "source"
  mask_bits: 32
  dscp_marking: "EF"  # Expedited Forwarding
  description: "VoIP traffic priority queue"
```

### Application-Specific Rules

**Streaming Service Optimization:**
```yaml
streaming_rule:
  enabled: true
  sequence: 50
  interface: "LAN"
  direction: "in"
  protocol: "TCP"
  destination_port: "443,80"
  source: "192.168.1.0/24"
  target_queue: "streaming_queue"
  description: "Optimize streaming traffic"
```

**Bulk Transfer Limitation:**
```yaml
bulk_transfer_rule:
  enabled: true
  sequence: 300
  interface: "WAN"
  direction: "out"
  protocol: "TCP"
  source_port: "21,22,993,995"  # FTP, SSH, IMAPS, POP3S
  target_queue: "bulk_queue"
  bandwidth_limit: "10%"  # Limit to 10% of total bandwidth
  description: "Limit bulk transfer impact"
```

## Monitoring and Testing

### BufferBloat Testing

**Testing Tools:**
1. **Waveform BufferBloat Test:** https://www.waveform.com/tools/bufferbloat
2. **DSLReports Speed Test:** http://www.dslreports.com/speedtest
3. **Fast.com:** https://fast.com/
4. **Speedtest.net:** https://www.speedtest.net/

**Testing Procedure:**
```bash
# Before implementing traffic shaping
1. Run baseline bufferbloat test
2. Note latency under load
3. Record grades (A, B, C, D, F)

# After implementing traffic shaping
1. Run same tests
2. Compare latency improvements
3. Verify grade improvements

# Expected improvements:
# - Latency reduction: 50-90%
# - Grade improvement: D/F → A/B
# - Consistent performance under load
```

### Real-Time Monitoring

**Traffic Statistics:**
1. Navigate to **Firewall → Shaper → Statistics**
2. Monitor real-time traffic flow
3. Observe queue utilization
4. Check packet drop rates

**Performance Metrics:**
```yaml
monitoring_metrics:
  bandwidth_utilization: "Current usage vs configured limits"
  queue_depth: "Number of packets in queue"
  drop_rate: "Percentage of dropped packets"
  latency_stats: "Average and peak latency"
  flow_distribution: "Traffic distribution across flows"
```

### Logging Configuration

**Enable Traffic Shaping Logs:**
```yaml
logging_config:
  firewall_logs: true
  shaper_logs: true
  log_level: "informational"
  log_facility: "local0"
  remote_logging: false
  log_rotation: "daily"
  retention_days: 30
```

**Log Analysis:**
```bash
# View shaping logs
grep "shaper" /var/log/filter.log

# Monitor queue statistics
grep "queue" /var/log/system.log

# Check for dropped packets
grep "drop" /var/log/filter.log | tail -20
```

## Troubleshooting

### Common Issues

**Traffic Not Being Shaped:**
1. **Verify Rule Order:** Check sequence numbers
2. **Interface Assignment:** Ensure correct interface selection
3. **Direction Configuration:** Verify in/out directions
4. **Rule Activation:** Confirm rules are enabled

**Performance Not Improved:**
1. **Bandwidth Settings:** Verify 95% rule
2. **Quantum Calculation:** Check FQ-CoDel quantum
3. **Testing Methodology:** Use proper testing tools
4. **Network Topology:** Ensure shaping at correct point

**High CPU Usage:**
```yaml
cpu_optimization:
  hardware_offloading: true
  interrupt_moderation: true
  polling_mode: false
  queue_size_optimization: true
  buffer_tuning: "automatic"
```

### Performance Optimization

**Hardware Acceleration:**
```yaml
hardware_config:
  nic_offloading: true
  tso_enabled: true  # TCP Segmentation Offload
  lro_enabled: true  # Large Receive Offload
  checksum_offload: true
  interrupt_coalescing: true
```

**Memory Optimization:**
```yaml
memory_config:
  buffer_size: "auto"
  mbuf_clusters: 65536
  socket_buffer_max: "16M"
  tcp_sendspace: "65536"
  tcp_recvspace: "65536"
```

### Advanced Troubleshooting

**Packet Capture Analysis:**
```bash
# Capture traffic on shaped interface
tcpdump -i igb0 -w /tmp/shaped_traffic.pcap

# Analyze with specific filters
tcpdump -r /tmp/shaped_traffic.pcap 'host 192.168.1.100'

# Check DSCP markings
tcpdump -r /tmp/shaped_traffic.pcap -v 'ip[1] & 0xfc != 0'
```

**Queue Depth Monitoring:**
```bash
# Monitor queue statistics
netstat -aq | grep -E "(queue|drop)"

# Check interface statistics
netstat -i | grep -E "(Ipkts|Opkts|Drops)"

# Monitor system resources
top -P | grep -E "(CPU|Mem)"
```

## Best Practices

### Configuration Guidelines

**Bandwidth Allocation:**
1. **Conservative Approach:** Start with 90-95% of actual bandwidth
2. **Gradual Adjustment:** Fine-tune based on testing results
3. **Overhead Consideration:** Account for protocol overhead
4. **Peak vs Average:** Consider peak usage patterns

**Queue Management:**
1. **Fair Queuing:** Use appropriate mask settings
2. **Priority Assignment:** Assign weights based on traffic importance
3. **Buffer Sizing:** Let FQ-CoDel auto-tune buffers
4. **Flow Isolation:** Ensure proper flow separation

### Maintenance Procedures

**Regular Tasks:**
```yaml
maintenance_schedule:
  weekly:
    - "Review traffic statistics"
    - "Check for dropped packets"
    - "Monitor queue utilization"
    - "Verify rule effectiveness"

  monthly:
    - "Update bandwidth settings if ISP changes"
    - "Review and adjust priorities"
    - "Test bufferbloat improvements"
    - "Backup shaping configuration"

  quarterly:
    - "Full performance review"
    - "Compare before/after metrics"
    - "Update documentation"
    - "Plan optimizations"
```

**Configuration Backup:**
```bash
#!/bin/bash
# opnsense-backup.sh

BACKUP_DIR="/backup/opnsense"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Export configuration via API
curl -u admin:password -X POST \
  "https://opnsense.local/api/core/backup/download/this" \
  -o "$BACKUP_DIR/opnsense-config-$DATE.xml"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "opnsense-config-*.xml" -mtime +30 -delete
```

## Integration Examples

### Home Network Setup

**Typical Home Configuration:**
```yaml
home_network:
  internet_speed:
    download: "1000 Mbps"
    upload: "50 Mbps"

  device_priorities:
    gaming_console: "high"
    streaming_devices: "medium"
    work_computers: "high"
    iot_devices: "low"
    backup_systems: "lowest"

  traffic_classes:
    real_time: "gaming, voip"
    interactive: "web browsing, email"
    streaming: "video, audio streaming"
    bulk: "file transfers, backups"
```

### Business Network Setup

**Enterprise Configuration:**
```yaml
business_network:
  internet_speed:
    download: "500 Mbps"
    upload: "100 Mbps"

  department_allocation:
    critical_systems: "40%"
    user_traffic: "35%"
    guest_network: "15%"
    management: "10%"

  service_priorities:
    sip_voip: "highest"
    business_apps: "high"
    email: "medium"
    web_browsing: "medium"
    file_transfers: "low"
```

## Special Thanks

- **OPNsense Team** for their excellent open-source firewall platform
- **FreeBSD Community** for the underlying operating system
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
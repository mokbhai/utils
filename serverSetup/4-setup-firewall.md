# Firewall Setup for AlmaLinux

## Quick Setup Commands

```bash

sudo dnf install firewalld

# Check firewall status
sudo firewall-cmd --state

# Enable firewall
sudo systemctl enable --now firewalld

# Basic web server setup
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=22222/tcp
sudo firewall-cmd --reload
```

## Understanding AlmaLinux Firewall

AlmaLinux uses `firewalld` instead of `ufw` (which is Ubuntu/Debian-based). `firewalld` is the default firewall management tool for RHEL-based systems.

### Why UFW is Not Available
- `ufw` (Uncomplicated Firewall) is designed for Debian/Ubuntu systems
- AlmaLinux uses `firewalld` which is more powerful and zone-based
- `firewalld` is already installed and configured on AlmaLinux

## Firewalld Basic Commands

### Check Firewall Status
```bash
# Check if firewalld is running
sudo firewall-cmd --state

# Check firewall status
sudo systemctl status firewalld
```

### Enable/Disable Firewall
```bash
# Enable firewall
sudo systemctl enable --now firewalld

# Disable firewall (not recommended)
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

### View Current Configuration
```bash
# List all active rules
sudo firewall-cmd --list-all

# List all zones
sudo firewall-cmd --get-zones

# Check active zone
sudo firewall-cmd --get-active-zones

# List all services
sudo firewall-cmd --get-services
```

## Common Firewall Rules

### Allow Services
```bash
# Allow HTTP (port 80)
sudo firewall-cmd --permanent --add-service=http

# Allow HTTPS (port 443)
sudo firewall-cmd --permanent --add-service=https

# Allow SSH (port 22)
sudo firewall-cmd --permanent --add-service=ssh

# Allow custom SSH port
sudo firewall-cmd --permanent --add-port=22222/tcp

# Allow FTP
sudo firewall-cmd --permanent --add-service=ftp

# Allow MySQL/MariaDB
sudo firewall-cmd --permanent --add-service=mysql

# Allow PostgreSQL
sudo firewall-cmd --permanent --add-service=postgresql
```

### Allow Specific Ports
```bash
# Allow single port
sudo firewall-cmd --permanent --add-port=8080/tcp

# Allow port range
sudo firewall-cmd --permanent --add-port=8000-8010/tcp

# Allow UDP port
sudo firewall-cmd --permanent --add-port=53/udp

# Allow both TCP and UDP
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3000/udp
```

### Apply Changes
```bash
# Reload firewall to apply permanent changes
sudo firewall-cmd --reload

# Or restart firewalld
sudo systemctl restart firewalld
```

## Advanced Firewall Configuration

### Create Custom Service
```bash
# Create custom service file
sudo nano /etc/firewalld/services/myapp.xml
```

Example service file:
```xml
<?xml version="1.0" encoding="utf-8"?>
<service>
  <short>MyApp</short>
  <description>My Custom Application</description>
  <port protocol="tcp" port="8080"/>
  <port protocol="tcp" port="8443"/>
</service>
```

```bash
# Reload firewalld to recognize new service
sudo firewall-cmd --reload

# Add custom service
sudo firewall-cmd --permanent --add-service=myapp
sudo firewall-cmd --reload
```

### IP Address Restrictions
```bash
# Allow specific IP
sudo firewall-cmd --permanent --add-source=192.168.1.100

# Allow IP range
sudo firewall-cmd --permanent --add-source=192.168.1.0/24

# Block specific IP
sudo firewall-cmd --permanent --add-rich-rule="rule family='ipv4' source address='192.168.1.100' reject"
```

### Port Forwarding
```bash
# Forward port 80 to 8080
sudo firewall-cmd --permanent --add-forward-port=port=80:proto=tcp:toport=8080

# Forward to different IP
sudo firewall-cmd --permanent --add-forward-port=port=80:proto=tcp:toaddr=192.168.1.100:toport=8080
```

## Remove Rules

### Remove Services
```bash
# Remove HTTP service
sudo firewall-cmd --permanent --remove-service=http

# Remove custom port
sudo firewall-cmd --permanent --remove-port=8080/tcp

# Remove source IP
sudo firewall-cmd --permanent --remove-source=192.168.1.100
```

### Remove All Rules (Reset)
```bash
# Reset to default configuration
sudo firewall-cmd --complete-reload
```

## Firewall Zones

### Understanding Zones
- **public**: Default zone for public networks
- **internal**: Internal networks (trusted)
- **external**: External networks with masquerading
- **dmz**: Demilitarized zone
- **work**: Work networks
- **home**: Home networks
- **trusted**: All connections accepted

### Zone Management
```bash
# List all zones
sudo firewall-cmd --get-zones

# Get default zone
sudo firewall-cmd --get-default-zone

# Set default zone
sudo firewall-cmd --set-default-zone=public

# Add interface to zone
sudo firewall-cmd --permanent --zone=internal --add-interface=eth0

# Change zone for interface
sudo firewall-cmd --permanent --zone=public --change-interface=eth0
```

## Common Server Configurations

### Basic Web Server
```bash
# Allow HTTP and HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=22222/tcp  # Custom SSH port
sudo firewall-cmd --reload
```

### Database Server
```bash
# Allow MySQL/MariaDB
sudo firewall-cmd --permanent --add-service=mysql
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

### Mail Server
```bash
# Allow email services
sudo firewall-cmd --permanent --add-service=smtp
sudo firewall-cmd --permanent --add-service=pop3
sudo firewall-cmd --permanent --add-service=imap
sudo firewall-cmd --permanent --add-service=smtps
sudo firewall-cmd --permanent --add-service=pop3s
sudo firewall-cmd --permanent --add-service=imaps
sudo firewall-cmd --reload
```

### Development Server
```bash
# Allow common development ports
sudo firewall-cmd --permanent --add-port=3000/tcp   # Node.js
sudo firewall-cmd --permanent --add-port=5000/tcp   # Flask
sudo firewall-cmd --permanent --add-port=8000/tcp   # Django
sudo firewall-cmd --permanent --add-port=8080/tcp   # Tomcat
sudo firewall-cmd --reload
```

## Logging and Monitoring

### Enable Logging
```bash
# Enable firewall logging
sudo firewall-cmd --set-log-denied=all

# Set logging level
sudo firewall-cmd --set-log-denied=unicast-in-zones
```

### View Firewall Logs
```bash
# View firewall logs
sudo journalctl -u firewalld -f

# View denied connections
sudo grep "DPT" /var/log/messages
```

## Troubleshooting

### Check Open Ports
```bash
# Check listening ports
sudo netstat -tulpn

# Or using ss command
sudo ss -tulpn
```

### Test Connectivity
```bash
# Test from another machine
telnet server_ip port_number

# Test locally
nc -zv localhost 80
```

### Common Issues
```bash
# If firewall blocks everything
sudo firewall-cmd --panic-off

# Check if service is blocked
sudo firewall-cmd --query-service=http

# Check if port is open
sudo firewall-cmd --query-port=8080/tcp
```

## Security Best Practices

### 1. Principle of Least Privilege
- Only open ports that are absolutely necessary
- Regularly review and remove unused rules
- Use specific IP restrictions when possible

### 2. Regular Maintenance
```bash
# List all rules monthly
sudo firewall-cmd --list-all

# Review open ports
sudo netstat -tulpn | grep LISTEN

# Check for suspicious connections
sudo netstat -an | grep ESTABLISHED
```

### 3. Backup Configuration
```bash
# Export current configuration
sudo firewall-cmd --list-all > firewall-backup.txt

# Or copy configuration files
sudo cp -r /etc/firewalld /etc/firewalld.backup
```

### 4. Monitor Logs
```bash
# Set up log monitoring
sudo tail -f /var/log/firewalld

# Create log rotation
sudo nano /etc/logrotate.d/firewalld
```

## Emergency Recovery

### If Locked Out
```bash
# From console/VNC access
sudo firewall-cmd --panic-off
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

### Reset to Default
```bash
# Reset all rules
sudo firewall-cmd --complete-reload

# Or restore from backup
sudo cp -r /etc/firewalld.backup/* /etc/firewalld/
sudo systemctl restart firewalld
```

## Alternative: Using iptables directly

If you prefer iptables over firewalld:

```bash
# Disable firewalld
sudo systemctl stop firewalld
sudo systemctl disable firewalld

# Install iptables
sudo dnf install iptables-services

# Enable iptables
sudo systemctl enable --now iptables

# Basic iptables rules
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -j DROP

# Save rules
sudo service iptables save
```

## Conclusion

`firewalld` is the recommended firewall solution for AlmaLinux. It provides:
- Zone-based configuration
- Dynamic rule management
- Integration with NetworkManager
- Rich rule language
- Better security than basic iptables

Always test firewall changes carefully and maintain console access to avoid being locked out of your server.
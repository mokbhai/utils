# SSH Key Generation and Server Hardening

## Quick Setup Commands

### On AlmaLinux Server
```bash
mkdir ~/.ssh && chmod 700 ~/.ssh
```

### On Mac/Local Machine
```bash
ssh-keygen -b 4096
scp ~/.ssh/id_ed25519.pub mokshit@jainparichay.online:~/.ssh/authorized_keys
```

### On AlmaLinux Server (SSH Hardening)
```bash
sudo nano /etc/ssh/sshd_config
sudo systemctl restart sshd
```

## Detailed SSH Key Setup

### 1. Generate SSH Keys on Local Machine (Mac/Linux)

#### Generate ED25519 Key (Recommended)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

#### Generate RSA Key (Alternative)
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

#### Key Generation Process
- Press Enter to save to default location (`~/.ssh/id_ed25519`)
- Enter a secure passphrase (recommended)
- Confirm the passphrase

### 2. Copy Public Key to Server

#### Method 1: Using ssh-copy-id (Recommended)
```bash
ssh-copy-id username@server_ip
```

#### Method 2: Using scp
```bash
scp ~/.ssh/id_ed25519.pub username@server_ip:~/.ssh/authorized_keys
```

#### Method 3: Manual Copy
```bash
cat ~/.ssh/id_ed25519.pub
```
Then paste the output into `~/.ssh/authorized_keys` on the server.

### 3. Set Up SSH Directory on Server

```bash
# Create SSH directory
mkdir -p ~/.ssh

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Ensure correct ownership
chown -R $USER:$USER ~/.ssh
```

## SSH Server Hardening

### 1. Backup Original Configuration
```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
```

### 2. Edit SSH Configuration
```bash
sudo nano /etc/ssh/sshd_config
```

### 3. Recommended SSH Configuration Changes

```bash
# Change default port (security through obscurity)
Port 22222

# Only allow IPv4 connections
AddressFamily inet

# Disable root login
PermitRootLogin no

# Disable password authentication (use keys only)
PasswordAuthentication no

# Disable empty passwords
PermitEmptyPasswords no

# Disable challenge-response authentication
ChallengeResponseAuthentication no

# Disable X11 forwarding if not needed
X11Forwarding no

# Limit authentication attempts
MaxAuthTries 3

# Set login grace time
LoginGraceTime 60

# Only allow specific users (optional)
AllowUsers mokshit

# Use Protocol 2 only
Protocol 2

# Disable unused authentication methods
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Disable host-based authentication
HostbasedAuthentication no

# Disable rhosts authentication
IgnoreRhosts yes

# Set client alive interval (prevents hanging connections)
ClientAliveInterval 300
ClientAliveCountMax 2
```

### 4. Restart SSH Service
```bash
sudo systemctl restart sshd
```

### 5. Verify SSH Service Status
```bash
sudo systemctl status sshd
```

## Testing SSH Connection

### 1. Test from Local Machine
```bash
ssh -p 22222 username@server_ip
```

### 2. Test Key-Based Authentication
```bash
ssh -i ~/.ssh/id_ed25519 -p 22222 username@server_ip
```

## Firewall Configuration

### 1. Allow New SSH Port (if changed)
```bash
sudo firewall-cmd --permanent --add-port=22222/tcp
sudo firewall-cmd --reload
```

### 2. Remove Default SSH Port (after testing)
```bash
sudo firewall-cmd --permanent --remove-service=ssh
sudo firewall-cmd --reload
```

## SSH Client Configuration

### 1. Create SSH Config File
```bash
nano ~/.ssh/config
```

### 2. Add Server Configuration
```bash
Host myserver
    HostName jainparichay.online
    User mokshit
    Port 22222
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

### 3. Connect Using Alias
```bash
ssh myserver
```

## Security Best Practices

### 1. Key Management
- Use strong passphrases for SSH keys
- Generate separate keys for different servers
- Regularly rotate SSH keys
- Store keys securely

### 2. Server Hardening
- Change default SSH port
- Disable password authentication
- Use fail2ban for intrusion prevention
- Regular security updates
- Monitor SSH logs

### 3. Additional Security Measures
```bash
# Install fail2ban
sudo dnf install epel-release
sudo dnf install fail2ban

# Enable and start fail2ban
sudo systemctl enable --now fail2ban

# Configure fail2ban for SSH
sudo nano /etc/fail2ban/jail.local
```

## Troubleshooting

### 1. Permission Issues
```bash
# Fix SSH directory permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

### 2. Connection Refused
- Check if SSH service is running: `sudo systemctl status sshd`
- Verify port is open: `sudo netstat -tlnp | grep :22222`
- Check firewall rules: `sudo firewall-cmd --list-all`

### 3. Authentication Failures
- Verify public key is in `~/.ssh/authorized_keys`
- Check SSH configuration syntax: `sudo sshd -t`
- Review SSH logs: `sudo journalctl -u sshd`

### 4. Key Not Being Accepted
```bash
# Test SSH connection with verbose output
ssh -v -p 22222 username@server_ip

# Check SSH agent
ssh-add -l
ssh-add ~/.ssh/id_ed25519
```

## Emergency Access

### 1. Keep Console Access
- Always maintain console/VNC access to server
- Test SSH changes before closing existing sessions

### 2. Recovery Commands
```bash
# Reset SSH config to default
sudo cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config
sudo systemctl restart sshd
```
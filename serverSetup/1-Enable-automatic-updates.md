## AlmaLinux

```bash
dnf install dnf-automatic
systemctl enable --now dnf-automatic.timer
systemctl status dnf-automatic.timer
```

#### Understanding the Issue

To install `unattended-upgrades` or its equivalent on AlmaLinux, you should use the `dnf` package manager. However, it's important to note that `unattended-upgrades` is primarily designed for Debian-based systems. For RHEL-based systems like AlmaLinux, you can achieve similar functionality using `dnf-automatic`.

Here’s how to set it up:

1. **Install `dnf-automatic`:**
   Open your terminal and run the following command:

   ```bash
   dnf install dnf-automatic
   ```

2. **Enable and Start the Service:**
   After installation, you need to enable and start the `dnf-automatic` service:

   ```bash
   systemctl enable --now dnf-automatic.timer
   ```

3. **Configure Automatic Updates:**
   You can configure the settings for automatic updates by editing the configuration file located at `/etc/dnf/automatic.conf`. You can specify which types of updates to apply automatically (e.g., security updates, regular updates).

4. **Check the Status:**
   To verify that the timer is active and the service is running, you can check the status with:
   ```bash
   systemctl status dnf-automatic.timer
   ```

#### Summary

Install `dnf-automatic` to achieve similar functionality to `unattended-upgrades` for automatic updates.

## Manual Upgrades

If you prefer to handle updates manually or need to perform immediate updates, you can use the following commands:

```bash
dnf check-update
dnf update --security
dnf clean all
dnf history
dnf needs-restarting -r
reboot
```

### Check for Available Updates

```bash
dnf check-update
```

### Update All Packages

```bash
dnf update
```

### Update Security Patches Only

```bash
dnf update --security
```

### Update Specific Package

```bash
dnf update package-name
```

### Clean Package Cache

After updates, you can clean the package cache to free up space:

```bash
dnf clean all
```

### View Update History

To see what updates have been applied:

```bash
dnf history
```

### Reboot if Required

Some updates (especially kernel updates) may require a system reboot. You can check if a reboot is needed:

```bash
dnf needs-restarting -r
```

If a reboot is required, restart your system:

```bash
reboot
```

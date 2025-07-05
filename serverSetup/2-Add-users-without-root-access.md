## AlmaLinux

```bash
adduser username
passwd username
usermod -aG wheel username # only if needed sudo access
```

### Adding Users

#### Add a new user
```bash
adduser username
```

#### Add a user with specific home directory
```bash
adduser -d /custom/home/path username
```

#### Add a user with specific shell
```bash
adduser -s /bin/bash username
```

#### Add a user to specific groups
```bash
adduser username
usermod -aG group1,group2 username
```

#### Set password for the user
```bash
passwd username
```

### Removing Users

#### Remove user but keep home directory
```bash
userdel username
```

#### Remove user and home directory
```bash
userdel -r username
```

#### Remove user from specific group
```bash
gpasswd -d username groupname
```

### Managing Existing Users

#### Check if user exists
```bash
id username
```

#### List all users
```bash
cat /etc/passwd
```

#### View user groups
```bash
groups username
```

#### Modify user properties
```bash
usermod -c "Full Name" username          # Change full name
usermod -s /bin/zsh username             # Change shell
usermod -d /new/home/path username       # Change home directory
usermod -l newname oldname               # Change username
```

### Common User Management Tasks

#### Lock/Unlock user account
```bash
usermod -L username    # Lock account
usermod -U username    # Unlock account
```

#### Set account expiration
```bash
usermod -e YYYY-MM-DD username
```

#### Add user to sudo group (wheel group in AlmaLinux)
```bash
usermod -aG wheel username
```

### Troubleshooting

#### If user already exists (like your case)
```bash
# Check user details
id mokshit
# If you want to remove and recreate
userdel -r mokshit
adduser mokshit
```

#### Force remove user even if logged in
```bash
userdel -rf username
```
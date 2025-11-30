# 📋 PasteForge - Quick Commands for Log Hosting

## 🚀 Quick Commands

### Basic Log Pasting

```bash
# Paste last 150 lines of a log file
tail -n 150 /var/log/app.log | nc 37.114.37.245 99

# Paste entire log file
cat /var/log/app.log | nc 37.114.37.245 99

# Paste with real-time streaming (last 150 lines)
tail -n 150 -f /var/log/app.log | nc 37.114.37.245 99
```

### Pterodactyl Logs

```bash
# Today's Pterodactyl logs
tail -n 150 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | nc 37.114.37.245 99

# Yesterday's logs
tail -n 150 /var/www/pterodactyl/storage/logs/laravel-$(date -d yesterday +%F).log | nc 37.114.37.245 99

# Specific date
tail -n 150 /var/www/pterodactyl/storage/logs/laravel-2024-01-15.log | nc 37.114.37.245 99
```

### System Logs

```bash
# System logs
tail -n 150 /var/log/syslog | nc 37.114.37.245 99

# Nginx logs
tail -n 150 /var/log/nginx/error.log | nc 37.114.37.245 99

# Apache logs
tail -n 150 /var/log/apache2/error.log | nc 37.114.37.245 99

# Docker logs
docker logs --tail 150 container-name | nc 37.114.37.245 99
```

### Command Output

```bash
# Process list
ps aux | nc 37.114.37.245 99

# System info
uname -a | nc 37.114.37.245 99

# Disk usage
df -h | nc 37.114.37.245 99

# Error output
./script.sh 2>&1 | nc 37.114.37.245 99
```

### Create Alias (Optional)

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# PasteForge alias
alias pasteforge='nc 37.114.37.245 99'
alias paste-logs='tail -n 150'

# Usage:
paste-logs /var/log/app.log | pasteforge
```

### Create Helper Script

Save as `paste-logs.sh`:

```bash
#!/bin/bash
SERVER="37.114.37.245"
PORT="99"

if [ -z "$1" ]; then
    echo "Usage: $0 <log-file-path>"
    exit 1
fi

tail -n 150 "$1" | nc "$SERVER" "$PORT"
```

Make it executable:
```bash
chmod +x paste-logs.sh
```

Usage:
```bash
./paste-logs.sh /var/log/app.log
```

## 📝 Notes

- The server returns the paste URL automatically
- Default paste expiry: 24 hours
- Maximum size: 10MB
- Language is auto-detected from content


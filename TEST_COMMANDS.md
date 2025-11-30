# 🧪 Test Commands for PasteForge

## Quick Test Commands

### Test with Sample Logs

```bash
# Simple test (replace your-server-ip with your actual server IP)
echo "Test log entry $(date)" | nc your-server-ip 99

# Multiple lines
cat <<EOF | nc your-server-ip 99
Line 1: Test log entry
Line 2: Another entry
Line 3: Final entry
EOF
```

### Generate Random Logs

```bash
# Random log entries
for i in {1..10}; do
  echo "[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: Test log entry #$i"
done | nc your-server-ip 99
```

### Test with Different Content Types

```bash
# Bash script
cat <<'EOF' | nc your-server-ip 99
#!/bin/bash
echo "Hello World"
for i in {1..5}; do
  echo "Iteration $i"
done
EOF

# Python code
cat <<'EOF' | nc your-server-ip 99
def hello():
    print("Hello, World!")
    for i in range(5):
        print(f"Number: {i}")

hello()
EOF

# JSON data
cat <<'EOF' | nc your-server-ip 99
{
  "users": [
    {"id": 1, "name": "John"},
    {"id": 2, "name": "Jane"}
  ],
  "status": "active"
}
EOF
```

### Test Error Logs

```bash
# Simulate error logs
cat <<EOF | nc your-server-ip 99
[ERROR] Database connection failed
[ERROR] Failed to process request: timeout
[WARN] High memory usage: 90%
[INFO] Retrying connection...
[ERROR] Connection refused
EOF
```

### Test Real Log Format

```bash
# Apache/Nginx style
cat <<EOF | nc your-server-ip 99
127.0.0.1 - - [$(date +%d/%b/%Y:%H:%M:%S\ %z)] "GET /api/users HTTP/1.1" 200 1234
192.168.1.1 - - [$(date +%d/%b/%Y:%H:%M:%S\ %z)] "POST /api/login HTTP/1.1" 401 567
10.0.0.1 - - [$(date +%d/%b/%Y:%H:%M:%S\ %z)] "GET /api/data HTTP/1.1" 200 8901
EOF
```

### One-Liner Tests

```bash
# Quick test
echo "Test $(date)" | nc your-server-ip 99

# System info
uname -a | nc your-server-ip 99

# Process list (first 10)
ps aux | head -10 | nc your-server-ip 99

# Disk usage
df -h | nc your-server-ip 99

# Network connections
netstat -tuln | head -10 | nc your-server-ip 99
```

### Using the Helper Scripts

```bash
# Make scripts executable
chmod +x test-logs.sh random-logs.sh

# Run test logs
./test-logs.sh

# Run random logs
./random-logs.sh
```

## Expected Output

After running any command, you should see:
```
http://your-server-ip:8080/XyT12AbC
```

Visit that URL to see your pasted content!


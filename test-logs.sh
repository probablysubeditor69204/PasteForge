#!/bin/bash
# Generate sample logs for testing PasteForge

SERVER="${PASTEFORGE_SERVER:-your-server-ip}"
PORT="99"

echo "Generating sample logs and pasting to PasteForge..."
echo ""

# Generate sample log output and pipe to netcat with timeout
{
cat <<EOF
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: Application started
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: Database connection established
[$(date +%Y-%m-%d\ %H:%M:%S)] WARN: High memory usage detected: 85%
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: User login: user@example.com
[$(date +%Y-%m-%d\ %H:%M:%S)] ERROR: Failed to process request: timeout
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: Cache cleared successfully
[$(date +%Y-%m-%d\ %H:%M:%S)] DEBUG: Processing queue item #1234
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: API request: GET /api/users
[$(date +%Y-%m-%d\ %H:%M:%S)] WARN: Rate limit approaching: 90/100 requests
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: Response time: 45ms
[$(date +%Y-%m-%d\ %H:%M:%S)] ERROR: Database query failed: connection lost
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: Retrying connection...
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: Connection restored
[$(date +%Y-%m-%d\ %H:%M:%S)] INFO: Background job completed: job_id=5678
EOF
} | timeout 10 nc "$SERVER" "$PORT" || echo "Connection timeout or failed"

echo ""
echo "Done!"


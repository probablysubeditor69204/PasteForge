#!/bin/bash
# Generate random logs for testing

SERVER="${PASTEFORGE_SERVER:-your-server-ip}"
PORT="99"

# Random log levels
LEVELS=("INFO" "WARN" "ERROR" "DEBUG" "TRACE")

# Random messages
MESSAGES=(
    "User authentication successful"
    "Database query executed"
    "Cache miss detected"
    "API rate limit exceeded"
    "File upload completed"
    "Email sent successfully"
    "Background job started"
    "Connection timeout occurred"
    "Memory usage: $((RANDOM % 100))%"
    "Disk space: $((RANDOM % 50 + 50))GB available"
    "Request processed in ${RANDOM}ms"
    "Session expired for user"
    "Backup job completed"
    "SSL certificate renewed"
    "Failed login attempt detected"
)

# Generate 20 random log entries
{
    for i in {1..20}; do
        LEVEL=${LEVELS[$RANDOM % ${#LEVELS[@]}]}
        MESSAGE=${MESSAGES[$RANDOM % ${#MESSAGES[@]}]}
        echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $LEVEL: $MESSAGE"
    done
} | timeout 10 nc "$SERVER" "$PORT" || echo "Connection timeout or failed"

echo ""
echo "Random logs pasted!"


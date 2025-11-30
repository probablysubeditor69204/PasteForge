#!/bin/bash
# Fix git conflicts and test netcat

echo "=== Fixing Git Conflicts ==="
# Stash local changes
git stash

# Pull latest changes
git pull origin main

echo ""
echo "=== Rebuilding Containers ==="
docker compose down
docker compose up -d --build

echo ""
echo "=== Waiting for services to start ==="
sleep 5

echo ""
echo "=== Testing Netcat Connection ==="
echo "Test log entry $(date)" | timeout 5 nc ${PASTEFORGE_SERVER:-your-server-ip} 99

echo ""
echo "=== Checking Backend Logs ==="
docker logs pasteforge-backend --tail 20


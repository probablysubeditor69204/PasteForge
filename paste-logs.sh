#!/bin/bash
# PasteForge - Quick log pasting script
# Usage: ./paste-logs.sh [log-file-path]

SERVER="${PASTEFORGE_SERVER:-your-server-ip}"
PORT="99"

if [ -z "$1" ]; then
    echo "Usage: $0 <log-file-path>"
    echo "Example: $0 /var/log/app.log"
    exit 1
fi

LOG_FILE="$1"

if [ ! -f "$LOG_FILE" ]; then
    echo "Error: Log file not found: $LOG_FILE"
    exit 1
fi

echo "Pasting logs from $LOG_FILE to PasteForge..."
tail -n 150 "$LOG_FILE" | nc "$SERVER" "$PORT"


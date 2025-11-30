# 🚀 Quick Start Guide

Get PasteForge running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- OR Node.js 20+ and Redis installed

## Option 1: Docker (Easiest)

```bash
# 1. Clone the repository
git clone https://github.com/probablysubeditor69204/PasteForge.git
cd PasteForge

# 2. Start all services
docker-compose up -d

# 3. Access the app
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

That's it! 🎉

## Option 2: Manual Setup

### Backend

```bash
cd backend
npm install
cp env.example .env
# Edit .env if needed

# Start Redis (if not using Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Start backend
npm start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:3000/api

# Start frontend
npm run dev
```

Access at: http://localhost:5173

## Testing the API

```bash
# Create a paste
curl -X POST http://localhost:3000/api/paste \
  -H "Content-Type: application/json" \
  -d '{
    "content": "console.log(\"Hello World\");",
    "language": "javascript",
    "expires": "24h"
  }'

# Get a paste (replace ID with actual ID from above)
curl http://localhost:3000/api/paste/YOUR_PASTE_ID
```

## Troubleshooting

### Redis Connection Error
- Make sure Redis is running: `docker ps | grep redis`
- Check Redis URL in backend/.env

### Frontend Can't Connect to API
- Check VITE_API_URL in frontend/.env
- For dev: use `http://localhost:3000/api`
- For production: use `/api` (nginx proxy)

### Port Already in Use
- Change ports in docker-compose.yml
- Or stop the service using the port

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the API documentation
- Customize the theme and settings

Happy pasting! 📝


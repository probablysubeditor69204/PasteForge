# 📝 PasteForge — Open Source Pastebin + CodeShare Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue.svg)](https://github.com/probablysubeditor69204/PasteForge)

PasteForge is a modern, open-source **Pastebin + Code Share** platform built for developers. It is lightweight, fast, Docker-ready, and designed to be self-hosted with zero bloat.

## ✨ Features

### 🔥 Core
- ⚡ Real-time syntax highlighting (highlight.js)
- 📝 Create text/code pastes instantly
- ⏰ Auto-expiring pastes (1h / 24h / 7d / never)
- 🔐 Optional password protection (bcrypt)
- 🌐 Create public or unlisted pastes
- 🔢 Line numbers, theme switch (dark/light)
- 📱 Mobile responsive UI (TailwindCSS)

### 🔐 Security Features
- 🔒 Password-protected pastes (bcrypt)
- 🛡️ Rate limiting (Redis-backed)
- 🗑️ Auto-delete on expiry
- 🚫 Safe mode: blocks HTML/script injection

### ⚙️ API Features
Public REST API:
- `POST /api/paste` — Create paste
- `GET  /api/paste/:id` — Fetch paste
- `POST /api/paste/:id/verify` — Verify password
- `DELETE /api/paste/:id` — Delete paste

**Netcat Support:**
- Pipe logs directly via netcat: `tail -f logfile | nc your-server 99`
- Returns paste URL automatically
- Perfect for sharing logs, errors, and terminal output

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/probablysubeditor69204/PasteForge.git
   cd PasteForge
   ```

2. **Set environment variables** (optional)
   ```bash
   export JWT_SECRET=your-secret-key-here
   ```

3. **Start with Docker Compose**
   ```bash
   # Use 'docker compose' (V2) or 'docker-compose' (V1)
   docker compose up -d
   # OR
   docker-compose up -d
   ```
   
   **Note:** If you get `Command 'docker-compose' not found`, try `docker compose` (no hyphen) which is included in newer Docker versions. Alternatively, install it with `sudo apt install docker-compose`.

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - Netcat: `nc localhost 99` (for piping logs)
   - Health check: http://localhost:3000/health
   
   **Note:** If port 80 is already in use, the frontend will run on port 8080. You can change this in `docker-compose.yml`.

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start Redis** (required)
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:7-alpine
   
   # Or install Redis locally
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:3000/api" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📖 API Documentation

### Netcat Usage (Command Line)

Pipe logs or text directly to PasteForge using netcat:

```bash
# Pipe a log file
tail -n 150 /var/log/app.log | nc your-server.com 99

# Pipe command output
ps aux | nc your-server.com 99

# Pipe from stdin
cat file.txt | nc your-server.com 99

# Real-time log streaming
tail -f /var/log/app.log | nc your-server.com 99
```

The server will return the paste URL automatically:
```
http://your-server.com:8080/XyT12AbC
```

### Create Paste

**Endpoint:** `POST /api/paste`

**Request Body:**
```json
{
  "content": "console.log('hello world');",
  "language": "javascript",
  "expires": "24h",
  "password": "optional-password"
}
```

**Response:**
```json
{
  "id": "XyT12AbC",
  "expires_in": 86400
}
```

### Get Paste

**Endpoint:** `GET /api/paste/:id`

**Response:**
```json
{
  "id": "XyT12AbC",
  "content": "console.log('hello world');",
  "language": "javascript",
  "expires_in": 86400,
  "protected": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**If password protected:**
```json
{
  "id": "XyT12AbC",
  "language": "javascript",
  "protected": true,
  "expires_in": 86400
}
```

### Verify Password

**Endpoint:** `POST /api/paste/:id/verify`

**Request Body:**
```json
{
  "password": "your-password"
}
```

**Response:** (Same as Get Paste, but with content)

### Delete Paste

**Endpoint:** `DELETE /api/paste/:id`

**Response:**
```json
{
  "success": true,
  "message": "Paste deleted successfully"
}
```

## 🧱 Project Structure

```
pasteforge/
│
├── backend/
│   ├── src/
│   │    ├── routes/          # API routes
│   │    ├── controllers/     # Request handlers
│   │    ├── services/        # Business logic
│   │    ├── middleware/      # Middleware (rate limiting, error handling)
│   │    └── utils/           # Utility functions
│   ├── app.js                # Express app entry point
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │    ├── pages/           # Page components
│   │    ├── utils/           # Utilities (API, theme)
│   │    └── styles/          # CSS styles
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
├── README.md
└── LICENSE
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3000
NODE_ENV=production
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379
FRONTEND_URL=http://your-server-ip:8080
JWT_SECRET=your-secret-key
```

**Note:** Set `FRONTEND_URL` to your server's public IP or domain for netcat responses to work correctly. You can also set it as an environment variable:
```bash
FRONTEND_URL=http://37.114.37.245:8080 docker-compose up -d
```

#### Frontend (.env)
```env
VITE_API_URL=/api
```

## 🐳 Docker Deployment

### Production Deployment

1. **Update docker-compose.yml** with your domain and SSL settings

2. **Add Nginx reverse proxy** (optional, for SSL)
   ```yaml
   nginx:
     image: nginx:alpine
     ports:
       - "443:443"
       - "80:80"
     volumes:
       - ./nginx.conf:/etc/nginx/nginx.conf
       - ./ssl:/etc/nginx/ssl
     depends_on:
       - frontend
   ```

3. **Set up SSL with Let's Encrypt**
   ```bash
   certbot certonly --standalone -d yourdomain.com
   ```

## 🔒 Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Configure rate limits** appropriately
4. **Set up firewall rules** for Redis
5. **Regularly update dependencies**

## 🧪 Development

### Running Tests (Future)
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Style
- ESLint for JavaScript
- Prettier for formatting (optional)

## 📦 Tech Stack

**Backend:**
- Node.js + Express
- Redis (storage + expiration)
- NanoID (short URLs)
- bcrypt (password hashing)

**Frontend:**
- Vite (build tool)
- TailwindCSS (styling)
- highlight.js (syntax highlighting)
- Vanilla JavaScript (no framework bloat)

**Deployment:**
- Docker + Docker Compose
- Nginx (reverse proxy)

## 🛣️ Roadmap

- [ ] File upload support
- [ ] User accounts & paste history
- [ ] Burn after reading mode
- [ ] Custom themes
- [ ] Embeddable paste widget
- [ ] QR code share
- [ ] GitHub OAuth login
- [ ] Admin panel
- [ ] API key system
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Hastebin, Pastebin, and other paste services
- Built with ❤️ for the open-source community

## ⭐ Star History

If you find this project useful, please consider giving it a star ⭐!

---

**Made with ❤️ by the PasteForge community**


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pasteRoutes from './routes/pasteRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for frontend
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Raw text HTTP endpoint (alternative to netcat)
import { createRawPaste } from './controllers/rawPasteController.js';
import { pasteCreateLimiter } from './middleware/rateLimiter.js';
app.post('/api/paste/raw', express.raw({ type: '*/*', limit: '10mb' }), pasteCreateLimiter, createRawPaste);

// API Routes
app.use('/api/paste', pasteRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 PasteForge API running on port ${PORT}`);
});

// Start netcat server
import './netcatServer.js';

export default app;


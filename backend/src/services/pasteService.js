import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import redisService from './redisService.js';
import { escapeHtml } from '../utils/security.js';

class PasteService {
  // Convert expiry string to seconds
  getExpirySeconds(expires) {
    const expiryMap = {
      '1h': 3600,
      '24h': 86400,
      '7d': 604800,
      'never': null
    };
    return expiryMap[expires] || 86400; // Default to 24h
  }

  async createPaste(data) {
    const { content, language = 'text', expires = '24h', password = null } = data;

    if (!content || content.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }

    // Generate unique ID
    const id = nanoid(8);
    
    // Hash password if provided
    let hashedPassword = null;
    if (password && password.trim().length > 0) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Escape HTML for safe storage
    const safeContent = escapeHtml(content);

    const pasteData = {
      id,
      content: safeContent,
      language: language || 'text',
      createdAt: new Date().toISOString(),
      protected: hashedPassword !== null,
      hashedPassword,
      expires: expires || '24h'
    };

    // Store in Redis with expiry
    const expirySeconds = this.getExpirySeconds(expires);
    await redisService.set(`paste:${id}`, pasteData, expirySeconds);

    return { id, expires_in: expirySeconds };
  }

  async getPaste(id) {
    const pasteData = await redisService.get(`paste:${id}`);
    
    if (!pasteData) {
      return null;
    }

    // Return paste without password hash
    const { hashedPassword, ...paste } = pasteData;
    
    return {
      ...paste,
      expires_in: this.getExpirySeconds(paste.expires)
    };
  }

  async verifyPassword(id, password) {
    const pasteData = await redisService.get(`paste:${id}`);
    
    if (!pasteData) {
      return false;
    }

    if (!pasteData.hashedPassword) {
      return true; // No password required
    }

    return await bcrypt.compare(password, pasteData.hashedPassword);
  }

  async deletePaste(id) {
    return await redisService.delete(`paste:${id}`);
  }

  async checkExists(id) {
    return await redisService.exists(`paste:${id}`);
  }
}

export default new PasteService();


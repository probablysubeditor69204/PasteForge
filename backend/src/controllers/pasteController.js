import pasteService from '../services/pasteService.js';
import { isValidExpiry, isValidLanguage } from '../utils/security.js';

export const createPaste = async (req, res, next) => {
  try {
    const { content, language, expires, password } = req.body;

    // Validation
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        error: 'Content is required and must be a string'
      });
    }

    if (content.length > 10 * 1024 * 1024) { // 10MB limit
      return res.status(400).json({
        error: 'Content too large (max 10MB)'
      });
    }

    if (expires && !isValidExpiry(expires)) {
      return res.status(400).json({
        error: 'Invalid expiry option. Must be: 1h, 24h, 7d, or never'
      });
    }

    if (language && !isValidLanguage(language)) {
      return res.status(400).json({
        error: 'Invalid language option'
      });
    }

    const result = await pasteService.createPaste({
      content,
      language: language || 'text',
      expires: expires || '24h',
      password: password || null
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPaste = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || id.length < 4) {
      return res.status(400).json({
        error: 'Invalid paste ID'
      });
    }

    const paste = await pasteService.getPaste(id);

    if (!paste) {
      return res.status(404).json({
        error: 'Paste not found or expired'
      });
    }

    // If protected, don't return content until verified
    if (paste.protected) {
      return res.json({
        id: paste.id,
        language: paste.language,
        protected: true,
        expires_in: paste.expires_in
      });
    }

    res.json(paste);
  } catch (error) {
    next(error);
  }
};

export const verifyPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        error: 'Password is required'
      });
    }

    const isValid = await pasteService.verifyPassword(id, password);

    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid password'
      });
    }

    // Password is correct, return the paste
    const paste = await pasteService.getPaste(id);
    
    if (!paste) {
      return res.status(404).json({
        error: 'Paste not found or expired'
      });
    }

    // Return full paste content
    res.json(paste);
  } catch (error) {
    next(error);
  }
};

export const deletePaste = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { token } = req.body; // Optional owner token (future feature)

    // For now, allow deletion without token (can be enhanced)
    const exists = await pasteService.checkExists(id);
    
    if (!exists) {
      return res.status(404).json({
        error: 'Paste not found or expired'
      });
    }

    await pasteService.deletePaste(id);

    res.json({
      success: true,
      message: 'Paste deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


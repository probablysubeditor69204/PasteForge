import pasteService from '../services/pasteService.js';

// Netcat/raw text paste endpoint
export const createRawPaste = async (req, res, next) => {
  try {
    // Get raw text from request body
    let content = '';
    
    if (Buffer.isBuffer(req.body)) {
      content = req.body.toString('utf8');
    } else if (typeof req.body === 'string') {
      content = req.body;
    } else {
      return res.status(400).send('Invalid content\n');
    }

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).send('Content cannot be empty\n');
    }

    if (content.length > 10 * 1024 * 1024) { // 10MB limit
      return res.status(400).send('Content too large (max 10MB)\n');
    }

    // Detect language from content (simple detection)
    let language = 'text';
    const firstLine = content.split('\n')[0] || '';
    
    if (firstLine.includes('#!/bin/bash') || firstLine.includes('#!/bin/sh')) {
      language = 'bash';
    } else if (firstLine.includes('#!/usr/bin/env python') || firstLine.includes('#!/usr/bin/python')) {
      language = 'python';
    } else if (firstLine.includes('#!/usr/bin/env node')) {
      language = 'javascript';
    }

    // Create paste with default 24h expiry
    const result = await pasteService.createPaste({
      content,
      language,
      expires: '24h',
      password: null
    });

    // Return plain text URL (netcat-friendly)
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const url = `${baseUrl}/${result.id}\n`;
    
    res.status(201).type('text/plain').send(url);
  } catch (error) {
    console.error('Raw paste error:', error);
    res.status(500).send(`Error: ${error.message}\n`);
  }
};


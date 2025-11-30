import net from 'net';
import pasteService from './services/pasteService.js';
import dotenv from 'dotenv';

dotenv.config();

const NETCAT_PORT = process.env.NETCAT_PORT || 99;

// Simple language detection
function detectLanguage(content) {
  const firstLine = content.split('\n')[0] || '';
  
  if (firstLine.includes('#!/bin/bash') || firstLine.includes('#!/bin/sh')) {
    return 'bash';
  } else if (firstLine.includes('#!/usr/bin/env python') || firstLine.includes('#!/usr/bin/python')) {
    return 'python';
  } else if (firstLine.includes('#!/usr/bin/env node')) {
    return 'javascript';
  } else if (content.includes('<?php')) {
    return 'php';
  } else if (content.includes('function') && content.includes('=>')) {
    return 'javascript';
  } else if (content.includes('def ') && content.includes('import ')) {
    return 'python';
  }
  
  return 'text';
}

const server = net.createServer((socket) => {
  let data = '';
  
  socket.setTimeout(30000); // 30 second timeout
  
  socket.on('data', (chunk) => {
    data += chunk.toString('utf8');
    
    // Limit to 10MB
    if (data.length > 10 * 1024 * 1024) {
      socket.write('Error: Content too large (max 10MB)\n');
      socket.end();
      return;
    }
  });
  
  socket.on('end', async () => {
    try {
      if (!data || data.trim().length === 0) {
        socket.write('Error: Empty content\n');
        socket.destroy();
        return;
      }
      
      // Detect language
      const language = detectLanguage(data);
      
      // Create paste
      const result = await pasteService.createPaste({
        content: data,
        language,
        expires: '24h',
        password: null
      });
      
      // Return URL
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      const url = `${baseUrl}/${result.id}\n`;
      
      socket.write(url);
      socket.destroy();
    } catch (error) {
      console.error('Netcat paste error:', error);
      socket.write(`Error: ${error.message}\n`);
      socket.destroy();
    }
  });
  
  // Handle connection close
  socket.on('close', () => {
    // Connection closed
  });
  
  socket.on('timeout', () => {
    socket.write('Error: Connection timeout\n');
    socket.end();
  });
  
  socket.on('error', (err) => {
    console.error('Netcat socket error:', err);
    socket.end();
  });
});

server.listen(NETCAT_PORT, () => {
  console.log(`📡 Netcat server listening on port ${NETCAT_PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${NETCAT_PORT} is already in use`);
  } else {
    console.error('Netcat server error:', err);
  }
});

export default server;


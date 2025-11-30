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
  let isProcessing = false;
  
  socket.setTimeout(30000); // 30 second timeout
  socket.setNoDelay(true); // Disable Nagle algorithm for immediate response
  
  const processData = async () => {
    if (isProcessing) return;
    isProcessing = true;
    
    try {
      if (!data || data.trim().length === 0) {
        socket.write('Error: Empty content\n', 'utf8', () => {
          socket.destroy();
        });
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
      
      // Return URL - wait for write to complete before closing
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      const url = `${baseUrl}/${result.id}\n`;
      
      console.log(`[Netcat] Created paste ${result.id}, sending URL: ${url}`);
      
      socket.write(url, 'utf8', () => {
        // Response sent, now close the connection
        socket.end();
      });
    } catch (error) {
      console.error('Netcat paste error:', error);
      const errorMsg = `Error: ${error.message}\n`;
      socket.write(errorMsg, 'utf8', () => {
        socket.destroy();
      });
    }
  };
  
  socket.on('data', (chunk) => {
    data += chunk.toString('utf8');
    console.log('[Netcat] Received data chunk, total length:', data.length);
    
    // Limit to 10MB
    if (data.length > 10 * 1024 * 1024) {
      socket.write('Error: Content too large (max 10MB)\n', 'utf8', () => {
        socket.end();
      });
      return;
    }
  });
  
  socket.on('end', () => {
    console.log('[Netcat] Socket end event, data length:', data.length);
    processData();
  });
  
  // Handle connection close
  socket.on('close', (hadError) => {
    console.log('[Netcat] Socket closed, hadError:', hadError, 'data length:', data.length, 'isProcessing:', isProcessing);
    if (!isProcessing && data && data.trim().length > 0) {
      console.log('[Netcat] Processing data on close event');
      processData();
    }
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

server.listen(NETCAT_PORT, '0.0.0.0', () => {
  console.log(`📡 Netcat server listening on 0.0.0.0:${NETCAT_PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${NETCAT_PORT} is already in use`);
  } else {
    console.error('Netcat server error:', err);
  }
});

export default server;


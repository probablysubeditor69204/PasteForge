import rateLimit from 'express-rate-limit';
import redisService from '../services/redisService.js';

// Create rate limiter using Redis if available, otherwise memory
export const createRateLimiter = (windowMs, max) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    },
    // Use Redis store if available
    store: redisService.client && redisService.client.isOpen
      ? undefined // Use default memory store for now (can be enhanced with Redis store)
      : undefined
  });
};

// Rate limiter for paste creation
export const pasteCreateLimiter = createRateLimiter(15 * 60 * 1000, 50); // 50 requests per 15 minutes

// Rate limiter for password verification
export const passwordVerifyLimiter = createRateLimiter(5 * 60 * 1000, 20); // 20 requests per 5 minutes


import express from 'express';
import {
  createPaste,
  getPaste,
  verifyPassword,
  deletePaste
} from '../controllers/pasteController.js';
import { pasteCreateLimiter, passwordVerifyLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Create paste (rate limited)
router.post('/', pasteCreateLimiter, createPaste);

// Get paste
router.get('/:id', getPaste);

// Verify password
router.post('/:id/verify', passwordVerifyLimiter, verifyPassword);

// Delete paste
router.delete('/:id', deletePaste);

export default router;


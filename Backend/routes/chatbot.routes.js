import express from 'express';
import { handleChatMessage } from '../controllers/chatbot.controller.js';

const router = express.Router();

// Public route - anyone can chat
router.post('/message', handleChatMessage);

export default router;

import { Router } from 'express';
import { protect } from '../services/authService';
import { getAllChat, getLastBotChat } from '../services/chatService';

const router = Router();

router.get('/', protect, getAllChat);
router.get('/last-bot-chat', protect, getLastBotChat);

export default router;

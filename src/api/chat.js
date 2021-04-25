import { Router } from 'express';

import { getAllChat } from '../services/chatService';

const router = Router();

router.get('/', async (req, res) => {
    getAllChat(req, res);
});

export default router;

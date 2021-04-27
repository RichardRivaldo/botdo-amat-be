import { Router } from 'express';
import { signup, login, protect, getUser } from '../services/authService';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/checkUser', protect, getUser);

export default router;

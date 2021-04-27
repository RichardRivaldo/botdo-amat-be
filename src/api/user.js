import { Router } from 'express';
import { signup, login, protect, getUser } from '../services/authService';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/check-user', protect, getUser);

export default router;

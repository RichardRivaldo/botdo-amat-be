import { Router } from 'express';
import { task } from '../services/taskService';
import { protect } from '../services/authService';

const router = Router();

router.get('/', protect, task);

export default router;

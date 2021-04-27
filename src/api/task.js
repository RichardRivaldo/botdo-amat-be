import { Router } from 'express';
import { task } from '../services/taskService';
import { protect } from '../services/authService';

const router = Router();

router.post('/', protect, task);

export default router;

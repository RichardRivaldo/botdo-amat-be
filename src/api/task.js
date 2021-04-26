import { Router } from 'express';
import { task } from '../services/taskService';

const router = Router();

router.get('/', task);

export default router;

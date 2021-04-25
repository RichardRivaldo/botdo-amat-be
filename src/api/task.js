import { Router } from 'express';

import { getAllTask } from '../services/taskService';

const router = Router();

router.get('/', async (req, res) => {
    getAllTask(req, res);
});

export default router;

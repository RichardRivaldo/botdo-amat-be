import { Router } from 'express';
import TaskRoutes from './task';
import ChatRoutes from './chat';

export default () => {
    const app = Router();

    app.use('/task', TaskRoutes);
    app.use('/chat', ChatRoutes);

    return app;
};

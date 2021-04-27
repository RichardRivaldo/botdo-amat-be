import { Router } from 'express';
import TaskRoutes from './task';
import ChatRoutes from './chat';
import UserRoutes from './user';

export default () => {
    const app = Router();

    app.use('/task', TaskRoutes);
    app.use('/chat', ChatRoutes);
    app.use('/user', UserRoutes);

    return app;
};

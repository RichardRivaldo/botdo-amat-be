require('@babel/register');

import config from './config';
import express from 'express';
import Logger from './loaders/logger';
import mongoConnect from './loaders/mongo';
import mainLoader from './loaders';

async function startServer() {
    const app = express();

    await mainLoader({ expressApp: app });

    mongoConnect.then(() => {
        Logger.info('Connected to Mongo DB!');
    });

    app.listen(config.port, err => {
        if (err) {
            Logger.error(err);
            process.exit(1);
            return;
        }
        Logger.info(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
      `);
    });
}

startServer();

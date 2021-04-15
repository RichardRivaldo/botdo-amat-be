import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import servicesLoader from './services';
import Logger from './logger';

export default async ({ expressApp }) => {
    await dependencyInjectorLoader();
    Logger.info('✌️ Dependency Injector loaded');

    servicesLoader();
    Logger.info('✌️ Service loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
};

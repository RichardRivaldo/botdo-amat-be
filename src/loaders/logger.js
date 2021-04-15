import winston from 'winston';
import config from '../config';

const transports = [];
if (process.env.NODE_ENV !== 'development') {
    transports.push(new winston.transports.Console());
    transports.push(new winston.transports.File({ filename: 'production.log' }));
} else {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.splat()),
        }),
    );
    transports.push(new winston.transports.File({ filename: 'dev.log' }));
}

const LoggerInstance = winston.createLogger({
    transports,
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(
            info =>
                `${JSON.stringify({
                    level: info.level,
                    timestamp: info.timestamp,
                    name: info.name,
                    message: info.message,
                })}`,
        ),
    ),
});

export default LoggerInstance;

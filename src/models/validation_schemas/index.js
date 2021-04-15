import { Joi } from 'celebrate';

export const environmentsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production')
        .required(),
    PORT: Joi.number().required(),
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
        .required(),
}).unknown(true);

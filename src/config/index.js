import dotenv from 'dotenv';
import { environmentsSchema } from '../models/validation_schemas';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const configLoading = dotenv.config({ path: `${__dirname}/../../.env` });

if (process.env.NODE_ENV === 'development' && configLoading.error) {
    throw new Error('Could not find env file! Server is closing!');
}

const { error } = environmentsSchema.validate(process.env);
if (error) {
    throw new Error(`Environment variables don't meet specification ${error}`);
}

const environments = {
    port: parseInt(process.env.PORT, 10),
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    api: {
        prefix: process.env.API_PREFIX,
    },
};

export default { ...environments };

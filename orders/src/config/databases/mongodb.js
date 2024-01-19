import { connect, connection } from 'mongoose';
import envVariables from '../envVariables';
import logger from '../../logs/logger';

const { MONGODB_HOST, MONGODB_PORT, MONGODB_NAME } = envVariables;

export default async () => {
  try {
    await connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`);

    connection.on('error', error => {
      throw error;
    });

    logger.info('Connected to MongoDB');
  } catch (error) {
    const errorMessage = `Error connecting to MongoDB: ${error}`;

    logger.error(errorMessage);

    throw errorMessage;
  }
};

import { connect, connection } from 'mongoose';
import envVariables from '../config/envVariables';
import logger from '../logs/logger';

const { MONGODB_NAME } = envVariables;

export default async () => {
  try {
    await connect(`mongodb://mongodb:27017/${MONGODB_NAME}`);

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

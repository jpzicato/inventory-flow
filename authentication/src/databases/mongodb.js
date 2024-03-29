import { connect, connection } from 'mongoose';
import envVariables from '../config/envVariables';
import logger from '../logs/logger';
import { generateErrorMessage } from '../utils/errorHelpers';

export default async () => {
  try {
    await connect(`mongodb://mongodb:27017/${envVariables.MONGODB_NAME}`);

    connection.on('error', error => {
      throw error;
    });

    logger.info('Connected to MongoDB');
  } catch (error) {
    const errorMessage = generateErrorMessage(
      'Error connecting to MongoDB',
      error
    );

    logger.error(errorMessage);

    throw errorMessage;
  }
};

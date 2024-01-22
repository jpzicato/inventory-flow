import { createClient } from 'redis';
import logger from '../logs/logger';
import { generateErrorMessage } from '../utils/errorHelpers';

export const client = createClient({
  url: `redis://redis:6379`,
});

export default async () => {
  try {
    client.on('error', error => {
      throw error;
    });

    await client.connect();

    logger.info('Connected to Redis');
  } catch (error) {
    const errorMessage = generateErrorMessage(
      'Error connecting to Redis',
      error
    );

    logger.error(errorMessage);

    throw errorMessage;
  }
};

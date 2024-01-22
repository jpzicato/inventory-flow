import { createClient } from 'redis';
import logger from '../logs/logger';
import { generateErrorMessage } from '../utils/errorHelpers';

export const redisClient = createClient({
  url: `redis://redis:6379`,
});

export const runRedisConnection = async () => {
  try {
    redisClient.on('error', error => {
      throw error;
    });

    await redisClient.connect();

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

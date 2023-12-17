import { createClient } from 'redis';
import logger from '../../logs/logger';
import { generateErrorMessage } from '../../utils/errorHelpers';
import envVariables from '../envVariables';

const { REDIS_HOST, REDIS_PORT } = envVariables;

export const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
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

    throw new Error(errorMessage);
  }
};

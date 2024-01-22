import { client as redisClient } from '../databases/redis';
import envVariables from '../config/envVariables';

const { REDIS_EXPIRATION } = envVariables;

export const redisSetCommandOptions = {
  EX: REDIS_EXPIRATION,
};

export const deleteRedisKeys = async prefix => {
  const redisKeys = await redisClient.keys(`${prefix}*`);

  redisKeys.forEach(key => redisClient.del(key));
};

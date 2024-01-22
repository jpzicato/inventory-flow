import { redisClient } from '../databases/redis';

export const deleteRedisKeys = async prefix => {
  const redisKeys = await redisClient.keys(`${prefix}*`);

  redisKeys.forEach(key => redisClient.del(key));
};

import { redisClient } from '../databases/redis';

export default async prefix => {
  const redisKeys = await redisClient.keys(`${prefix}*`);

  redisKeys.forEach(key => redisClient.del(key));
};

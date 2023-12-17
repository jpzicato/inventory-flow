import app from './app';
import envVariables from './config/envVariables';
import runMongoDBConnection from './config/databases/mongodb';
import { runRedisConnection } from './config/databases/redis';
import logger from './logs/logger';

const { HOST_ORDERS_PORT, CONTAINER_ORDERS_PORT } = envVariables;

const runApp = async () => {
  try {
    await runMongoDBConnection();
    await runRedisConnection();

    app.listen(CONTAINER_ORDERS_PORT, () => {
      logger.info(
        `Server listening on URL http://localhost:${HOST_ORDERS_PORT}`
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};

runApp();

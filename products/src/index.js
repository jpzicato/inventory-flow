import app from './app';
import envVariables from './config/envVariables';
import runMongoDBConnection from './config/databases/mongodb';
import { runRedisConnection } from './config/databases/redis';
import logger from './logs/logger';
import runSeed from './seed';

const { HOST_PRODUCTS_PORT, CONTAINER_PRODUCTS_PORT } = envVariables;

const runApp = async () => {
  try {
    await runMongoDBConnection();
    await runRedisConnection();

    await runSeed();

    app.listen(CONTAINER_PRODUCTS_PORT, () => {
      logger.info(
        `Server listening on URL http://localhost:${HOST_PRODUCTS_PORT}`
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};

runApp();

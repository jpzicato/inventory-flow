import app from './app';
import envVariables from './config/envVariables';
import runMongoDBConnection from './databases/mongodb';
import { runRedisConnection } from './databases/redis';
import logger from './logs/logger';
import runSeed from './seed';

const { HOST_PRODUCTS_PORT, CONTAINER_PRODUCTS_PORT } = envVariables;

const runApp = async () => {
  await runMongoDBConnection();
  await runRedisConnection();

  await runSeed();

  app.listen(CONTAINER_PRODUCTS_PORT, () =>
    logger.info(
      `Server listening on URL http://localhost:${HOST_PRODUCTS_PORT}`
    )
  );
};

runApp();

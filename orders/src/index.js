import app from './app';
import envVariables from './config/envVariables';
import runMongoDBConnection from './databases/mongodb';
import runRedisConnection from './databases/redis';
import logger from './logs/logger';

const { HOST_ORDERS_PORT } = envVariables;

const runApp = async () => {
  await runMongoDBConnection();
  await runRedisConnection();

  app.listen(8080, () =>
    logger.info(`Server listening on URL http://localhost:${HOST_ORDERS_PORT}`)
  );
};

runApp();

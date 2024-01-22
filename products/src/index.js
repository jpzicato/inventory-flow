import app from './app';
import envVariables from './config/envVariables';
import runMongoDBConnection from './databases/mongodb';
import runRedisConnection from './databases/redis';
import logger from './logs/logger';
import runSeed from './seed';

const runApp = async () => {
  await runMongoDBConnection();
  await runRedisConnection();

  await runSeed();

  app.listen(8080, () =>
    logger.info(
      `Server listening on URL http://localhost:${envVariables.HOST_PRODUCTS_PORT}`
    )
  );
};

runApp();

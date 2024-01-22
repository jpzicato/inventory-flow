import app from './app';
import envVariables from './config/envVariables';
import logger from './logs/logger';
import { runMysqlConnection } from './databases/mysql';
import runMongoDBConnection from './databases/mongodb';
import { runRedisConnection } from './databases/redis';
import runSeed from './seed';

const { HOST_AUTHENTICATION_PORT } = envVariables;

const runApp = async () => {
  await runMysqlConnection();
  await runMongoDBConnection();
  await runRedisConnection();

  await runSeed();

  app.listen(8080, () =>
    logger.info(
      `Server listening on URL http://localhost:${HOST_AUTHENTICATION_PORT}`
    )
  );
};

runApp();

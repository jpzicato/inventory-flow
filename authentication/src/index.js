import app from './app';
import envVariables from './config/envVariables';
import logger from './logs/logger';
import { runMysqlConnection } from './config/databases/mysql';
import runMongoDBConnection from './config/databases/mongodb';
import { runRedisConnection } from './config/databases/redis';
import runSeed from './seed';

const { HOST_AUTHENTICATION_PORT, CONTAINER_AUTHENTICATION_PORT } =
  envVariables;

const runApp = async () => {
  try {
    await runMysqlConnection();
    await runMongoDBConnection();
    await runRedisConnection();

    await runSeed();

    app.listen(CONTAINER_AUTHENTICATION_PORT, () => {
      logger.info(
        `Server listening on URL http://localhost:${HOST_AUTHENTICATION_PORT}`
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};

runApp();

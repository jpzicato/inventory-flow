import { Sequelize } from 'sequelize';
import envVariables from '../envVariables';
import logger from '../../logs/logger';
import { generateErrorMessage } from '../../utils/errorHelpers';

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } =
  envVariables;

export const mysqlConnection = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: 'mysql',
    logging: message => logger.debug(message),
  }
);

export const runMysqlConnection = async () => {
  try {
    await mysqlConnection.authenticate();
    await mysqlConnection.sync();

    logger.info('Connected to Mysql');
  } catch (error) {
    const errorMessage = generateErrorMessage(
      'Error connecting to Mysql',
      error
    );

    logger.error(errorMessage);

    throw new Error(errorMessage);
  }
};

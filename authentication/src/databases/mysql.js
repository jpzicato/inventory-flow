import { Sequelize } from 'sequelize';
import envVariables from '../config/envVariables';
import logger from '../logs/logger';
import { generateErrorMessage } from '../utils/errorHelpers';

const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = envVariables;

export const connection = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: 'mysql',
    port: 3306,
    dialect: 'mysql',
    logging: message => logger.debug(message),
  }
);

export default async () => {
  try {
    await connection.authenticate();
    await connection.sync();

    logger.info('Connected to Mysql');
  } catch (error) {
    const errorMessage = generateErrorMessage(
      'Error connecting to Mysql',
      error
    );

    logger.error(errorMessage);

    throw errorMessage;
  }
};

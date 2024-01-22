import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'HOST_AUTHENTICATION_PORT',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
  'MONGODB_NAME',
  'REDIS_EXPIRATION',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'ACCESS_TOKEN_EXPIRATION',
];

export default Object.fromEntries(
  requiredVariables.map(variable => {
    if (!process.env[variable])
      throw new Error(`Environment variable ${variable} is not set`);

    return [variable, process.env[variable]];
  })
);

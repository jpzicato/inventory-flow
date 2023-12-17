import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'HOST_PRODUCTS_PORT',
  'CONTAINER_PRODUCTS_PORT',
  'MONGODB_HOST',
  'MONGODB_PORT',
  'MONGODB_NAME',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_EXPIRATION',
  'AUTHENTICATION_HOST',
  'AUTHENTICATION_PORT',
];

export default Object.fromEntries(
  requiredVariables.map(variable => {
    if (!process.env[variable])
      throw new Error(`Environment variable ${variable} is not set`);

    return [variable, process.env[variable]];
  })
);

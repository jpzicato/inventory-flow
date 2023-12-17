import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'HOST_ORDERS_PORT',
  'CONTAINER_ORDERS_PORT',
  'MONGODB_HOST',
  'MONGODB_PORT',
  'MONGODB_NAME',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_EXPIRATION',
  'AUTHENTICATION_HOST',
  'AUTHENTICATION_PORT',
  'PRODUCTS_HOST',
  'PRODUCTS_PORT',
];

export default Object.fromEntries(
  requiredVariables.map(variable => {
    if (!process.env[variable])
      throw new Error(`Environment variable ${variable} is not set`);

    return [variable, process.env[variable]];
  })
);

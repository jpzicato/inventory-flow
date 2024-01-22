import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'HOST_PRODUCTS_PORT',
  'MONGODB_NAME',
  'REDIS_EXPIRATION',
];

export default Object.fromEntries(
  requiredVariables.map(variable => {
    if (!process.env[variable])
      throw new Error(`Environment variable ${variable} is not set`);

    return [variable, process.env[variable]];
  })
);

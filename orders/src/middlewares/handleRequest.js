import logger from '../logs/logger';

export const logRequest = (req, _res, next) => {
  logger.info(`Request received: ${req.method} ${req.url}`);

  next();
};

export const notFoundRequest = (_req, res) => {
  res.sendStatus(404);
};

// eslint-disable-next-line no-unused-vars
export const errorRequest = (error, _req, res, _next) => {
  const errorMessage = `Request failed: ${error}`;

  logger.error(errorMessage);

  res.status(500).send(errorMessage);
};

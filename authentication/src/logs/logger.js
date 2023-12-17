import { join } from 'path';
import { format, transports, createLogger } from 'winston';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const definedTransports = [
  new transports.Console(),
  new transports.File({
    filename: join(__dirname, 'error.log'),
    level: 'error',
  }),
  new transports.File({ filename: join(__dirname, 'combined.log') }),
];

export default createLogger({
  format: combine(timestamp(), logFormat),
  transports: definedTransports,
});

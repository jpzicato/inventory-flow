import express, { json, urlencoded } from 'express';
import {
  logRequest,
  notFoundRequest,
  errorRequest,
} from './middlewares/handleRequest';
import routes from './routes';
import { serve, setup } from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import envVariables from './config/envVariables';
import corsMiddleware from './middlewares/cors';

const openapiSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication microservice',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${envVariables.HOST_AUTHENTICATION_PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
});

const app = express();

export default app
  .use(
    corsMiddleware,
    json(),
    urlencoded({
      extended: false,
    }),
    logRequest
  )
  .use('/', routes)
  .use('/docs', serve, setup(openapiSpecification))
  .use('/*', notFoundRequest)
  .use(errorRequest);

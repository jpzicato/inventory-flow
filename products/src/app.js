import express, { json, urlencoded } from 'express';
import {
  logRequest,
  notFoundRequest,
  errorRequest,
} from './middlewares/handleRequest';
import routes from './routes';
import verifyUserCredentials from './middlewares/verifyUserCredentials';
import { serve, setup } from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import envVariables from './config/envVariables';
import corsMiddleware from './middlewares/cors';

const openapiSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products microservice',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${envVariables.HOST_PRODUCTS_PORT}/api`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
});

const app = express();

export default app
  .use(corsMiddleware)
  .use(json())
  .use(
    urlencoded({
      extended: false,
    })
  )
  .use(logRequest)
  .use('/api', verifyUserCredentials, routes)
  .use('/docs', serve, setup(openapiSpecification))
  .use('/*', notFoundRequest)
  .use(errorRequest);

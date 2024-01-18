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
import cors from 'cors';

const { HOST_AUTHENTICATION_PORT } = envVariables;

const openapiSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication microservice',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${HOST_AUTHENTICATION_PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
});

const app = express();

export default app
  .use(cors())
  .use(json())
  .use(
    urlencoded({
      extended: false,
    })
  )
  .use(logRequest)
  .use('/', routes)
  .use('/docs', serve, setup(openapiSpecification))
  .use('/*', notFoundRequest)
  .use(errorRequest);

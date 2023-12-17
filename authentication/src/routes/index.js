import { Router } from 'express';
import authenticationRouter from './authentication';
import usersRouter from './users';
import rolesRouter from './roles';
import {
  authorizeAccessToken,
  verifyUserPermissions,
} from '../middlewares/verifyUserCredentials';

const router = Router();

export default router
  .use('/authentication', authenticationRouter)
  .use('/users', authorizeAccessToken, verifyUserPermissions, usersRouter)
  .use('/roles', authorizeAccessToken, verifyUserPermissions, rolesRouter);

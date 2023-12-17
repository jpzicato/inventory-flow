import { Router } from 'express';
import {
  signUp,
  logIn,
  renewAccessToken,
  logOut,
  verifyUserCredentials,
} from '../controllers/authentication';
import {
  authorizeAccessToken,
  verifyUserPermissions,
} from '../middlewares/verifyUserCredentials';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Authentication
 */
export default router

  /**
   * @openapi
   * /authentication/sign-up:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: User registration
   *     description: Creates a new user account and returns authentication tokens.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: User name.
   *                 example: john
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User email address.
   *                 example: john@email.com
   *               password:
   *                 type: string
   *                 description: User password. Must contain at least 8 characters including at least 1 uppercase, 1 lowercase and one number.
   *                 example: Secret88
   *               repeat_password:
   *                 type: string
   *                 description: Repetition of password to verify match.
   *                 example: Secret88
   *     responses:
   *       '201':
   *         description: User successfully registered.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: Token to access routes.
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY5NzY2NzEwOSwiZXhwIjoxNjk3NjcwNzA5fQ.cEfpYk-245CQ0n6xHCOa0bf1FA9LgNT0YhC1rSQNBCY
   *                 refreshToken:
   *                   type: string
   *                   description: Token to obtain a new access token.
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY5NzY2NzEwOX0.EyQpv5XR9to79Hxk9fKjslNAgyZrz5bAJSuHGBi0mug
   *       '400':
   *         description: The request body contains invalid or missing data.
   *       '500':
   *         description: Internal server error.
   */
  .post('/sign-up', signUp)

  /**
   * @openapi
   * /authentication/log-in:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: User log in
   *     description: Authenticates a user by validating their email and password, then returns authentication tokens.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User email address.
   *                 example: john@email.com
   *               password:
   *                 type: string
   *                 description: User password.
   *                 example: Secret88
   *     responses:
   *       '200':
   *         description: User successfully authenticated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: Token to access routes.
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY5NzY2NzEwOSwiZXhwIjoxNjk3NjcwNzA5fQ.cEfpYk-245CQ0n6xHCOa0bf1FA9LgNT0YhC1rSQNBCY
   *                 refreshToken:
   *                   type: string
   *                   description: Token to obtain a new access token.
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY5NzY2NzEwOX0.EyQpv5XR9to79Hxk9fKjslNAgyZrz5bAJSuHGBi0mug
   *       '400':
   *         description: The request body contains invalid or missing data or user already logged in.
   *       '401':
   *         description: User authentication failed due to incorrect credentials.
   *       '404':
   *         description: User not found.
   *       '500':
   *         description: Internal server error.
   */
  .post('/log-in', logIn)

  /**
   * @openapi
   * /authentication/renew-access-token:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Renew access token
   *     description: Renews the access token using a valid refresh token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refresh_token:
   *                 type: string
   *                 description: Refresh token to renew the access token.
   *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY5NzY2MTY1Nn0.lmINWTQ6mJmaWWW8W0kNxZcFc0RhnSwA15mGJPjzskY
   *     responses:
   *       '200':
   *         description: Access token successfully renewed.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: Token to access routes.
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY5NzY2NzEwOSwiZXhwIjoxNjk3NjcwNzA5fQ.cEfpYk-245CQ0n6xHCOa0bf1FA9LgNT0YhC1rSQNBCY
   *                 refreshToken:
   *                   type: string
   *                   description: Token to obtain a new access token.
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY5NzY2NzEwOX0.EyQpv5XR9to79Hxk9fKjslNAgyZrz5bAJSuHGBi0mug
   *       '400':
   *         description: The request body contains invalid or missing data.
   *       '404':
   *         description: The provided refresh token does not belong to a user.
   *       '500':
   *         description: Internal server error.
   */
  .post('/renew-access-token', renewAccessToken)

  /**
   * @openapi
   * /authentication/log-out:
   *   delete:
   *     tags:
   *       - Authentication
   *     summary: User log out
   *     description: Logs out a user by deleting their refresh token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refresh_token:
   *                 type: string
   *                 description: Refresh token to delete and log out the user.
   *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY5NzY2MTY1Nn0.lmINWTQ6mJmaWWW8W0kNxZcFc0RhnSwA15mGJPjzskY
   *     responses:
   *       '204':
   *         description: User successfully logged out.
   *       '400':
   *         description: The request body contains invalid or missing data.
   *       '404':
   *         description: The provided refresh token does not belong to a user.
   *       '500':
   *         description: Internal server error.
   */
  .delete('/log-out', logOut)

  .post(
    '/verify-user-credentials',
    authorizeAccessToken,
    verifyUserPermissions,
    verifyUserCredentials
  );

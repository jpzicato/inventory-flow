import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getRoleUsers,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/users';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Users
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: 'http'
 *       scheme: 'bearer'
 *       bearerFormat: 'JWT'
 */
export default router

  /**
   * @openapi
   * /users:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get users
   *     description: Get a list of users.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page_number
   *         schema:
   *           type: integer
   *         description: The page number for pagination.
   *       - in: query
   *         name: page_size
   *         schema:
   *           type: integer
   *         description: The number of items per page for pagination.
   *     responses:
   *       '200':
   *         description: List of users.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         description: The unique identifier of the user.
   *                         example: 1
   *                       name:
   *                         type: string
   *                         description: The name of the user.
   *                         example: john
   *                       email:
   *                         type: string
   *                         description: The email address of the user.
   *                         example: john.doe@email.com
   *                       createdAt:
   *                         type: string
   *                         description: The timestamp when the user was created.
   *                         example: 2023-10-08T14:06:36.000Z
   *                       updatedAt:
   *                         type: string
   *                         description: The timestamp when the user was last updated.
   *                         example: 2023-10-08T14:06:47.000Z
   *                       RoleId:
   *                         type: integer
   *                         description: The role identifier of the user.
   *                         example: 1
   *                 page_number:
   *                   type: integer
   *                   description: The current page number for pagination.
   *                   example: 1
   *                 page_size:
   *                   type: integer
   *                   description: The number of items per page.
   *                   example: 10
   *                 total_pages:
   *                   type: integer
   *                   description: The total number of pages.
   *                   example: 3
   *                 total_items:
   *                   type: integer
   *                   description: The total number of users.
   *                   example: 26
   *       '400':
   *         description: The page_number and page_size parameters cannot be used separately.
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: No users found or no more users available.
   *       '500':
   *         description: Internal server error.
   */
  .get('/', getUsers)

  /**
   * @openapi
   * /users/role/{role_id}:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get users by role
   *     description: Get a list of users by role.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: role_id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The id of the role for which to retrieve users.
   *       - in: query
   *         name: page_number
   *         schema:
   *           type: integer
   *         description: The page number for pagination.
   *       - in: query
   *         name: page_size
   *         schema:
   *           type: integer
   *         description: The number of items per page for pagination.
   *     responses:
   *       '200':
   *         description: List of users.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         description: The unique identifier of the user.
   *                         example: 1
   *                       name:
   *                         type: string
   *                         description: The name of the user.
   *                         example: John Doe
   *                       email:
   *                         type: string
   *                         description: The email address of the user.
   *                         example: john.doe@email.com
   *                       createdAt:
   *                         type: string
   *                         description: The timestamp when the user was created.
   *                         example: 2023-10-08T14:06:36.000Z
   *                       updatedAt:
   *                         type: string
   *                         description: The timestamp when the user was last updated.
   *                         example: 2023-10-08T14:06:47.000Z
   *                       RoleId:
   *                         type: integer
   *                         description: The role identifier of the user.
   *                         example: 1
   *                 page_number:
   *                   type: integer
   *                   description: The current page number for pagination.
   *                   example: 1
   *                 page_size:
   *                   type: integer
   *                   description: The number of items per page.
   *                   example: 10
   *                 total_pages:
   *                   type: integer
   *                   description: The total number of pages.
   *                   example: 3
   *                 total_items:
   *                   type: integer
   *                   description: The total number of users.
   *                   example: 26
   *       '400':
   *         description: The page_number and page_size parameters cannot be used separately or the provided role_id parameter does not belongs to a role.
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: No users found or no more users available for the provided role_id.
   *       '500':
   *         description: Internal server error.
   */
  .get('/role/:role_id', getRoleUsers)

  /**
   * @openapi
   * /users/{user_id}:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get user by id
   *     description: Get a user by their unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The unique identifier of the user.
   *     responses:
   *       '200':
   *         description: User information.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: The unique identifier of the user.
   *                   example: 1
   *                 name:
   *                   type: string
   *                   description: The name of the user.
   *                   example: john
   *                 email:
   *                   type: string
   *                   description: The email address of the user.
   *                   example: john.doe@email.com
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the user was created.
   *                   example: 2023-10-08T14:06:36.000Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the user was last updated.
   *                   example: 2023-10-08T14:06:47.000Z
   *                 RoleId:
   *                   type: integer
   *                   description: The role identifier of the user.
   *                   example: 1
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: User not found.
   *       '500':
   *         description: Internal server error.
   */
  .get('/:user_id', getUser)

  /**
   * @openapi
   * /users:
   *   post:
   *     tags:
   *       - Users
   *     summary: Create user
   *     description: Create a new user.
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the user.
   *                 example: john
   *               email:
   *                 type: string
   *                 description: The email address of the user.
   *                 example: john.doe@email.com
   *               password:
   *                 type: string
   *                 description: The password of the user.
   *                 example: Mysecurepassword1
   *               role_id:
   *                 type: integer
   *                 description: The role identifier of the user (optional).
   *                 example: 1
   *                 default: 3
   *     responses:
   *       '201':
   *         description: User created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: The unique identifier of the user.
   *                   example: 1
   *                 name:
   *                   type: string
   *                   description: The name of the user.
   *                   example: john
   *                 email:
   *                   type: string
   *                   description: The email address of the user.
   *                   example: john.doe@email.com
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the user was created.
   *                   example: 2023-10-08T14:06:36.000Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the user was last updated.
   *                   example: 2023-10-08T14:06:47.000Z
   *                 RoleId:
   *                   type: integer
   *                   description: The role identifier of the user.
   *                   example: 1
   *       '400':
   *         description: The request body contains invalid or missing data or the provided role_id may not exist.
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '500':
   *         description: Internal server error.
   */
  .post('/', createUser)

  /**
   * @openapi
   * /users/{user_id}:
   *   put:
   *     tags:
   *       - Users
   *     summary: Update user
   *     description: Update an existing user's information.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: user_id
   *         schema:
   *           type: integer
   *         description: The unique identifier of the user to update.
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The new name of the user (optional).
   *                 example: updated_user
   *               email:
   *                 type: string
   *                 description: The new email address of the user (optional).
   *                 example: updated.email@email.com
   *               password:
   *                 type: string
   *                 description: The new password for the user (optional).
   *                 example: Newsecurepassword99
   *               role_id:
   *                 type: integer
   *                 description: The new role identifier for the user (optional).
   *                 example: 2
   *     responses:
   *       '204':
   *         description: User updated successfully.
   *       '400':
   *         description: The request body contains invalid or missing data or the provided role_id may not exist.
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: User not found.
   *       '500':
   *         description: Internal server error.
   */
  .put('/:user_id', updateUser)

  /**
   * @openapi
   * /users/{user_id}:
   *   delete:
   *     tags:
   *       - Users
   *     summary: Delete user
   *     description: Delete an existing user.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: user_id
   *         schema:
   *           type: integer
   *         description: The unique identifier of the user to delete.
   *         required: true
   *     responses:
   *       '204':
   *         description: User deleted successfully.
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: User not found.
   *       '500':
   *         description: Internal server error.
   */
  .delete('/:user_id', deleteUser);

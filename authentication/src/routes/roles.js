import { Router } from 'express';
import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
} from '../controllers/roles';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Roles
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
   * /roles:
   *   get:
   *     tags:
   *       - Roles
   *     summary: Get roles
   *     description: Get a list of available roles.
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of available roles.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     description: An identifier for the role.
   *                     example: 1
   *                   name:
   *                     type: string
   *                     description: Role name.
   *                     example: administrator
   *                   createdAt:
   *                     type: string
   *                     description: The timestamp indicating when the role was created.
   *                     example: 2023-10-08T14:06:36.000Z
   *                   updatedAt:
   *                     type: string
   *                     description: The timestamp indicating when the role was last updated.
   *                     example: 2023-10-08T14:06:36.000Z
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: No roles found.
   *       '500':
   *         description: Internal server error.
   */
  .get('/', getRoles)

  /**
   * @openapi
   * /roles/{role_id}:
   *   get:
   *     tags:
   *       - Roles
   *     summary: Get role by id
   *     description: Get a role by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: role_id
   *         required: true
   *         description: The unique identifier of the role.
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: Role information retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: An identifier for the role.
   *                   example: 1
   *                 name:
   *                   type: string
   *                   description: Role name.
   *                   example: administrator
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp indicating when the role was created.
   *                   example: 2023-10-08T14:06:36.000Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp indicating when the role was last updated.
   *                   example: 2023-10-08T14:06:36.000Z
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: Role not found.
   *       '500':
   *         description: Internal server error.
   */
  .get('/:role_id', getRole)

  /**
   * @openapi
   * /roles:
   *   post:
   *     tags:
   *       - Roles
   *     summary: Create role
   *     description: Create a new role.
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
   *                 description: The name of the new role.
   *                 example: newRole
   *     responses:
   *       '201':
   *         description: Role created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: An identifier for the new role.
   *                   example: 1
   *                 name:
   *                   type: string
   *                   description: The name of the new role.
   *                   example: newRole
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp indicating when the role was created.
   *                   example: 2023-10-08T14:06:36.000Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp indicating when the role was last updated.
   *                   example: 2023-10-08T14:06:36.000Z
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '500':
   *         description: Internal server error.
   */
  .post('/', createRole)

  /**
   * @openapi
   * /roles/{role_id}:
   *   put:
   *     tags:
   *       - Roles
   *     summary: Update role
   *     description: Update a role by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: role_id
   *         required: true
   *         description: The identifier of the role to be updated.
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The new name for the role.
   *                 example: updatedRoleName
   *     responses:
   *       '204':
   *         description: Role updated successfully.
   *       '400':
   *         description: The request body contains invalid or missing data.
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: Role not found.
   *       '500':
   *         description: Internal server error.
   */
  .put('/:role_id', updateRole)

  /**
   * @openapi
   * /roles/{role_id}:
   *   delete:
   *     tags:
   *       - Roles
   *     summary: Delete role
   *     description: Delete a role by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: role_id
   *         required: true
   *         description: The identifier of the role to be deleted.
   *         schema:
   *           type: integer
   *     responses:
   *       '204':
   *         description: Role deleted successfully.
   *       '401':
   *         description: Access token needed or does not belong to a user.
   *       '403':
   *         description: Access denied due to role restrictions.
   *       '404':
   *         description: Role not found.
   *       '500':
   *         description: Internal server error.
   */
  .delete('/:role_id', deleteRole);

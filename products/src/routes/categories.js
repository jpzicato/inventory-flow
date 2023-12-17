import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
} from '../controllers/categories';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Categories
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
   * /categories:
   *   get:
   *     tags:
   *       - Categories
   *     summary: Get categories
   *     description: Get a list of categories.
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of categories.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: integer
   *                     description: The unique identifier of the category.
   *                     example: 00000003a52b023e9dacda67
   *                   name:
   *                     type: string
   *                     description: The name of the category.
   *                     example: Electronics
   *                   description:
   *                     type: string
   *                     description: The description of the category.
   *                     example: Electronic devices and accessories.
   *                   createdAt:
   *                     type: string
   *                     description: The timestamp when the category was created.
   *                     example: 2023-10-24T16:20:31.692Z
   *                   updatedAt:
   *                     type: string
   *                     description: The timestamp when the category was last updated.
   *                     example: 2023-10-24T16:20:31.692Z
   *       '404':
   *         description: No categories found.
   *       '500':
   *         description: Internal server error.
   */
  .get('/', getCategories)

  /**
   * @openapi
   * /categories/{category_id}:
   *   get:
   *     tags:
   *       - Categories
   *     summary: Get category by id
   *     description: Get a category by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique identifier of the category.
   *     responses:
   *       '200':
   *         description: A category object.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the category.
   *                   example: 00000003a52b023e9dacda67
   *                 name:
   *                   type: string
   *                   description: The name of the category.
   *                   example: Home
   *                 description:
   *                   type: string
   *                   description: A description of the category.
   *                   example: Home products, furniture, and decor.
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the category was created.
   *                   example: 2023-10-24T16:20:31.692Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the category was last updated.
   *                   example: 2023-10-24T16:20:31.692Z
   *       '400':
   *         description: The provided category_id is not valid.
   *       '404':
   *         description: Category not found.
   *       '500':
   *         description: Internal server error.
   */
  .get('/:category_id', getCategory)

  /**
   * @openapi
   * /categories:
   *   post:
   *     tags:
   *       - Categories
   *     summary: Create category
   *     description: Create a new category.
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
   *                 description: The name of the category.
   *                 example: newCategory
   *               description:
   *                 type: string
   *                 description: A description of the category.
   *                 example: Description of the new category
   *     responses:
   *       '201':
   *         description: Category created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the created category.
   *                   example: 00000003a52b023e9dacda67
   *                 name:
   *                   type: string
   *                   description: The name of the category.
   *                   example: New category
   *                 description:
   *                   type: string
   *                   description: A description of the category.
   *                   example: Description of the new category
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the category was created.
   *                   example: 2023-10-24T16:20:31.692Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the category was last updated.
   *                   example: 2023-10-24T16:20:31.692Z
   *       '500':
   *         description: Internal server error.
   */
  .post('/', createCategory)

  /**
   * @openapi
   * /categories/{category_id}:
   *   put:
   *     tags:
   *       - Categories
   *     summary: Update category
   *     description: Update an existing category by id.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category_id
   *         schema:
   *           type: string
   *         required: true
   *         description: The unique identifier of the category to update.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The updated name of the category (optional).
   *                 example: Updated category name
   *               description:
   *                 type: string
   *                 description: The updated description of the category (optional).
   *                 example: Updated description of the category
   *     responses:
   *       '200':
   *         description: Category updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the updated category.
   *                   example: 00000003a52b023e9dacda67
   *                 name:
   *                   type: string
   *                   description: The updated name of the category.
   *                   example: Updated category name
   *                 description:
   *                   type: string
   *                   description: The updated description of the category.
   *                   example: Updated description of the category
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the category was created.
   *                   example: 2023-10-24T16:20:31.692Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the category was last updated.
   *                   example: 2023-10-24T16:20:31.692Z
   *       '400':
   *         description: The provided category_id is not valid.
   *       '404':
   *         description: Category not found.
   *       '500':
   *         description: Internal server error.
   */
  .put('/:category_id', updateCategory)

  /**
   * @openapi
   * /categories/{category_id}:
   *   delete:
   *     tags:
   *       - Categories
   *     summary: Delete category
   *     description: Delete an existing category by id.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category_id
   *         schema:
   *           type: string
   *         required: true
   *         description: The unique identifier of the category to delete.
   *     responses:
   *       '200':
   *         description: Category deleted successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the deleted category.
   *                   example: 00000003a52b023e9dacda67
   *                 name:
   *                   type: string
   *                   description: The name of the deleted category.
   *                   example: Deleted category name
   *                 description:
   *                   type: string
   *                   description: The description of the deleted category.
   *                   example: Description of the deleted category
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the category was created.
   *                   example: 2023-10-24T16:20:31.692Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the category was last updated.
   *                   example: 2023-10-24T16:20:31.692Z
   *       '400':
   *         description: The provided category_id is not valid.
   *       '404':
   *         description: Category not found.
   *       '500':
   *         description: Internal server error.
   */
  .delete('/:category_id', deleteCategory);

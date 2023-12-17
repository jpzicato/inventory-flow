import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getCategoryProducts,
  updateProduct,
} from '../controllers/products';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Products
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
   * /products:
   *   get:
   *     tags:
   *       - Products
   *     summary: Get products
   *     description: Get a list of products.
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
   *         description: List of products.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 products:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The unique identifier of the product.
   *                         example: 00000003a52b023e9dacda67
   *                       name:
   *                         type: string
   *                         description: The name of the product.
   *                         example: Product name
   *                       description:
   *                         type: string
   *                         description: The description of the product.
   *                         example: Description of the product
   *                       price:
   *                         type: number
   *                         description: The price of the product.
   *                         example: 9.99
   *                       stock:
   *                         type: integer
   *                         description: The available stock of the product.
   *                         example: 35
   *                       category_id:
   *                         type: string
   *                         description: The category identifier of the product.
   *                         example: 00000001a52b023e9dacda65
   *                       createdAt:
   *                         type: string
   *                         description: The timestamp when the product was created.
   *                         example: 2023-10-24T16:20:31.744Z
   *                       updatedAt:
   *                         type: string
   *                         description: The timestamp when the product was last updated.
   *                         example: 2023-10-24T19:40:21.899Z
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
   *                   description: The total number of products.
   *                   example: 26
   *       '400':
   *         description: The page_number and page_size parameters cannot be used separately.
   *       '404':
   *         description: No products found or no more products available.
   *       '500':
   *         description: Internal server error.
   */
  .get('/', getProducts)

  /**
   * @openapi
   * /products/category/{category_id}:
   *   get:
   *     tags:
   *       - Products
   *     summary: Get products by category
   *     description: Get a list of products in a specific category.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category_id
   *         schema:
   *           type: string
   *         required: true
   *         description: The unique identifier of the category.
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
   *         description: List of products in the category.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 products:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The unique identifier of the product.
   *                         example: 6537eecff805fee345d1d1fd
   *                       name:
   *                         type: string
   *                         description: The name of the product.
   *                         example: Product name
   *                       description:
   *                         type: string
   *                         description: The description of the product.
   *                         example: Description of the product
   *                       price:
   *                         type: number
   *                         description: The price of the product.
   *                         example: 9.99
   *                       stock:
   *                         type: integer
   *                         description: The available stock of the product.
   *                         example: 35
   *                       category_id:
   *                         type: string
   *                         description: The category identifier of the product.
   *                         example: 00000001a52b023e9dacda65
   *                       createdAt:
   *                         type: string
   *                         description: The timestamp when the product was created.
   *                         example: 2023-10-24T16:20:31.744Z
   *                       updatedAt:
   *                         type: string
   *                         description: The timestamp when the product was last updated.
   *                         example: 2023-10-24T19:40:21.899Z
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
   *                   description: The total number of products in the category.
   *                   example: 26
   *       '400':
   *         description: The page_number and page_size parameters cannot be used separately or the provided category_id is not valid or does not belong to an existing category.
   *       '404':
   *         description: No products found or no more products available for the provided category_id.
   *       '500':
   *         description: Internal server error.
   */
  .get('/category/:category_id', getCategoryProducts)

  /**
   * @openapi
   * /products/{product_id}:
   *   get:
   *     tags:
   *       - Products
   *     summary: Get product by id
   *     description: Get product details by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: product_id
   *         schema:
   *           type: string
   *         required: true
   *         description: The unique identifier of the product.
   *     responses:
   *       '200':
   *         description: Product details.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the product.
   *                   example: 6537eecff805fee345d1d1fe
   *                 name:
   *                   type: string
   *                   description: The name of the product.
   *                   example: Product name
   *                 description:
   *                   type: string
   *                   description: The description of the product.
   *                   example: Description of the product
   *                 price:
   *                   type: number
   *                   description: The price of the product.
   *                   example: 9.99
   *                 stock:
   *                   type: integer
   *                   description: The available stock of the product.
   *                   example: 35
   *                 category_id:
   *                   type: string
   *                   description: The unique identifier of the product's category.
   *                   example: 00000003a52b023e9dacda67
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the product was created.
   *                   example: 2023-10-24T16:20:31.744Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the product was last updated.
   *                   example: 2023-10-24T19:40:21.899Z
   *       '400':
   *         description: The provided product_id is not valid.
   *       '404':
   *         description: Product not found.
   *       '500':
   *         description: Internal server error.
   */
  .get('/:product_id', getProduct)

  /**
   * @openapi
   * /products:
   *   post:
   *     tags:
   *       - Products
   *     summary: Create product
   *     description: Create a new product.
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
   *                 description: The name of the product.
   *                 example: Product name
   *               description:
   *                 type: string
   *                 description: The description of the product.
   *                 example: Description of the product
   *               price:
   *                 type: number
   *                 description: The price of the product.
   *                 example: 9.99
   *               stock:
   *                 type: integer
   *                 description: The available stock of the product (optional).
   *                 default: 0
   *                 example: 35
   *               category_id:
   *                 type: string
   *                 description: The unique identifier of the product's category.
   *                 example: 00000003a52b023e9dacda67
   *     responses:
   *       '201':
   *         description: Product created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the created product.
   *                   example: 6537eecff805fee345d1d1fe
   *                 name:
   *                   type: string
   *                   description: The name of the product.
   *                   example: Product name
   *                 description:
   *                   type: string
   *                   description: The description of the product.
   *                   example: Description of the product
   *                 price:
   *                   type: number
   *                   description: The price of the product.
   *                   example: 9.99
   *                 stock:
   *                   type: integer
   *                   description: The available stock of the product.
   *                   example: 35
   *                 category_id:
   *                   type: string
   *                   description: The unique identifier of the product's category.
   *                   example: 00000003a52b023e9dacda67
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the product was created.
   *                   example: 2023-10-24T16:20:31.744Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the product was last updated.
   *                   example: 2023-10-24T16:20:31.744Z
   *       '400':
   *         description: The request body contains invalid or missing data or the provided category_id is not valid or does not belong to an existing category.
   *       '500':
   *         description: Internal server error.
   */
  .post('/', createProduct)

  /**
   * @openapi
   * /products/{product_id}:
   *   put:
   *     tags:
   *       - Products
   *     summary: Update product
   *     description: Update an existing product by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique identifier of the product to update.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the product (optional).
   *                 example: Updated product name
   *               description:
   *                 type: string
   *                 description: The updated description of the product (optional).
   *                 example: Updated description of the product
   *               price:
   *                 type: number
   *                 description: The updated price of the product (optional).
   *                 example: 19.99
   *               stock:
   *                 type: integer
   *                 description: The updated stock of the product (optional).
   *                 example: 50
   *               category_id:
   *                 type: string
   *                 description: The updated category identifier of the product (optional).
   *                 example: 00000001a52b023e9dacda65
   *     responses:
   *       '200':
   *         description: Product updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the updated product.
   *                   example: 653a7634fb71e77054627a2e
   *                 name:
   *                   type: string
   *                   description: The updated name of the product.
   *                   example: Updated product Name
   *                 description:
   *                   type: string
   *                   description: The updated description of the product.
   *                   example: Updated description of the product
   *                 price:
   *                   type: number
   *                   description: The updated price of the product.
   *                   example: 19.99
   *                 stock:
   *                   type: integer
   *                   description: The updated stock of the product.
   *                   example: 50
   *                 category_id:
   *                   type: string
   *                   description: The updated category identifier of the product.
   *                   example: 00000001a52b023e9dacda65
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the product was created.
   *                   example: 2023-10-24T16:20:31.744Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the product was last updated.
   *                   example: 2023-10-24T19:40:21.899Z
   *       '400':
   *         description: The request body contains invalid or missing data, the provided product_id is not valid or the provided category_id is not valid or does not belong to an existing category.
   *       '404':
   *         description: Product not found.
   *       '500':
   *         description: Internal server error.
   */
  .put('/:product_id', updateProduct)

  /**
   * @openapi
   * /products/{product_id}:
   *   delete:
   *     tags:
   *       - Products
   *     summary: Delete product
   *     description: Delete an existing product by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique identifier of the product to delete.
   *     responses:
   *       '200':
   *         description: Product deleted successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the deleted product.
   *                   example: 653a7634fb71e77054627a2e
   *                 name:
   *                   type: string
   *                   description: The deleted name of the product.
   *                   example: Deleted product Name
   *                 description:
   *                   type: string
   *                   description: The deleted description of the product.
   *                   example: Deleted description of the product
   *                 price:
   *                   type: number
   *                   description: The deleted price of the product.
   *                   example: 19.99
   *                 stock:
   *                   type: integer
   *                   description: The deleted stock of the product.
   *                   example: 50
   *                 category_id:
   *                   type: string
   *                   description: The deleted category identifier of the product.
   *                   example: 00000001a52b023e9dacda65
   *                 createdAt:
   *                   type: string
   *                   description: The timestamp when the product was created.
   *                   example: 2023-10-24T16:20:31.744Z
   *                 updatedAt:
   *                   type: string
   *                   description: The timestamp when the product was last deleted.
   *                   example: 2023-10-24T19:40:21.899Z
   *       '400':
   *         description: The provided product_id is not valid.
   *       '404':
   *         description: Product not found.
   *       '500':
   *         description: Internal server error.
   */
  .delete('/:product_id', deleteProduct);

import { Router } from 'express';
import {
  getOrders,
  getUserOrders,
  getOrder,
  createOrder,
  updateOrder,
  cancelOrder,
  getOrderProducts,
} from '../controllers/orders';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Orders
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
   * /orders:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get orders
   *     description: Get a list of orders.
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
   *         description: List of orders.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 orders:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The unique identifier of the order.
   *                         example: 65381da579b746a8ad73d535
   *                       products:
   *                         type: array
   *                         description: The list of products in the order.
   *                         items:
   *                           type: object
   *                           properties:
   *                             _id:
   *                               type: string
   *                               description: The unique identifier of the product.
   *                               example: 6537eecff805fee345d1d1fe
   *                             quantity:
   *                               type: integer
   *                               description: The quantity of the product in the order.
   *                               example: 1
   *                       delivery_address:
   *                         type: string
   *                         description: The delivery address for the order.
   *                         example: 1234 Elm Street, Los Angeles, CA 90001
   *                       status:
   *                         type: string
   *                         description: The status of the order.
   *                         example: cancelled
   *                       user_id:
   *                         type: integer
   *                         description: The user identifier associated with the order.
   *                         example: 2
   *                       createdAt:
   *                         type: string
   *                         description: The date and time when the order was created.
   *                         example: 2023-10-24T19:40:21.918Z
   *                       updatedAt:
   *                         type: string
   *                         description: The date and time when the order was last updated.
   *                         example: 2023-10-24T19:40:21.918Z
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
   *                   description: The total number of orders.
   *                   example: 26
   *       '400':
   *         description: The page_number and page_size parameters cannot be used separately.
   *       '404':
   *         description: No orders found or no more orders available.
   *       '500':
   *         description: Internal server error.
   */
  .get('/', getOrders)

  /**
   * @openapi
   * /orders/user/{user_id}:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get orders from a user
   *     description: Get a list of orders associated with a specific user.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The unique identifier of the user whose orders are to be retrieved.
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
   *         description: List of user-specific orders.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 orders:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The unique identifier of the order.
   *                         example: 65381da579b746a8ad73d535
   *                       products:
   *                         type: array
   *                         description: The list of products in the order.
   *                         items:
   *                           type: object
   *                           properties:
   *                             _id:
   *                               type: string
   *                               description: The unique identifier of the product.
   *                               example: 6537eecff805fee345d1d1fe
   *                             quantity:
   *                               type: integer
   *                               description: The quantity of the product in the order.
   *                               example: 1
   *                       delivery_address:
   *                         type: string
   *                         description: The delivery address for the order.
   *                         example: 1234 Elm Street, Los Angeles, CA 90001
   *                       status:
   *                         type: string
   *                         description: The status of the order.
   *                         example: cancelled
   *                       user_id:
   *                         type: integer
   *                         description: The user identifier associated with the order.
   *                         example: 2
   *                       createdAt:
   *                         type: string
   *                         description: The date and time when the order was created.
   *                         example: 2023-10-24T19:40:21.918Z
   *                       updatedAt:
   *                         type: string
   *                         description: The date and time when the order was last updated.
   *                         example: 2023-10-24T19:40:21.918Z
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
   *                   description: The total number of user-specific orders.
   *                   example: 26
   *       '400':
   *         description: The page_number and page_size parameters cannot be used separately.
   *       '403':
   *         description: Non-admin or non-reader users are only allowed to see their own orders.
   *       '404':
   *         description: No orders found or no more orders available for the provided user_id.
   *       '500':
   *         description: Internal server error.
   */
  .get('/user/:user_id', getUserOrders)

  /**
   * @openapi
   * /orders/{order_id}:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get order by id
   *     description: Get a specific order by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: order_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique identifier of the order to be retrieved.
   *     responses:
   *       '200':
   *         description: The order details.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the order.
   *                   example: 65381da579b746a8ad73d535
   *                 products:
   *                   type: array
   *                   description: The list of products in the order.
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The unique identifier of the product.
   *                         example: 6537eecff805fee345d1d1fe
   *                       quantity:
   *                         type: integer
   *                         description: The quantity of the product in the order.
   *                         example: 1
   *                 delivery_address:
   *                   type: string
   *                   description: The delivery address for the order.
   *                   example: 1234 Elm Street, Los Angeles, CA 90001
   *                 status:
   *                   type: string
   *                   description: The status of the order.
   *                   example: cancelled
   *                 user_id:
   *                   type: integer
   *                   description: The user identifier associated with the order.
   *                   example: 2
   *                 createdAt:
   *                   type: string
   *                   description: The date and time when the order was created.
   *                   example: 2023-10-24T19:40:21.918Z
   *                 updatedAt:
   *                   type: string
   *                   description: The date and time when the order was last updated.
   *                   example: 2023-10-24T19:40:21.918Z
   *       '400':
   *         description: The provided order_id is not valid.
   *       '403':
   *         description: Non-admin or non-reader users are only allowed to access their own orders.
   *       '404':
   *         description: Order not found.
   *       '500':
   *         description: Internal server error.
   */
  .get('/:order_id', getOrder)

  /**
   * @openapi
   * /orders/{order_id}/products:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get products of an order
   *     description: Get the list of products in a specific order by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: order_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique identifier of the order to retrieve products from.
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
   *         description: List of products in the order.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 products:
   *                   type: array
   *                   description: The list of products in the order.
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The unique identifier of the product.
   *                         example: 6537eecff805fee345d1d1fe
   *                       quantity:
   *                         type: integer
   *                         description: The quantity of the product in the order.
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
   *                   description: The total number of products in the order.
   *                   example: 26
   *       '400':
   *         description: The page_number and page_size parameters cannot be used separately or the provided order_id is not valid.
   *       '403':
   *         description: Non-admin or non-reader users are only allowed to access products of their own orders or getting products from the provided order_id is not allowed as it is canceled.
   *       '404':
   *         description: Order not found or no more products available for the provided order_id.
   *       '500':
   *         description: Internal server error.
   */
  .get('/:order_id/products', getOrderProducts)

  /**
   * @openapi
   * /orders:
   *   post:
   *     tags:
   *       - Orders
   *     summary: Create a new order
   *     description: Create a new order with the provided products.
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               products:
   *                 type: array
   *                 description: An array of products to include in the order.
   *                 items:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       description: The unique identifier of the product.
   *                       example: 6537eecff805fee345d1d1fe
   *                     quantity:
   *                       type: integer
   *                       description: The quantity of the product to order.
   *                       example: 1
   *               delivery_address:
   *                 type: string
   *                 description: The delivery address for the order.
   *                 example: 1234 Elm Street, Los Angeles, CA 90001
   *               status:
   *                 type: string
   *                 description: The status of the order (optional).
   *                 default: pending
   *                 example: delivered
   *               user_id:
   *                 type: integer
   *                 description: The user identifier associated with the order. Only allowed for administrator users (optional).
   *                 default: id of the user making the query
   *                 example: 2
   *     responses:
   *       '201':
   *         description: The order was successfully created.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: The unique identifier of the created order.
   *                   example: 65399039f7881acef76f0765
   *                 products:
   *                   type: array
   *                   description: The list of products in the order.
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The unique identifier of the product.
   *                         example: 6537eecff805fee345d1d1fe
   *                       quantity:
   *                         type: integer
   *                         description: The quantity of the product in the order.
   *                         example: 1
   *                 delivery_address:
   *                   type: string
   *                   description: The delivery address for the order.
   *                   example: 1234 Elm Street, Los Angeles, CA 90001
   *                 status:
   *                   type: string
   *                   description: The status of the order.
   *                   example: delivered
   *                 user_id:
   *                   type: integer
   *                   description: The user identifier associated with the order.
   *                   example: 2
   *                 createdAt:
   *                   type: string
   *                   description: The date and time when the order was created.
   *                   example: 2023-10-25T22:01:29.408Z
   *                 updatedAt:
   *                   type: string
   *                   description: The date and time when the order was last updated.
   *                   example: 2023-10-25T22:01:29.408Z
   *       '400':
   *         description: The request body contains invalid or missing data or the requested quantity of one of the products is not in stock.
   *       '403':
   *         description: The "user_id" field in the request body is only allowed for administrator users.
   *       '500':
   *         description: Internal server error.
   */
  .post('/', createOrder)

  /**
   * @openapi
   * /orders/{order_id}/update:
   *   put:
   *     tags:
   *       - Orders
   *     summary: Update an order by id
   *     description: Update the details of a specific order by its unique identifier.
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: order_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique identifier of the order to be updated.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               delivery_address:
   *                 type: string
   *                 description: The delivery address for the order (optional).
   *                 example: 1234 Elm Street, Los Angeles, CA 90001
   *               status:
   *                 type: string
   *                 description: The status of the order (optional).
   *                 example: delivered
   *     responses:
   *       '204':
   *         description: The order was successfully updated.
   *       '400':
   *         description: The request body contains invalid or missing data, the provided order_id is not valid or the user making the query does not have permission to update order status as it is cancelled.
   *       '403':
   *         description: The user making the query does not have permission to update a non-own order.
   *       '404':
   *         description: Order not found.
   *       '500':
   *         description: Internal server error.
   */
  .put('/:order_id/update', updateOrder)

  /**
   * @openapi
   * /orders/{order_id}/cancel:
   *   put:
   *     tags:
   *       - Orders
   *     summary: Cancel an order by id
   *     description: Cancel a specific order by its unique identifier. This action updates the order status to 'cancelled.'
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: order_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique identifier of the order to be cancelled.
   *     responses:
   *       '204':
   *         description: The order was successfully cancelled.
   *       '400':
   *         description: The provided order_id is not valid or the order is already cancelled.
   *       '403':
   *         description: The user does not have permission to cancel a non-own order.
   *       '404':
   *         description: Order not found.
   *       '500':
   *         description: Internal server error.
   */
  .put('/:order_id/cancel', cancelOrder);

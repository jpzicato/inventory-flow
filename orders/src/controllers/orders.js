import axios from 'axios';
import Order from '../models/order';
import envVariables from '../config/envVariables';
import deleteRedisKeys from '../utils/deleteRedisKeys';
import { redisClient } from '../databases/redis';
import handleValidationError from '../utils/handleValidationError';
import {
  createOrderValidation,
  ordersPaginationValidation,
  updateOrderValidation,
} from '../validators/orders';
import verifyObjectIdValidation from '../utils/verifyObjectIdValidation';

const { REDIS_EXPIRATION } = envVariables;

const PRODUCTS_URL = `http://products:8080/api/products`;

export const getOrders = async (
  { userId, roleId, query: { page_number, page_size } },
  res,
  next
) => {
  try {
    if (page_number || page_size) {
      const errorMessage = handleValidationError(ordersPaginationValidation, {
        page_number,
        page_size,
      });

      if (errorMessage) return res.status(400).send(errorMessage);
    }

    const redisKey = `orders${
      roleId === 1 || roleId === 2 ? '' : `:user:${userId}`
    }:${
      page_number ? `page_number:${page_number}:page_size:${page_size}` : 'all'
    }`;

    const redisOrders = await redisClient.get(redisKey);

    if (redisOrders) return res.send(JSON.parse(redisOrders));

    const queryFilter =
      roleId === 1 || roleId === 2
        ? null
        : {
            user_id: userId,
          };

    const foundOrdersCount = await Order.countDocuments(queryFilter);

    if (!foundOrdersCount) return res.status(404).send('No orders found');

    const foundOrders = await Order.find(queryFilter)
      .skip(page_number && (page_number - 1) * page_size)
      .limit(page_size);

    if (!foundOrders.length)
      return res.status(404).send('No more orders available');

    const response = {
      orders: foundOrders,
      page_number: page_number ? parseInt(page_number) : 1,
      page_size: page_number ? parseInt(page_size) : foundOrdersCount,
      total_pages: page_number ? Math.ceil(foundOrdersCount / page_size) : 1,
      total_items: foundOrdersCount,
    };

    await redisClient.set(redisKey, JSON.stringify(response), {
      EX: REDIS_EXPIRATION,
    });

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (
  { userId, roleId, params: { user_id }, query: { page_number, page_size } },
  res,
  next
) => {
  try {
    if (roleId !== 1 && roleId !== 2 && userId != user_id)
      return res
        .status(403)
        .send(`User id ${userId} cannot see non-own orders`);

    if (page_number || page_size) {
      const errorMessage = handleValidationError(ordersPaginationValidation, {
        page_number,
        page_size,
      });

      if (errorMessage) return res.status(400).send(errorMessage);
    }

    const redisKey = `orders:user:${user_id}:${
      page_number ? `page_number:${page_number}:page_size:${page_size}` : 'all'
    }`;

    const redisOrders = await redisClient.get(redisKey);

    if (redisOrders) return res.send(JSON.parse(redisOrders));

    const foundOrdersCount = await Order.countDocuments({ user_id });

    if (!foundOrdersCount)
      return res.status(404).send(`No orders found for user id ${user_id}`);

    const foundOrders = await Order.find({
      user_id,
    })
      .skip(page_number && (page_number - 1) * page_size)
      .limit(page_size);

    if (!foundOrders.length)
      return res
        .status(404)
        .send(`No more orders available for user id ${user_id}`);

    const response = {
      orders: foundOrders,
      page_number: page_number ? parseInt(page_number) : 1,
      page_size: page_number ? parseInt(page_size) : foundOrdersCount,
      total_pages: page_number ? Math.ceil(foundOrdersCount / page_size) : 1,
      total_items: foundOrdersCount,
    };

    await redisClient.set(redisKey, JSON.stringify(response), {
      EX: REDIS_EXPIRATION,
    });

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  { userId, roleId, params: { order_id } },
  res,
  next
) => {
  try {
    const redisKey = `order:${order_id}${
      roleId === 1 || roleId === 2 ? '' : `:user:${userId}`
    }`;

    const redisOrder = await redisClient.get(redisKey);

    if (redisOrder) return res.send(JSON.parse(redisOrder));

    if (!verifyObjectIdValidation(order_id))
      return res.status(400).send(`Order id ${order_id} is not valid`);

    const foundOrder = await Order.findById(order_id);

    if (!foundOrder) return res.status(404).send('Order not found');

    if (roleId !== 1 && roleId !== 2 && foundOrder.user_id !== userId)
      return res
        .status(403)
        .send(`User id ${userId} cannot see non-own orders`);

    await redisClient.set(redisKey, JSON.stringify(foundOrder), {
      EX: REDIS_EXPIRATION,
    });

    res.send(foundOrder);
  } catch (error) {
    next(error);
  }
};

export const getOrderProducts = async (
  {
    userId,
    roleId,
    headers: { authorization },
    params: { order_id },
    query: { page_number, page_size },
  },
  res,
  next
) => {
  try {
    if (page_number || page_size) {
      const errorMessage = handleValidationError(ordersPaginationValidation, {
        page_number,
        page_size,
      });

      if (errorMessage) return res.status(400).send(errorMessage);
    }

    const redisKey = `order:${order_id}${
      roleId === 1 || roleId === 2 ? '' : `:user:${userId}`
    }:products:${
      page_number ? `page_number:${page_number}:page_size:${page_size}` : 'all'
    }`;

    const redisOrder = await redisClient.get(redisKey);

    if (redisOrder) return res.send(JSON.parse(redisOrder));

    if (!verifyObjectIdValidation(order_id))
      return res.status(400).send(`Order id ${order_id} is not valid`);

    const foundOrder = await Order.findById(order_id);

    if (!foundOrder) return res.status(404).send('Order not found');

    const { user_id, status, products } = foundOrder;

    if (roleId !== 1 && roleId !== 2 && user_id !== userId)
      return res
        .status(403)
        .send(`User id ${userId} cannot see non-own orders`);

    if (status === 'cancelled')
      return res
        .status(403)
        .send(
          `Getting products from order id ${order_id} is not allowed as it is canceled`
        );

    let foundProducts = await Order.getProducts(products, authorization);

    const { length: foundProductsCount } = foundProducts;

    if (page_number) {
      foundProducts = foundProducts.slice(
        (page_number - 1) * page_size,
        page_number * page_size
      );

      if (!foundProducts.length)
        return res
          .status(404)
          .send(`No more products available for order id ${order_id}`);
    }

    const response = {
      products: foundProducts,
      page_number: page_number ? parseInt(page_number) : 1,
      page_size: page_number ? parseInt(page_size) : foundProductsCount,
      total_pages: page_number ? Math.ceil(foundProductsCount / page_size) : 1,
      total_items: foundProductsCount,
    };

    await redisClient.set(redisKey, JSON.stringify(response), {
      EX: REDIS_EXPIRATION,
    });

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (
  { userId, roleId, headers: { authorization }, body },
  res,
  next
) => {
  try {
    const { products, user_id } = body;

    if (roleId !== 1 && user_id)
      return res
        .status(403)
        .send('"user_id" field only allowed for administrator users');

    const errorMessage = handleValidationError(createOrderValidation, {
      products,
      user_id,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    const response = await Order.getProducts(products, authorization, true);

    if (!Array.isArray(response)) return res.status(400).send(response);

    await Promise.all(
      products.map(async ({ _id, quantity }) => {
        await axios.put(
          `${PRODUCTS_URL}/${_id}?quantity=${quantity}`,
          {
            original_path: '/orders',
          },
          {
            headers: {
              authorization,
            },
          }
        );
      })
    );

    if (!user_id) body.user_id = userId;
    else await Order.getUser(user_id, authorization);

    const createdOrder = await new Order(body).save();

    await redisClient.set(
      `order:${createdOrder._id}${roleId === 1 ? '' : `:user:${userId}`}`,
      JSON.stringify(createdOrder),
      {
        EX: REDIS_EXPIRATION,
      }
    );

    await deleteRedisKeys('orders');

    res.status(201).send(createdOrder);
  } catch (error) {
    const { response } = error;

    next(response ? `${error}: ${response.data}` : error);
  }
};

export const updateOrder = async (
  { userId, roleId, params: { order_id }, body },
  res,
  next
) => {
  try {
    const errorMessage = handleValidationError(updateOrderValidation, body);

    if (errorMessage) return res.status(400).send(errorMessage);

    if (!verifyObjectIdValidation(order_id))
      return res.status(400).send(`Order id ${order_id} is not valid`);

    const foundOrder = await Order.findById(order_id);

    if (!foundOrder) return res.status(404).send('Order not found');

    const { user_id, status } = foundOrder;

    if (roleId !== 1 && user_id !== userId)
      return res
        .status(403)
        .send(`User id ${userId} not allowed to update a non-own order`);

    if (status === 'cancelled')
      return res
        .status(400)
        .send(`Not allowed to update order id ${order_id} as it is cancelled`);

    await Order.updateOne({ _id: order_id }, body);

    await deleteRedisKeys(`order:${order_id}`);
    await deleteRedisKeys('orders');

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  { roleId, userId, params: { order_id }, headers: { authorization } },
  res,
  next
) => {
  try {
    if (!verifyObjectIdValidation(order_id))
      return res.status(400).send(`Order id ${order_id} is not valid`);

    const foundOrder = await Order.findById(order_id);

    if (!foundOrder) return res.status(404).send('Order not found');

    const { products, user_id, status } = foundOrder;

    if (status === 'cancelled')
      return res.status(400).send(`Order id ${order_id} is already cancelled`);

    if (roleId !== 1 && user_id !== userId)
      return res
        .status(403)
        .send(`User id ${userId} not allowed to cancel a non-own order`);

    await Promise.all(
      products.map(async ({ _id, quantity }) => {
        await axios.put(
          `${PRODUCTS_URL}/${_id}?quantity=${quantity}`,
          {
            original_path: '/orders',
            previous_stock: true,
          },
          {
            headers: {
              authorization,
            },
          }
        );
      })
    );

    await Order.updateOne(
      {
        _id: order_id,
      },
      {
        status: 'cancelled',
      }
    );

    await deleteRedisKeys(`order:${order_id}`);
    await deleteRedisKeys('orders');

    res.sendStatus(204);
  } catch (error) {
    const { response } = error;

    next(response ? `${error}: ${response.data}` : error);
  }
};

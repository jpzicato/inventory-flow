import { redisClient } from '../config/databases/redis';
import { Role, Token, User } from '../models';
import { handleValidationError } from '../utils/errorHelpers';
import {
  roleIdValidation,
  updateUserValidation,
  usersPaginationValidation,
} from '../validators/users';
import deleteRedisKeys from '../utils/deleteRedisKeys';
import envVariables from '../config/envVariables';
import { connection } from 'mongoose';

const { REDIS_EXPIRATION } = envVariables;

export const getUsers = async (
  { query: { page_number, page_size } },
  res,
  next
) => {
  try {
    if (page_number || page_size) {
      const errorMessage = handleValidationError(usersPaginationValidation, {
        page_number,
        page_size,
      });

      if (errorMessage) return res.status(400).send(errorMessage);
    }

    const redisKey = `users:${
      page_number ? `page_number:${page_number}:page_size:${page_size}` : 'all'
    }`;

    const redisUsers = await redisClient.get(redisKey);

    if (redisUsers) return res.send(JSON.parse(redisUsers));

    const { count, rows } = await User.findAndCountAll(
      page_number
        ? {
            offset: (page_number - 1) * page_size,
            limit: parseInt(page_size),
          }
        : {}
    );

    if (!count) return res.status(404).send('No users found');

    if (!rows.length) return res.status(404).send('No more users available');

    rows.forEach(user => delete user.dataValues.password);

    const response = {
      users: rows,
      page_number: page_number ? parseInt(page_number) : 1,
      page_size: page_number ? parseInt(page_size) : count,
      total_pages: page_number ? Math.ceil(count / page_size) : 1,
      total_items: count,
    };

    await redisClient.set(redisKey, JSON.stringify(response), {
      EX: REDIS_EXPIRATION,
    });

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getRoleUsers = async (
  { params: { role_id }, query: { page_number, page_size } },
  res,
  next
) => {
  try {
    if (page_number || page_size) {
      const errorMessage = handleValidationError(usersPaginationValidation, {
        page_number,
        page_size,
      });

      if (errorMessage) return res.status(400).send(errorMessage);
    }

    const redisKey = `users:role:${role_id}:${
      page_number ? `page_number:${page_number}:page_size:${page_size}` : 'all'
    }`;

    const redisUsers = await redisClient.get(redisKey);

    if (redisUsers) return res.send(JSON.parse(redisUsers));

    const foundRole = await Role.findByPk(role_id);

    if (!foundRole)
      return res.status(400).send(`Role id ${role_id} does not exist`);

    const queryFilter = page_number
      ? {
          offset: (page_number - 1) * page_size,
          limit: parseInt(page_size),
        }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where: {
        role_id,
      },
      ...queryFilter,
    });

    if (!count)
      return res.status(404).send(`No users found for role id ${role_id}`);

    if (!rows.length)
      return res
        .status(404)
        .send(`No more users available for role id ${role_id}`);

    rows.forEach(user => delete user.dataValues.password);

    const response = {
      users: rows,
      page_number: page_number ? parseInt(page_number) : 1,
      page_size: page_number ? parseInt(page_size) : count,
      total_pages: page_number ? Math.ceil(count / page_size) : 1,
      total_items: count,
    };

    await redisClient.set(redisKey, JSON.stringify(response), {
      EX: REDIS_EXPIRATION,
    });

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getUser = async ({ params: { user_id } }, res, next) => {
  try {
    const redisKey = `user:${user_id}`;

    const redisUser = await redisClient.get(redisKey);

    if (redisUser) return res.send(JSON.parse(redisUser));

    const foundUser = await User.findByPk(user_id);

    if (!foundUser) return res.status(404).send(`User id ${user_id} not found`);

    delete foundUser.dataValues.password;

    await redisClient.set(redisKey, JSON.stringify(foundUser), {
      EX: REDIS_EXPIRATION,
    });

    res.send(foundUser);
  } catch (error) {
    next(error);
  }
};

export const createUser = async ({ body }, res, next) => {
  try {
    const { role_id } = body;

    const errorMessage = handleValidationError(roleIdValidation, {
      role_id,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    const createdUser = await User.create(body);

    if (role_id) {
      const foundRole = await Role.findByPk(role_id);

      if (!foundRole) {
        await User.destroy({
          where: {
            id: createdUser.id,
          },
        });

        return res.status(400).send(`Role id ${role_id} does not exist`);
      }

      createdUser.setRole(role_id);
    }

    delete createdUser.dataValues.password;

    await redisClient.set(
      `user:${createdUser.id}`,
      JSON.stringify(createdUser),
      {
        EX: REDIS_EXPIRATION,
      }
    );

    await deleteRedisKeys('users');

    res.status(201).send(createdUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async ({ body, params: { user_id } }, res, next) => {
  try {
    const { password, role_id } = body;

    const errorMessage = handleValidationError(updateUserValidation, {
      password,
      role_id,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    const foundUser = await User.findByPk(user_id);

    if (!foundUser) return res.status(404).send('User not found');

    if (role_id) {
      const foundRole = await Role.findByPk(role_id);

      if (!foundRole)
        return res.status(400).send(`Role id ${role_id} does not exist`);

      foundUser.setRole(role_id);
    }

    if (password) {
      body.password = await User.hashPassword(password);

      await Token.destroy({
        where: {
          user_id,
        },
      });
    }

    await User.update(body, {
      where: {
        id: user_id,
      },
      fields: ['name', 'email', 'password'],
    });

    await redisClient.del(`user:${user_id}`);

    await deleteRedisKeys('users');

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async ({ params: { user_id } }, res, next) => {
  try {
    await Token.destroy({
      where: {
        user_id,
      },
    });

    const deletedRows = await User.destroy({
      where: {
        id: user_id,
      },
    });

    if (!deletedRows) return res.status(404).send('User not found');

    const ordersCollection = connection.db.collection('orders');

    const foundOrders = await ordersCollection.find().toArray();

    await Promise.all(
      foundOrders.map(async ({ _id, user_id: userId }) => {
        let orderToCancel = false;

        if (userId == user_id) orderToCancel = true;

        if (orderToCancel) {
          await ordersCollection.updateOne(
            {
              _id,
            },
            {
              $set: {
                status: 'cancelled',
              },
            }
          );

          await deleteRedisKeys(`order:${_id}`);
          await deleteRedisKeys('orders');
        }
      })
    );

    await redisClient.del(`user:${user_id}`);

    await deleteRedisKeys('users');

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

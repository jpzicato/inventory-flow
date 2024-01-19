import { Role } from '../models';
import { redisClient } from '../config/databases/redis';
import deleteRedisKeys from '../utils/deleteRedisKeys';
import envVariables from '../config/envVariables';
import { updateRoleValidation } from '../validators/roles';
import { handleValidationError } from '../utils/errorHelpers';

const { REDIS_EXPIRATION } = envVariables;

export const getRoles = async (_req, res, next) => {
  try {
    const redisKey = 'roles';

    const redisRoles = await redisClient.get(redisKey);

    if (redisRoles) return res.send(JSON.parse(redisRoles));

    const foundRoles = await Role.findAll();

    if (!foundRoles.length) return res.status(404).send('No roles found');

    await redisClient.set(redisKey, JSON.stringify(foundRoles), {
      EX: REDIS_EXPIRATION,
    });

    res.send(foundRoles);
  } catch (error) {
    next(error);
  }
};

export const getRole = async ({ params: { role_id } }, res, next) => {
  try {
    const redisKey = `role:${role_id}`;

    const redisRole = await redisClient.get(redisKey);

    if (redisRole) return res.send(JSON.parse(redisRole));

    const foundRole = await Role.findByPk(role_id);

    if (!foundRole) return res.status(404).send('Role not found');

    await redisClient.set(redisKey, JSON.stringify(foundRole), {
      EX: REDIS_EXPIRATION,
    });

    res.send(foundRole);
  } catch (error) {
    next(error);
  }
};

export const createRole = async ({ body }, res, next) => {
  try {
    const createdRole = await Role.create(body);

    await redisClient.set(
      `role:${createdRole.id}`,
      JSON.stringify(createdRole),
      {
        EX: REDIS_EXPIRATION,
      }
    );

    await redisClient.del('roles');

    res.status(201).send(createdRole);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (
  { body, params: { role_id: id } },
  res,
  next
) => {
  try {
    const errorMessage = handleValidationError(updateRoleValidation, body);

    if (errorMessage) return res.status(400).send(errorMessage);

    const updatedRole = await Role.update(body, {
      where: {
        id,
      },
      fields: ['name'],
    });

    if (!updatedRole[0]) return res.status(404).send('Role not found');

    await redisClient.del(`role:${id}`);
    await redisClient.del('roles');

    await deleteRedisKeys(`users:role:${id}`);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async ({ params: { role_id: id } }, res, next) => {
  try {
    const deletedRows = await Role.destroy({
      where: {
        id,
      },
    });

    if (!deletedRows) return res.status(404).send('Role not found');

    await redisClient.del(`role:${id}`);
    await redisClient.del('roles');

    await deleteRedisKeys(`users:role:${id}`);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

import { User, Role } from '../models';
import users from './users';
import roles from './roles';
import { generateErrorMessage } from '../utils/errorHelpers';
import logger from '../logs/logger';

const createCollection = async ({ name, data }, model) => {
  try {
    const { length } = await model.findAll();

    if (length) return;

    await Promise.all(
      data.map(async element => {
        const elementCreated = await model.create(element);

        if (name === 'Users') await elementCreated.setRole(element.role_id);
      })
    );

    logger.info(`${name} collection created`);
  } catch (error) {
    const errorMessage = generateErrorMessage(
      `${name} collection seeding failed`,
      error
    );

    logger.error(errorMessage);

    throw new Error(errorMessage);
  }
};

export default async () => {
  try {
    await createCollection(roles, Role);
    await createCollection(users, User);
  } catch (error) {
    throw new Error(error);
  }
};

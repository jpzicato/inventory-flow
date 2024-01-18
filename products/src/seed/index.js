import { generateErrorMessage } from '../utils/errorHelpers';
import logger from '../logs/logger';
import Product from '../models/product';
import Category from '../models/category';
import products from './products';
import categories from './categories';

const createCollection = async ({ name, data }, model) => {
  try {
    const { length } = await model.find();

    if (length) return;

    await Promise.all(
      data.map(async element => await new model(element).save())
    );

    logger.info(`${name} collection created`);
  } catch (error) {
    const errorMessage = generateErrorMessage(
      `${name} collection seeding failed`,
      error
    );

    logger.error(errorMessage);

    throw errorMessage;
  }
};

export default async () => {
  await createCollection(categories, Category);
  await createCollection(products, Product);
};

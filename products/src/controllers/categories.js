import { redisClient } from '../databases/redis';
import envVariables from '../config/envVariables';
import Category from '../models/category';
import Product from '../models/product';
import deleteRedisKeys from '../utils/deleteRedisKeys';
import verifyObjectIdValidation from '../utils/verifyObjectIdValidation';
import { Types } from 'mongoose';

const { REDIS_EXPIRATION } = envVariables;

export const getCategories = async (_req, res, next) => {
  try {
    const redisKey = 'categories';

    const redisCategories = await redisClient.get(redisKey);

    if (redisCategories) return res.send(JSON.parse(redisCategories));

    const foundCategories = await Category.find();

    if (!foundCategories.length)
      return res.status(404).send('No categories found');

    await redisClient.set(redisKey, JSON.stringify(foundCategories), {
      EX: REDIS_EXPIRATION,
    });

    res.send(foundCategories);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async ({ params: { category_id } }, res, next) => {
  try {
    const redisKey = `category:${category_id}`;

    const redisCategory = await redisClient.get(redisKey);

    if (redisCategory) return res.send(JSON.parse(redisCategory));

    if (!verifyObjectIdValidation(category_id))
      return res.status(400).send(`Category id ${category_id} is not valid`);

    const foundCategory = await Category.findById(category_id);

    if (!foundCategory) return res.status(404).send('Category not found');

    await redisClient.set(redisKey, JSON.stringify(foundCategory), {
      EX: REDIS_EXPIRATION,
    });

    res.send(foundCategory);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async ({ body }, res, next) => {
  try {
    const foundCategoriesCount = await Category.countDocuments();

    const createdCategory = await new Category({
      _id: new Types.ObjectId(foundCategoriesCount + 1),
      ...body,
    }).save();

    await redisClient.set(
      `category:${createdCategory._id}`,
      JSON.stringify(createdCategory),
      {
        EX: REDIS_EXPIRATION,
      }
    );

    await redisClient.del('categories');

    res.status(201).send(createdCategory);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  { params: { category_id }, body },
  res,
  next
) => {
  try {
    if (!verifyObjectIdValidation(category_id))
      return res.status(400).send(`Category id ${category_id} is not valid`);

    const updatedCategory = await Category.findByIdAndUpdate(
      category_id,
      body,
      {
        returnDocument: 'after',
      }
    );

    if (!updatedCategory) return res.status(404).send('Category not found');

    await redisClient.del(`category:${category_id}`);
    await redisClient.del('categories');

    res.send(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  { params: { category_id } },
  res,
  next
) => {
  try {
    if (!verifyObjectIdValidation(category_id))
      return res.status(400).send(`Category id ${category_id} is not valid`);

    const deletedCategory = await Category.findByIdAndDelete(category_id);

    if (!deletedCategory) return res.status(404).send('Category not found');

    await Product.updateMany(
      { category_id: deletedCategory._id },
      { category_id: null }
    );

    await redisClient.del(`category:${category_id}`);
    await redisClient.del('categories');

    await deleteRedisKeys(`products:category:${category_id}`);

    res.send(deletedCategory);
  } catch (error) {
    next(error);
  }
};

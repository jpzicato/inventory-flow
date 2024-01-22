import { client as redisClient } from '../databases/redis';
import Product from '../models/product';
import Category from '../models/category';
import handleValidationError from '../utils/handleValidationError';
import {
  categoryIdValidation,
  updateProductValidation,
  productsPaginationValidation,
  updateProductStockValidation,
} from '../validators/products';
import { deleteRedisKeys, redisSetCommandOptions } from '../utils/redisHelpers';
import { connection } from 'mongoose';
import verifyObjectIdValidation from '../utils/verifyObjectIdValidation';

export const getProducts = async (
  { query: { page_number, page_size } },
  res,
  next
) => {
  try {
    if (page_number || page_size) {
      const errorMessage = handleValidationError(productsPaginationValidation, {
        page_number,
        page_size,
      });

      if (errorMessage) return res.status(400).send(errorMessage);
    }

    const redisKey = `products:${
      page_number ? `page_number:${page_number}:page_size:${page_size}` : 'all'
    }`;

    const redisProducts = await redisClient.get(redisKey);

    if (redisProducts) return res.send(JSON.parse(redisProducts));

    const foundProductsCount = await Product.countDocuments();

    if (!foundProductsCount) return res.status(404).send('No products found');

    const foundProducts = await Product.find()
      .skip(page_number && (page_number - 1) * page_size)
      .limit(page_size);

    if (!foundProducts.length)
      return res.status(404).send('No more products available');

    const response = {
      products: foundProducts,
      page_number: page_number ? parseInt(page_number) : 1,
      page_size: page_number ? parseInt(page_size) : foundProductsCount,
      total_pages: page_number ? Math.ceil(foundProductsCount / page_size) : 1,
      total_items: foundProductsCount,
    };

    await redisClient.set(
      redisKey,
      JSON.stringify(response),
      redisSetCommandOptions
    );

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getCategoryProducts = async (
  { params: { category_id }, query: { page_number, page_size } },
  res,
  next
) => {
  try {
    if (page_number || page_size) {
      const errorMessage = handleValidationError(productsPaginationValidation, {
        page_number,
        page_size,
      });

      if (errorMessage) return res.status(400).send(errorMessage);
    }

    const redisKey = `products:category:${category_id}:${
      page_number ? `page_number:${page_number}:page_size:${page_size}` : 'all'
    }`;

    const redisProducts = await redisClient.get(redisKey);

    if (redisProducts) return res.send(JSON.parse(redisProducts));

    if (!verifyObjectIdValidation(category_id))
      return res.status(400).send(`Category id ${category_id} is not valid`);

    const foundCategory = await Category.findById(category_id);

    if (!foundCategory)
      return res.status(400).send(`Category id ${category_id} does not exist`);

    const foundProductsCount = await Product.countDocuments({
      category_id,
    });

    if (!foundProductsCount)
      return res
        .status(404)
        .send(`No products found for category id ${category_id}`);

    const foundProducts = await Product.find({
      category_id,
    })
      .skip(page_number && (page_number - 1) * page_size)
      .limit(page_size);

    if (!foundProducts.length)
      return res
        .status(404)
        .send(`No more products available for category id ${category_id}`);

    const response = {
      products: foundProducts,
      page_number: page_number ? parseInt(page_number) : 1,
      page_size: page_number ? parseInt(page_size) : foundProductsCount,
      total_pages: page_number ? Math.ceil(foundProductsCount / page_size) : 1,
      total_items: foundProductsCount,
    };

    await redisClient.set(
      redisKey,
      JSON.stringify(response),
      redisSetCommandOptions
    );

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async ({ params: { product_id } }, res, next) => {
  try {
    const redisKey = `product:${product_id}`;

    const redisProduct = await redisClient.get(redisKey);

    if (redisProduct) return res.send(JSON.parse(redisProduct));

    if (!verifyObjectIdValidation(product_id))
      return res.status(400).send(`Product id ${product_id} is not valid`);

    const foundProduct = await Product.findById(product_id);

    if (!foundProduct)
      return res.status(404).send(`Product id ${product_id} not found`);

    await redisClient.set(
      redisKey,
      JSON.stringify(foundProduct),
      redisSetCommandOptions
    );

    res.send(foundProduct);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async ({ body }, res, next) => {
  try {
    const { category_id } = body;

    const errorMessage = handleValidationError(categoryIdValidation, {
      category_id,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    if (!verifyObjectIdValidation(category_id))
      return res.status(400).send(`Category id ${category_id} is not valid`);

    const foundCategory = await Category.findById(category_id);

    if (!foundCategory)
      return res.status(400).send(`Category id ${category_id} does not exist`);

    const createdProduct = await new Product(body).save();

    await redisClient.set(
      `product:${createdProduct._id}`,
      JSON.stringify(createdProduct),
      redisSetCommandOptions
    );

    await deleteRedisKeys('products');

    res.status(201).send(createdProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  { previousStock, params: { product_id }, body, query: { quantity } },
  res,
  next
) => {
  try {
    if (!verifyObjectIdValidation(product_id))
      return res.status(400).send(`Product id ${product_id} is not valid`);

    const { price, stock, category_id } = body;

    const errorMessage = handleValidationError(updateProductValidation, {
      price,
      stock,
      category_id,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    if (category_id) {
      if (!verifyObjectIdValidation(category_id))
        return res.status(400).send(`Category id ${category_id} is not valid`);

      const foundCategory = await Category.findById(category_id);

      if (!foundCategory)
        return res
          .status(400)
          .send(`Category id ${category_id} does not exist`);
    }

    let updatedProduct;

    if (quantity) {
      const errorMessage = handleValidationError(updateProductStockValidation, {
        quantity,
      });

      if (errorMessage) return res.status(400).send(errorMessage);

      updatedProduct = await Product.updateStock(
        product_id,
        parseInt(quantity),
        previousStock
      );
    } else {
      updatedProduct = await Product.findByIdAndUpdate(product_id, body, {
        returnDocument: 'after',
      });
    }

    if (!updatedProduct) return res.status(404).send('Product not found');

    await redisClient.del(`product:${product_id}`);

    await deleteRedisKeys('products');

    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async ({ params: { product_id } }, res, next) => {
  try {
    if (!verifyObjectIdValidation(product_id))
      return res.status(400).send(`Product id ${product_id} is not valid`);

    const foundProduct = await Product.findById(product_id);

    if (!foundProduct) return res.status(404).send('Product not found');

    const ordersCollection = connection.db.collection('orders');

    const foundOrders = await ordersCollection.find().toArray();

    for (const { _id, products } of foundOrders) {
      let orderToCancel = false;

      for (const product of products) {
        if (product._id.toString() === product_id) {
          orderToCancel = true;
          break;
        }
      }

      if (orderToCancel) {
        await Promise.all(
          products.map(
            async ({ _id, quantity }) =>
              await Product.updateStock(_id, quantity, true)
          )
        );

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
    }

    await Product.deleteOne({
      _id: product_id,
    });

    await redisClient.del(`product:${product_id}`);

    await deleteRedisKeys('products');

    res.send(foundProduct);
  } catch (error) {
    next(error);
  }
};

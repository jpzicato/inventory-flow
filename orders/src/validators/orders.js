import Joi from 'joi';

const stringFieldValidation = Joi.string();
const numberFieldValidation = Joi.number().min(1);

const orderStatusFieldValidation = stringFieldValidation.valid(
  'pending',
  'processing',
  'shipped',
  'delivered'
);

const uniqueProductIdArray = (products, { error }) => {
  const productIdSet = new Set();

  for (const { _id } of products) {
    if (productIdSet.has(_id))
      return error('products.duplicateProductId', { v: _id });

    productIdSet.add(_id);
  }

  return products;
};

export const createOrderValidation = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        _id: stringFieldValidation.required(),
        quantity: numberFieldValidation.required(),
      }).required()
    )
    .custom(uniqueProductIdArray, 'Unique product ids')
    .required()
    .messages({
      'products.duplicateProductId':
        'product _id field "{{#v}}" cannot be repeated',
    }),
  user_id: numberFieldValidation,
});

export const updateOrderValidation = Joi.object({
  delivery_address: stringFieldValidation,
  status: orderStatusFieldValidation,
});

export const ordersPaginationValidation = Joi.object({
  page_number: numberFieldValidation.required(),
  page_size: numberFieldValidation.required(),
});

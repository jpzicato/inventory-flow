import Joi from 'joi';

const stringFieldValidation = Joi.string();

const numberFieldValidation = (number = 0) => Joi.number().min(number);

export const categoryIdValidation = Joi.object({
  category_id: stringFieldValidation.required(),
});

export const updateProductValidation = Joi.object({
  price: numberFieldValidation(),
  stock: numberFieldValidation(),
  category_id: stringFieldValidation,
});

export const productsPaginationValidation = Joi.object({
  page_number: numberFieldValidation(1).required(),
  page_size: numberFieldValidation(1).required(),
});

export const updateProductStockValidation = Joi.object({
  quantity: numberFieldValidation(1).required(),
});

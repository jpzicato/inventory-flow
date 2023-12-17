import Joi from 'joi';

const stringFieldValidation = Joi.string();
const numberFieldValidation = Joi.number().min(1);

export const roleIdValidation = Joi.object({
  role_id: numberFieldValidation,
});

export const updateUserValidation = Joi.object({
  password: stringFieldValidation
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)
    .messages({
      'string.pattern.base':
        'The password must contain at least 8 characters including at least 1 uppercase, 1 lowercase, and one number.',
    }),
  role_id: numberFieldValidation,
});

export const usersPaginationValidation = Joi.object({
  page_number: numberFieldValidation.required(),
  page_size: numberFieldValidation.required(),
});

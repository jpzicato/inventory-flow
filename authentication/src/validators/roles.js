import Joi from 'joi';

const stringFieldValidationRequired = Joi.string().required();

export const updateRoleValidation = Joi.object({
  name: stringFieldValidationRequired,
});

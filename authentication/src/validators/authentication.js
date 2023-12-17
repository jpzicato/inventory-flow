import Joi from 'joi';

const stringFieldValidationRequired = Joi.string().required();

export const passwordMatchValidation = Joi.object({
  password: stringFieldValidationRequired,
  repeat_password: stringFieldValidationRequired
    .valid(Joi.ref('password'))
    .messages({ 'any.only': 'Passwords must match' }),
});

export const logInValidation = Joi.object({
  email: stringFieldValidationRequired.email(),
  password: stringFieldValidationRequired,
});

export const refreshTokenValidation = Joi.object({
  refresh_token: stringFieldValidationRequired,
});

export const generateErrorMessage = (description, error) =>
  `${description}: ${error}`;

export const handleValidatorError = (validatorSchema, data) => {
  const { error } = validatorSchema.validate(data);

  if (error) return generateErrorMessage('Validator failed', error);
};

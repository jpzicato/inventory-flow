export const generateErrorMessage = (description, error) => {
  const { name, errors } = error;

  if (name && errors)
    return `${description}: (${name}: ${errors
      .map(err => err.message)
      .join(', ')})`;

  return `${description}: ${error}`;
};

export const handleValidationError = (validatorSchema, data) => {
  const { error } = validatorSchema.validate(data);

  if (error) return error.toString();
};

export const handleValidatorError = (validatorSchema, data) => {
  const { error } = validatorSchema.validate(data);

  if (error) return `Validator failed: ${error}`;
};

export default (validatorSchema, data) => {
  const { error } = validatorSchema.validate(data);

  if (error) return error.toString();
};

export const getApiErrorMessage = (error) => {
  const responseMessage = error?.response?.data?.message;
  const validationErrors = error?.response?.data?.errors;

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors[0].message;
  }

  if (responseMessage) {
    return responseMessage;
  }

  return "Something went wrong. Please try again.";
};

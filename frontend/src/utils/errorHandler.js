export const errorHandler = (err) => {
  return err?.response?.data?.message || "uknown error occured";
};

const HttpError = require("../models/http-error");

exports.unkownError = (err) => {
  const error = new HttpError("Unkown error occured " + err, 500);
  console.log(err);
  return error;
};

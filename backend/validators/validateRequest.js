const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const validateRequest = async (req, res, next) => {
  const errors = validationResult(req);

  const badBodyError = new HttpError("Bad Body Error", 400);
  badBodyError.errors = errors.array();

  if (!errors.isEmpty()) return next(badBodyError);

  next();
};

module.exports = { validateRequest };

const { check, validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const validationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid Inputs Passed, Please check your data", 422);
    return error
  }
};

const signupValidator = (req) => {
  return [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ];
};

const loginValidator = (req) => {
  return [check("email").normalizeEmail().isEmail()];
};

module.exports = { validationErrors, signupValidator, loginValidator };

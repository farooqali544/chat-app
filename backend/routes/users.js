const express = require("express");
const { check, param } = require("express-validator");
const usersController = require("../controllers/users-controllers");
const checkAuth = require("../middlewares/check-auth");
const { validateRequest } = require("../validators/validateRequest");
const router = express.Router();
const { isValidUserId } = require("../validators/validators");

router.route("/getUser").get(checkAuth, usersController.getUser);

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  validateRequest,
  usersController.signup
);

router.post("/login", check("email").normalizeEmail().isEmail(), usersController.login);

router
  .route("/searchUsersByNameOrEmail/:searchValue")
  .get(
    checkAuth,
    [check("searchValue").notEmpty().withMessage("searchValue is required")],
    usersController.searchUsersByNameOrEmail,
    validateRequest
  );

//update name and/or image
router.patch("/updateUser", checkAuth, usersController.updateUser);

router.patch(
  "/addContact/:contactId",
  checkAuth,
  check("contactId").custom(isValidUserId),
  validateRequest,
  usersController.addContact
);

router.patch(
  "/removeContact/:contactId",
  checkAuth,
  check("contactId").custom(isValidUserId),
  validateRequest,
  usersController.removeContact
);

router.get("/getContacts", checkAuth, usersController.getContacts);

module.exports = router;

const express = require("express");
const usersController = require("../controllers/users-controllers");
const checkAuth = require("../middlewares/check-auth");
const router = express.Router();
const { signupValidator, loginValidator } = require("../validators/users-validators");

router.get("/", usersController.getAllUsers);

router.get("/getUser", checkAuth, usersController.getUser);

router.get("/email/:email", usersController.getUserByEmail);

router.patch('/:uid', usersController.updateUser);


router.post("/signup", signupValidator(), usersController.signup);

router.patch("/updateProfilePic/:uid", usersController.updateProfilePic);

router.post("/login", loginValidator(), usersController.login);

router.patch('/addContact',usersController.addContact );

router.get("/checkAuth", checkAuth, (req, res, next) => {
  res.json("Authenticated");
});

module.exports = router;

const express = require("express");
const { check } = require("express-validator");
const { createConversation, getConversations } = require("../controllers/conversations-controller");
const checkAuth = require("../middlewares/check-auth");
const { validateRequest } = require("../validators/validateRequest");
const { isUniqueArray, validateCreateConversation } = require("../validators/validators");
const router = express.Router();

router.route("/createConversation").post(
  checkAuth,
  check("memberIds")
    .isArray()
    .withMessage("memberIds must be an array")
    .custom(isUniqueArray)
    .custom((members, { req }) => {
      return !members.includes(req.authUser._id);
    })
    .withMessage("user cannot add itself as member for creating conversation"),
  validateCreateConversation,
  validateRequest,
  createConversation
);

router.route("/private").get(checkAuth, getConversations);

router.route("/group").get(checkAuth, getConversations);



// router
//   .route("/updateConversation/addMembers/:cid")
//   .delete(
//     checkAuth,
//     check("cid").isMongoId(),
//     check("memberIds").isArray({ min: 1 }).withMessage("atleast one member is required to be added").updateConversation
//   );

module.exports = router;

const express = require("express");
const { check } = require("express-validator");
const chatController = require("../controllers/chat-controller");
const { createConversation, getConversations } = require("../controllers/conversations-controller");
const checkAuth = require("../middlewares/check-auth");
const { validateRequest } = require("../validators/validateRequest");
const { isUniqueArray, validateCreateConversation } = require("../validators/validators");
const router = express.Router();

//For searching conversations, chats and contacts
router
  .route("/search")
  .get(
    checkAuth,
    check("q").notEmpty().withMessage("query cannot be empty"),
    validateRequest,
    chatController.searchChat
  );

  module.exports = router;

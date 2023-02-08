const express = require("express");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { unkownError } = require("../util/unkown-error");
const checkAuth = require("../middlewares/check-auth");
const { sendMessage, getMessages, readMessages } = require("../controllers/messages-controller");
const { check, param } = require("express-validator");
const { validateRequest } = require("../validators/validateRequest");
const { isValidConversationId } = require("../validators/validators");
const router = express.Router();

//post message

router
  .route("/sendMessage")
  .post(
    checkAuth,
    [
      check("conversationId").custom(isValidConversationId),
      check("text", "atleast one character should be sent as a text").notEmpty(),
    ],
    validateRequest,
    sendMessage
  );

// get messaages

router
  .route("/:conversationId")
  .get(
    checkAuth,
    [
      check("firstMessageTime").optional().isISO8601().withMessage("invalid lastmessage time"),
      param("conversationId").custom(isValidConversationId),
    ],
    validateRequest,
    getMessages
  );

router
  .route("/readMessages/:conversationId")
  .patch(
    checkAuth,
    param("conversationId").custom(isValidConversationId),
    validateRequest,
    readMessages
  );

router.get("/unread/:uid", async (req, res, next) => {
  const { uid } = req.params;

  const conversations = await Conversation.find({ members: { $in: [uid] } }, "_id");
  const conversationIds = conversations.map((item) => item._id);

  const total = await Promise.all(
    conversationIds.map(async (conversationId) => {
      const lastMessage = await Message.findOne({ conversationId: conversationId }).sort([
        ["createdAt", -1],
      ]);
      const unreadMessages = await Message.count({
        conversationId: conversationId,
        sender: { $ne: uid },
        read: null,
      });

      return { conversationId, unreadMessages, lastMessage };
    })
  );

  res.json(total);
});

//update unread messages

router.patch("/unread/:conversationId", async (req, res, next) => {
  const { conversationId } = req.params;

  let response;
  try {
    response = await Message.updateMany(
      { conversationId: conversationId, read: null },
      { read: new Date() }
    );
  } catch (err) {
    return next(unkownError(err));
  }
  res.json(response);
});

module.exports = router;

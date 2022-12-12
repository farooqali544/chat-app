const express = require("express");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { unkownError } = require("../util/unkown-error");
const router = express.Router();

//post message

router.post("/", async (req, res, next) => {
  const newMessage = new Message(req.body);

  try {
    const currentDateTime = new Date();
    await Conversation.findByIdAndUpdate(req.body.conversationId, { updatedAt: currentDateTime });
  } catch (err) {
    return unkownError(next, err);
  }

  try {
    const savedMessage = await newMessage.save();
    return res.status(201).json(savedMessage);
  } catch (err) {
    unkownError(next, err);
  }
});

// get messaages

router.get("/:conversationId", async (req, res, next) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({
      conversationId: conversationId,
    });
    return res.json(messages);
  } catch (err) {
    unkownError(next, err);
  }
});

router.get("/unread/:uid", async (req, res, next) => {
  const { uid } = req.params;

  const conversations = await Conversation.find({ members: { $in: [uid] } }, "_id");
  const conversationIds = conversations.map((item) => item._id);

  const total = await Promise.all(
    conversationIds.map(async (conversationId) => {
      const lastMessage = await Message.findOne({ conversationId: conversationId }).sort([["createdAt", -1]]);
      const unreadMessages = await Message.count({ conversationId: conversationId, sender: { $ne: uid }, read: null });

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
    response = await Message.updateMany({ conversationId: conversationId, read: null }, { read: new Date() });
  } catch (err) {
    return unkownError(next, err);
  }
  res.json(response);
});

module.exports = router;

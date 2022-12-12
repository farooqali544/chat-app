const express = require("express");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/user");
const { unkownError } = require("../util/unkown-error");
const router = express.Router();

//post Conversation

router.post("/", async (req, res, next) => {
  const { senderId, receiverId } = req.body;

  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    return res.status(201).json(savedConversation);
  } catch (err) {
    unkownError(next, err);
  }
});

//Get all conversations along with conversing user
router.get("/:uid", async (req, res, next) => {
  const { uid } = req.params;
  try {
    //get all those users where conversation
    const conversations = await Conversation.find({
      members: { $in: [uid] },
    })
      .populate({ path: "members", select: "-password -contacts -__v" })
      .sort({ updatedAt: -1 });

    // conversations ---> [{conversationId, conversationUser} ]
    const conversationsIdAndUser = conversations.map((convo) => {
      let conversationUser = convo.members.find((user) => !user._id.equals(uid));
      return { conversationId: convo._id, updatedAt: convo.updatedAt, createdAt: convo.createdAt, conversationUser: conversationUser };
    });

    // const conversations = await Conversation.find({ members: { $in: [uid] } }, "_id");
    // const conversationIds = conversations.map((item) => item._id);

    const total = await Promise.all(
      conversationsIdAndUser.map(async (conversation) => {
        const { conversationId } = conversation;
        const lastMessage = await Message.findOne({ conversationId: conversationId }).sort([["createdAt", -1]]);
        const unreadMessages = await Message.count({ conversationId: conversationId, sender: { $ne: uid }, read: null });

        return { ...conversation,  unreadMessages, lastMessage };
      })
    );

    return res.json(total);
  } catch (err) {
    return unkownError(next, err);
  }
});

router.get("/:uid1/:uid2", async (req, res, next) => {
  const { uid1, uid2 } = req.params;

  try {
    const conversation = await Conversation.findOne({
      members: { $all: [uid1, uid2] },
    });
    return res.json(conversation);
  } catch (err) {
    unkownError(next, err);
  }
});

module.exports = router;

const Conversation = require("../models/Conversation");
const HttpError = require("../models/http-error");
const Message = require("../models/Message");
const { unkownError } = require("../util/unkown-error");

const sendMessage = async (req, res, next) => {
  const authUser = req.authUser;
  const { conversationId, text } = req.body;

  let newMessage;

  try {
    newMessage = new Message({
      conversationId,
      text,
      sender: authUser._id,
    });
    await newMessage.save();

    // update lastMessage of conversation
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: newMessage._id });
  } catch (err) {
    return next(unkownError(err));
  }
  res.json(newMessage);
};

const getMessages = async (req, res, next) => {
  const authUser = req.authUser;
  const { conversationId } = req.params;
  const { firstMessageTime } = req.query;

  let messages;
  let allMessagesFetched = false;

  try {
    //check if user is a member of conversation
    const conversation = await Conversation.findById(conversationId);

    const isUserInConversation = conversation.members.includes(authUser._id);

    if (!isUserInConversation) {
      const error = new HttpError("You are not a member of this conversation", 400);
      return next(error);
    }

    const lastMessageQuery = firstMessageTime
      ? { createdAt: { $lt: new Date(firstMessageTime) } }
      : {};

    let messagesCount = await Message.countDocuments({ conversationId, ...lastMessageQuery });

    if (messagesCount < 12) messagesCount = 12;

    messages = await Message.find({
      conversationId: conversationId,
      ...lastMessageQuery,
    }).skip(messagesCount - 12);

    if (messages.length < 12) allMessagesFetched = true;
  } catch (err) {
    return next(unkownError(err));
  }

  res.json({ conversationId, messages, allMessagesFetched });
};

const readMessages = async (req, res, next) => {
  const authUser = req.authUser;
  const { conversationId } = req.params;

  try {
    await Message.updateMany(
      { conversationId: conversationId, read: null },
      { $set: { read: new Date() } },
      { multi: true }
    ).exec();
  } catch (err) {
    return next(unkownError(err));
  }
  res.json("success");
};

module.exports = { sendMessage, getMessages, readMessages };

const { isValidObjectId } = require("mongoose");
const Conversation = require("../models/Conversation");
const HttpError = require("../models/http-error");
const Message = require("../models/Message");
const { unkownError } = require("../util/unkown-error");

const createConversation = async (req, res, next) => {
  const authUser = req.authUser;
  const { memberIds, group } = req.body;

  let newConversation;

  try {
    if (!group) {
      //check for duplicate individual conversation
      const isDuplicateConversation = await Conversation.findOne({
        group: null,
        members: { $all: [authUser._id, memberIds[0]] },
      });
      if (isDuplicateConversation) {
        const error = new HttpError("already created conversation", 400);
        return next(error);
      }
    }

    newConversation = new Conversation({
      members: [authUser._id, ...memberIds],
      group: group,
    });

    await newConversation.save();
  } catch (err) {
    return next(unkownError(err));
  }

  res.json(newConversation);
};

const getConversations = async (req, res, next) => {
  const authUser = req.authUser;

  let conversationsData;

  let conversationsWithUnreadMessages;

  try {
    // Retrieve all conversations where the current user is a member and not a group conversation
    conversationsData = await Conversation.find({
      members: { $in: [authUser._id] },
      group: null,
    })
      .populate({ path: "members", select: "name email image " })
      .populate({ path: "lastMessage" })
      .lean()
      .sort({ lastMessage: -1 });

    // Get the count of unread messages for each conversation
    conversationsWithUnreadMessages = await Promise.all(
      conversationsData.map(async (conversation) => {
        const { _id, members, lastMessage } = conversation;
        const unreadMessagesCount = await Message.count({
          conversationId: _id,
          // Only count messages that are not from the current user and have not been read
          sender: { $ne: authUser._id },
          read: null,
        });

        let membersExceptAuthUser = members.filter((member) => member._id != authUser._id);

        // Add the unread messages count to the conversation data
        return { _id, lastMessage, members: membersExceptAuthUser, unreadMessagesCount };
      })
    );
  } catch (err) {
    return next(unkownError(err));
  }

  return res.json(conversationsWithUnreadMessages);
};

const updateConversation = async (req, res, next) => {
  const authUser = req.authUser;
  const { cid } = req.params;

  try {
    await Conversation.fin;
  } catch (err) {
    return next(unkownError(err));
  }
};

module.exports = { createConversation, getConversations, updateConversation };

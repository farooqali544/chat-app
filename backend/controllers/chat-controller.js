const Conversation = require("../models/Conversation");
const HttpError = require("../models/http-error");
const Message = require("../models/Message");
const User = require("../models/user");
const { unkownError } = require("../util/unkown-error");

// const searchChat = async (req, res, next) => {
//     const authUser = req.authUser;
//     const searchValue = req.query.q;

//     const regexSearchValue = new RegExp(searchValue, "i");

//     let messages;
//     let privateConversations;
//     let groupConversations;
//     let contacts;

//     try {
//       const tempcontacts = (
//         await User.findById(authUser._id, "contacts").populate({
//           path: "contacts",
//           match: { name: regexSearchValue },
//         })
//       ).contacts;

//       // Get All conversations and populate it's members
//       const conversations = await Conversation.find({ members: { $in: [authUser._id] } }).populate({
//         path: "members",
//         select: "name email",
//         match: { _id: { $ne: authUser._id } },
//       });

//       // Find Conversations where member name is similar to search field and categorize into private and group conversations
//       privateConversations = conversations.filter(
//         (conversation) =>
//           !conversation.group.name &&
//           conversation.members.some((member) => member.name.match(regexSearchValue))
//       );

//       contacts = tempcontacts.filter(
//         (contact) =>
//           !privateConversations.some((conversation) =>
//             conversation.members[0]._id.equals(contact._id)
//           )
//       );

//       groupConversations = conversations.filter((conversation) =>
//         conversation.group?.name?.match(regexSearchValue)
//       );

//       const conversationIds = conversations.map((conversation) => conversation._id);

//       messages = await Message.find({
//         conversationId: { $in: conversationIds },
//         text: regexSearchValue,
//       });
//     } catch (err) {
//       throw err;
//       // return next(unkownError(err));
//     }

//     res.json({ contacts, messages, privateConversations, groupConversations });
//   };

const searchChat = async (req, res, next) => {
  const authUser = req.authUser;
  const searchValue = req.query.q;

  const regexSearchValue = new RegExp(searchValue, "i");

  let messages;
  let conversations;
  let groupConversations;
  let contacts;

  try {
    const tempcontacts = (
      await User.findById(authUser._id, "contacts").populate({
        path: "contacts",
        match: { name: regexSearchValue },
      })
    ).contacts;

    // Get All conversations and populate it's members
    conversations = await Conversation.find({ members: { $in: [authUser._id] } }).populate({
      path: "members",
      match: { name: regexSearchValue, _id: { $ne: authUser._id } },
    });

    let filteredConversations = conversations.filter(
      (conversation) => conversation.members.length > 0
    );

    return res.json(filteredConversations)
    // let populatedConversations = await

    //     conversations = conversations.map((conversation) => ({
    //       ...conversation,
    //       members: conversation.members.filter((memberId) => !memberId.equals(authUser._id)),
    //     }));

    //     const populatedConversations = await Conversation.populate(conversations, { path: "members" });
    // return res.json(populatedConversations)
    // // Find Conversations where member name is similar to search field and categorize into private and group conversations
    // privateConversations = conversations.filter(
    //   (conversation) =>
    //     !conversation.group.name &&
    //     conversation.members.some((member) => member.name.match(regexSearchValue))
    // );

    // contacts = tempcontacts.filter(
    //   (contact) =>
    //     !privateConversations.some((conversation) =>
    //       conversation.members[0]._id.equals(contact._id)
    //     )
    // );

    // groupConversations = conversations.filter((conversation) =>
    //   conversation.group?.name?.match(regexSearchValue)
    // );

    const conversationIds = conversations.map((conversation) => conversation._id);

    messages = await Message.find({
      conversationId: { $in: conversationIds },
      text: regexSearchValue,
    }).populate({ path: "conversationId" });
  } catch (err) {
    throw err;
    // return next(unkownError(err));
  }

  res.json({ conversations });
};

module.exports = { searchChat };

const { check } = require("express-validator");
const Conversation = require("../models/Conversation");
const HttpError = require("../models/http-error");
const user = require("../models/user");

const isUniqueArray = (array) => {
  const set = new Set(array);
  if (set.size !== array.length) throw new Error("array is not unique");

  return true;
};

const isValidAndDoesExistId = async (id, Model, errorMsg) => {
  let doesExistId;
  try {
    doesExistId = await Model.exists({ _id: id });
  } catch (err) {
    throw new Error("Non existent Id");
  }
  
  if (!doesExistId) throw new Error(errorMsg);


  return true;
};

const isValidConversationId = (id) => {
  return isValidAndDoesExistId(id, Conversation, "Non existent Conversation Id");
};

const isValidUserId = (id) => {
  return isValidAndDoesExistId(id, user, "Non existent User Id");
};



const validateCreateConversation = async (req, res, next) => {
  const { group, memberIds } = req.body;

  // one member is allowed in individual conversation
  if (!group) {
    if (memberIds.length !== 1) {
      const error = new HttpError("one member is required to create individual conversation", 400);
      return next(error);
    }

    return next();
  }

  // name of the group and atleast 2 members is required for group conversation
  if (!group.name) {
    const error = new HttpError("name of the group is required", 400);
    return next(error);
  }

  if (memberIds.length < 2) {
    const error = new HttpError("atleast 2 members are required to create a group", 400);
    return next(error);
  }

  return next();
};

module.exports = {
  isUniqueArray,
  validateCreateConversation,
  isValidUserId,
  isValidConversationId,
};

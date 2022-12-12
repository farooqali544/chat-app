const express = require("express");
const Conversation = require("../models/Conversation");
const User = require("../models/user");
const { unkownError } = require("../util/unkown-error");
const router = express.Router();

router.get("/:uid", async (req, res, next) => {
  const { uid } = req.params;

  let userContacts;
  try {
    userContacts = await User.findById(uid, "contacts -_id");
  } catch (err) {
    return unkownError(next, err);
  }

  let contactsData;
  try {
    contactsData = await User.find({ _id: { $in: userContacts.contacts } }, "-password -contacts");
  } catch (err) {
    return unkownError(next, err);
  }

  res.json(contactsData);
});

router.post("/email", async (req, res, next) => {
  const { uid, name } = req.body;

  let userContacts;
  try {
    userContacts = await User.findById(uid, "contacts -_id");
  } catch (err) {
    return unkownError(next, err);
  }

  let contactsData;

  const regexExp = new RegExp(name, "i");

  try {
    contactsData = await User.find({ _id: { $in: userContacts.contacts }, name: { $regex: regexExp } }, "-password -contacts");
  } catch (err) {
    return unkownError(next, err);
  }

  res.json(contactsData);
});

module.exports = router;

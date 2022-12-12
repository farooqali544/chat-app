const User = require("../models/user");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const { validationErrors } = require("../validators/users-validators");
const { unkownError } = require("../util/unkown-error");
const jwt = require("jsonwebtoken");
const Conversation = require("../models/Conversation");

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({}, "-password");
    return res.json(allUsers);
  } catch (err) {
    return unkownError(next, err);
  }
};

const getUserByEmail = async (req, res, next) => {
  const { email } = req.params;
  let foundUser;
  try {
    foundUser = await User.findOne({ email: email }, "-password");
  } catch (err) {
    return unkownError(next, err);
  }

  return res.json(foundUser);
};

const getUser = async (req, res, next) => {
  const userData = req.userData;

  let user;

  try {
    user = await User.findById(userData.userId, "-password");
  } catch (err) {
    return unkownError(next, err);
  }

  res.json(user);
};

const signup = async (req, res, next) => {
  const invalidBody = validationErrors(req);
  if (invalidBody) return next(invalidBody);

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return unkownError(next, err);
  }

  if (existingUser) {
    const error = new HttpError("User exists already, pleason login instead", 422);
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return unkownError(next, err);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return unkownError(next, err);
  }

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, name: createdUser.name, email: createdUser.email }, "secret", { expiresIn: "1h" });
  } catch (err) {
    return unkownError(next, err);
  }

  return res.status(201).json({ userId: createdUser.id, name: createdUser.name, email: createdUser.email, token: token });
};

const updateProfilePic = async (req, res, next) => {
  const { uid } = req.params;
  const { image } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(uid);
  } catch (err) {
    return unkownError(next, err);
  }

  existingUser.image = image;

  try {
    await existingUser.save();
  } catch (err) {
    return unkownError(next, err);
  }
  res.json(image);
};

const login = async (req, res, next) => {
  const invalidBody = validationErrors(req);
  if (invalidBody) return next(invalidBody);

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return unkownError(next, err);
  }

  if (!existingUser) {
    const error = new HttpError("No such user found, please signup", 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return unkownError(next, err);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid password, please try again", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, "secret", { expiresIn: "1h" });
  } catch (err) {
    return unkownError(next, err);
  }

  return res.status(201).json({ userId: existingUser.id, email: existingUser.email, token: token });
};

const addContact = async (req, res, next) => {
  const { uid, contactId } = req.body;

  let user;
  try {
    user = await User.findById(uid, "-password");
  } catch (err) {
    return unkownError(next, err);
  }

  if (uid === contactId) {
    const error = new HttpError("wtf are you doing, it's your account nigga");
    return next(error);
  }

  if (user.contacts.includes(contactId)) {
    const error = new HttpError("Cannot add already existing contact.", 409);
    return next(error);
  }

  user.contacts.push(contactId);

  try {
    user.save();
  } catch (err) {
    return unkownError(next, err);
  }

  res.status(201).json(user);
};

const updateUser = async (req, res, next) => {
  const { uid } = req.params;
const data = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(uid, data, {new:true});
  } catch (err) {
    return unkownError(next, err);
  }
  if (!user) {
    const error = new HttpError("Not found user", 403);
    return next(error);
  }
  res.json(user);
};

module.exports = { getUser, signup, updateProfilePic, login, getAllUsers, getUserByEmail, addContact, updateUser };

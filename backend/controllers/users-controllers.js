const User = require("../models/user");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const { unkownError } = require("../util/unkown-error");
const jwt = require("jsonwebtoken");

const getUser = async (req, res, next) => {
  const authUser = req.authUser;

  let user;
  try {
    user = await User.findById(authUser._id, "-password -contacts");
  } catch (err) {
    return next(unkownError(err));
  }
  res.json(user);
};

const searchUsersByNameOrEmail = async (req, res, next) => {
  const authUser = req.authUser;
  const { searchValue } = req.params;

  let normalizedEmail = searchValue.toLowerCase();

  let users;

  try {
    //get authUser contacts
    const authUserContacts = (await User.findById(authUser._id, "contacts -_id")).contacts;

    //search users by name or email excluding authUser
    users = await User.find(
      {
        _id: { $ne: authUser._id },
        $or: [{ name: { $regex: `^${searchValue}`, $options: "i" } }, { email: normalizedEmail }],
      },
      "-password -contacts"
    ).lean();

    // if user is already a contact, set isContact = true
    users.forEach((user) => {
      if (authUserContacts.includes(user._id)) {
        user.isContact = true;
      }
    });
  } catch (err) {
    return next(unkownError(err));
  }

  res.json(users);
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(unkownError(err));
  }

  if (existingUser) {
    const error = new HttpError("User exists already, please login instead", 422);
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(unkownError(err));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(unkownError(err));
  }

  let token;
  try {
    token = jwt.sign(
      { _id: newUser._id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "10000h" }
    );
  } catch (err) {
    return next(unkownError(err));
  }

  return res
    .status(201)
    .json({ _id: newUser._id, name: newUser.name, email: newUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(unkownError(err));
  }

  if (!user) {
    const error = new HttpError("No such user found, please signup", 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(unkownError(err));
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid password, please try again", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10000h" }
    );
  } catch (err) {
    return next(unkownError(err));
  }

  return res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    // contacts: user.contacts,
    token: token,
  });
};

const addContact = async (req, res, next) => {
  const authUser = req.authUser;
  const { contactId } = req.params;

  let user;
  try {
    user = await User.findById(authUser._id, "-password");
  } catch (err) {
    return next(unkownError(err));
  }

  if (authUser._id === contactId) {
    const error = new HttpError(
      "Looks like you're feeling lonely, but I'm afraid adding yourself as a friend won't fill that void. Sorry, it's just not possible here.😔"
    );
    return next(error);
  }

  if (user.contacts.includes(contactId)) {
    const error = new HttpError("Cannot add already existing contact.", 409);
    return next(error);
  }

  user.contacts.push(contactId);

  try {
    await user.save();
  } catch (err) {
    return next(unkownError(err));
  }

  res.status(201).json("success");
};

const removeContact = async (req, res, next) => {
  const authUser = req.authUser;
  const { contactId } = req.params;

  let user;
  try {
    user = await User.findById(authUser._id, "-password");
  } catch (err) {
    return next(unkownError(err));
  }

  const updatedContacts = user.contacts.filter((id) => id != contactId);

  user.contacts = updatedContacts;

  try {
    await user.save();
  } catch (err) {
    return next(unkownError(err));
  }

  res.status(201).json(user);
};

const getContacts = async (req, res, next) => {
  const authUser = req.authUser;

  let contacts;

  try {
    contacts = await User.find({ _id: authUser._id }, "contacts -_id");
  } catch (err) {
    return next(unkownError(err));
  }
  res.json(contacts);
};

const updateUser = async (req, res, next) => {
  const authUser = req.authUser;
  const { name, image } = req.body;

  let updatedUser = {};
  if (name) updatedUser.name = name;
  if (image) updatedUser.image = image;

  try {
    await User.findByIdAndUpdate(authUser._id, { $set: updatedUser }, { new: true });
  } catch (err) {
    return next(unkownError(err));
  }
};

module.exports = {
  getUser,
  searchUsersByNameOrEmail,
  signup,
  login,
  addContact,
  removeContact,
  getContacts,
  updateUser,
};

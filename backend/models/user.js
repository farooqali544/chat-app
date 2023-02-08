const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  image: { type: String },
  contacts: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
  lastSeen: { type: Date },
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(idValidator, {
  message: "one of the contacts have invalid user id",
});
module.exports = mongoose.model("User", userSchema);

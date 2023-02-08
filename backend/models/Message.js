const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    read: { type: Date },
  },
  { timestamps: true }
);

messageSchema.plugin(idValidator, {
  message: "conversation id is invalid",
});

module.exports = mongoose.model("Message", messageSchema);

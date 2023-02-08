const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    group: {
      name: { type: Schema.Types.String },
      image: { type: Schema.Types.String },
    },
    lastMessage: { type: Schema.Types.String, ref: "Message" },
  },
  { timestamps: true }
);

conversationSchema.plugin(idValidator, {
  message: "one of the members have invalid user id",
});

module.exports = mongoose.model("Conversation", conversationSchema);

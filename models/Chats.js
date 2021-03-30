const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageScheam = new Schema({
  message: {
    type: String,
    default: "",
  },
  timeStamp: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: false,
  },
});
const chatSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  messages: [message],
});

module.exports = mongoose.model("chat", chatSchema);

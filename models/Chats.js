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
  sender: {
    type: String,
    required: true,
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
  user1Index: {
    type: String,
    required: true,
  },
  user2Index: {
    type: String,
    required: true,
  },
  messages: [messageScheam],
});

module.exports = mongoose.model("chat", chatSchema);

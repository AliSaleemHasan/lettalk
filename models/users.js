const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    default: "ali",
  },
  password: {
    type: String,
    default: "",
  },

  state: {
    lastseen: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: false,
    },
    Oauth: {
      type: Boolean,
      default: false,
    },
  },
  image: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },

  // chatsInfo: [
  //   {
  //     chatID: {
  //       type: Schema.Types.ObjectId,
  //       required: true,
  //       ref: "chat",
  //     },
  //     otherUser: {
  //       type: Schema.Types.ObjectId,
  //       required: true,
  //       ref: "user",
  //     },
  //   },
  // ],
});

module.exports = mongoose.model("user", user);

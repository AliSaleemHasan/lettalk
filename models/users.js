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
    lastseen: Date,
    default: "",
    status: {
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
});

module.exports = mongoose.model("user", user);

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
    default: email,
  },
  password: {
    type: String,
    required: true,
  },

  state: {
    lastseen: Date,
    status: {
      type: Boolean,
      default: false,
    },
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
  },
});

module.exports = user;

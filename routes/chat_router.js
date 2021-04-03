const express = require("express");
const Chat = require("../models/Chats");
const chatRouter = express.Router();
chatRouter.use(express.json());

//userID as params then give me all chat to this user

chatRouter
  .route("/:userID")
  .get((req, res, next) => {
    Chat.find({
      $or: [{ user1: req.params.userID }, { user2: req.params.userID }],
    })
      .then(
        (user) => {
          (res.statusCode = 200),
            res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Chat.create({
      user1: req.params.userID,
      user2: req.body._id,
      messages: [],
    })
      .then(
        (chat) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(chat);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = chatRouter;

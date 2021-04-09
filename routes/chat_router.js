const express = require("express");
const Chats = require("../models/Chats");
const chatRouter = express.Router();
chatRouter.use(express.json());

//userID as params then give me all chat to this user

chatRouter
  .route("/user/:userID")
  .get((req, res, next) => {
    Chats.find({
      $or: [{ user1: req.params.userID }, { user2: req.params.userID }],
    })
      .populate("user1")
      .populate("user2")
      .then(
        (chats) => {
          (res.statusCode = 200),
            res.setHeader("Content-Type", "application/json");
          res.json({ chats });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    if (req.body.user2 !== req.params.userID) {
      Chats.findOne({
        $or: [
          { $and: [{ user1: req.params.userID }, { user2: req.body.user2 }] },
          { $and: [{ user2: req.params.userID }, { user1: req.body.user2 }] },
        ],
      })
        .then(
          (chat) => {
            if (chat) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,
                message: "chat is already existed !!!!!!",
              });
            }

            Chats.create({
              user1: req.params.userID,
              user2: req.body.user2,
              messages: [],
            })
              .then(
                (chat) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({ success: true, chatId: chat._id });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  });

chatRouter.get("/:chatID", (req, res, next) => {
  Chats.findById(req.params.chatID)
    .populate("user1")
    .populate("user2")
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

chatRouter.route("/:chatID/messages").post((req, res, next) => {
  Chats.findById(req.params.chatID)
    .then(
      (chat) => {
        if (chat) {
          chat.messages.push(req.body);
          chat
            .save()
            .then(
              (chat) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({ messages: chat.messages });
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, message: "error obtain chat!!" });
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = chatRouter;

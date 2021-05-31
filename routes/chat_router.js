const express = require("express");
const Chats = require("../models/Chats");
const chatRouter = express.Router();
const authenticate = require("../authenticate");
chatRouter.use(express.json());

//userID as params then give me all chat to this user

chatRouter
  .route("/user/:userID")
  .get(authenticate.verifyJwt, (req, res, next) => {
    Chats.find({
      $or: [{ user1: req.params.userID }, { user2: req.params.userID }],
    })
      .populate("user1")
      .populate("user2")
      .then(
        (chats) => {
          let chatsCP = chats;
          chatsCP.forEach((chat) => {
            if (chat.messages.length > 0)
              chat.messages = chat.messages[chat.messages.length - 1];
            else chat.messages[0] = ".";
          });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ chats: chatsCP });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyJwt, (req, res, next) => {
    Chats.findOne({
      $or: [
        { $and: [{ user1: req.params.userID }, { user2: req.body.user2 }] },
        { $and: [{ user2: req.params.userID }, { user1: req.body.user2 }] },
      ],
    })
      .then((chat) => {
        if (chat) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: false,
            message: "chat is already existed !!!!!!",
          });
        }

        Chats.create({
          user1: req.body.user1,
          user2: req.body.user2,
        })

          .then((chat) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, chat });
          })
          .catch((err) => next(err));
      })
      .catch((err) => console.log(err));
  });

chatRouter.get("/:chatID", authenticate.verifyJwt, (req, res, next) => {
  Chats.findById(req.params.chatID, { messages: { $slice: 3 } })
    .populate("user1")
    .populate("user2")
    .then(
      (chat) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ chat });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

chatRouter
  .route("/:chatID/messages")
  .post(authenticate.verifyJwt, (req, res, next) => {
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
                  res.json({
                    message: chat.messages[chat.messages.length - 1],
                  });
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

//delete and edit messages
chatRouter
  .route("/:chatID/messages/:messageID")
  .put((req, res, next) => {
    Chats.findById(req.params.chatID)
      .then(
        (chat) => {
          if (!chat || !chat.messages.id(req.params.messageID)) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            return res.json({ err: "error !" });
          }

          chat.messages.id(req.params.messageID).message = req.body.message;
          chat
            .save()
            .then(
              (chat) => {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json({
                  success: true,
                  message: chat.messages.id(req.params.messageID),
                });
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyJwt, (req, res, next) => {
    Chats.findById(req.params.chatID)
      .then(
        (chat) => {
          if (!chat || !chat.messages.id(req.params.messageID)) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            return res.json({ err: "chat not found!!!!!!!!!!!!!!" });
          }
          chat.messages.id(req.params.messageID).remove();
          chat
            .save()
            .then(
              (chat) => {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json({ success: true });
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = chatRouter;

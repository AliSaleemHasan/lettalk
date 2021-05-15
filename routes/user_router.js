const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const fs = require("fs");
const authenticate = require("../authenticate");
const { uploadStorge } = require("../mongoInit.js");
router.use(express.json());

router.get("/", authenticate.verifyJwt, (req, res) => {
  if (req.user && !req.query.logout) {
    User.findById(req.user)
      .then((user) => {
        req.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, user: user });
      })
      .catch((err) => console.log(err));
  } else {
    res.clearCookie("UTOF");
    res.status(200).json({ success: true });
  }
});

// router.get("/", authenticate.verifyJwt, (req, res) => {
//   if (req.user && !req.query.logout) {
//     User.findById(req.user)
//       .populate("chatsInfo.chatID")
//       .populate("chatsInfo.otherUser")
//       .then(
//         (user) => {
//           const { password, ...other } = user._doc;

//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json({
//             success: true,
//             user: other,
//           });
//         },
//         (err) => next(err)
//       )
//       .catch((err) => next(err));
//   } else {
//     res.clearCookie("UTOF");
//     res.status(200).json({ success: true });
//   }
// });
//
router.post("/signup", (req, res, next) => {
  let hash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hash;
  req.body.bio = "Hey there,i am using Chaty";
  let user = new User(req.body);
  user
    .save()
    .then((user) => {
      let token = authenticate.getToken({ id: user._id });
      res.cookie("UTOF", token, { httpOnly: true, sameSite: "lax" });
      req.statusCode = 200;
      res.setHeader("Content-type", "application/json");
      res.json({ success: true, user });
    })
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "failed" });
    } else {
      let token = authenticate.getToken({ id: user._id });
      res.cookie("UTOF", token, { httpOnly: true, sameSite: "lax" });
      req.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "Success", user });
    }
  });
});

//add chat Info to user when make a new chat

// router.post("/newChat", (req, res, next) => {
//   User.findById(req.body.id)
//     .then(
//       (user) => {
//         user.chatsInfo.push(req.body.info);
//         user
//           .save()
//           .then(
//             (user) => {
//               console.log(user);

//               res.statusCode = 200;
//               res.setHeader("Content-Type", "application/json");
//               res.json({ success: true, user });
//             },
//             (err) => console.log(err)
//           )
//           .catch((err) => console.log(err));
//       },
//       (err) => console.log(err)
//     )
//     .catch((err) => console.log(err));
// });

//get user chats

//change profile picture
router.post(
  "/upload/image/:id",
  authenticate.verifyJwt,
  uploadStorge.single("file"),
  (req, res, next) => {
    User.findById(req.params.id).then((user) => {
      console.log(user.image);
      if (user.image && fs.existsSync(user.image)) fs.unlinkSync(user.image);
      user.image = "/uploads/" + req.file.filename;

      user
        .save()
        .then((user) => {
          req.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, user });
        })
        .catch((err) => next(err));
    });
  }
);

//change user info from setting page
router.put("/info/:id", authenticate.verifyJwt, (req, res, next) => {
  let newInfo;

  if (req.query.username) {
    newInfo = User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { username: req.body.info },
      },
      { new: true }
    );
  } else {
    newInfo = User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { bio: req.body.info },
      },
      { new: true }
    );
  }

  newInfo
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ user });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

//search for user by its id
router.post("/search", authenticate.verifyJwt, (req, res, next) => {
  User.find(
    { $text: { $search: req.body.query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })

    .then(
      (users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

//set user state (online or offline)
exports.setUserState = async (userID, status, lastseen) => {
  console.log(status);
  let user = await User.findById(userID);
  if (user) {
    let newState = user.state;
    newState.status = status;
    if (lastseen) newState.lastseen = lastseen;
    await user.save();

    return user;
  }
};

exports.userRouter = router;

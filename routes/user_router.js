const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const fs = require("fs");
const { uploadStorge } = require("../mongoInit.js");
router.use(express.json());

router.get("/", (req, res) => {
  if (req.user && !req.query.logout) {
    req.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, user: req.user });
  } else {
    req.session = null;
    req.logout();
    req.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: false, user: null });
  }
});

router.post("/signup", (req, res, next) => {
  let hash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hash;
  let user = new User(req.body);
  user
    .save()
    .then((user) => {
      req.statusCode = 200;
      res.setHeader("Content-type", "application/json");
      res.json({ success: true, user });
    })
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  -console.log(req.body.email);
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "failed" });
    } else {
      -console.log(req.email);
      req.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "Success", user: user });
    }
  });
});

router.post(
  "/upload/image/:id",
  uploadStorge.single("file"),
  (req, res, next) => {
    User.findById(req.params.id).then((user) => {
      //   if (user.image && fs.existsSync(user.image)) fs.unlinkSync(user.imag);
      user.image = "/uploads/" + req.file.filename;

      user
        .save()
        .then((user) => {
          console.log(user);
          req.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, user });
        })
        .catch((err) => next(err));
    });
  }
);

router.put("/info/:id", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: { username: req.body.info },
    },
    { new: true }
  )
    .then(
      (user) => {
        console.log(user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ user });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");

const strorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "__" + Date.now());
  },
});



const upload = multer({ storage: storage });



router.use(express.json());

module.exports = router;

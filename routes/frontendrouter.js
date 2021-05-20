const router = require("express").Router();
const path = require("path");

router.get(
  ["/", "/chat/:chatId/:index", "/chat/:chatId/:index/info"],
  (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  }
);

module.exports = router;

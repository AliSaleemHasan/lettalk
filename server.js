require("dotenv").config();
const http = require("http");
const express = require("express");
const passport = require("passport");
const socket = require("socket.io");
const cookieParesr = require("cookie-parser");
const compression = require("compression");
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
//mongoose connection;

const path = require("path");
//routes
const { userRouter } = require("./routes/user_router");
const authRouter = require("./routes/auth_router");
const chatRouter = require("./routes/chat_router");
const frontRouter = require("./routes/frontendrouter");

let connect = mongoose
  .connect("mongodb://localhost:27017/chatApp", {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then((db) => console.log("connected correctly to db"))
  .catch((err) => console.log(err));

const app = express();
app.use(compression());
const server = http.createServer(app);
const io = socket(server);

app.use(express.json());
app.use(cookieParesr());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   if (req.user) res.send(req.user.username);
//   else res.send("hello from server side ");
// });

//socket io configuration

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send__message", (otherUserID, message, index) => {
    socket.in(otherUserID).emit("recive__message", message, index);
  });

  socket.on("typing", (otherUserID) => {
    socket.to(otherUserID).emit("is__typing");
  });

  socket.on("not__typing", (otherUserID) => {
    socket.broadcast.to(otherUserID).emit("isNot__typing");
  });

  // socket.on("add__room", (chat, otherUserID) => {
  //   socket.to(otherUserID).emit("accept__addRoom", chat);
  // });

  socket.on("addingChatWarning", (otherUserId, room) => {
    socket.to(otherUserId).emit("addRoom", room);
  });

  socket.on(
    "message__editOrdelete",
    (otherUserID, message, messageIndex, chatIndex, type) => {
      socket
        .in(otherUserID)
        .emit("recive__editedMessage", message, messageIndex, chatIndex, type);
    }
  );
});

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static("./frontend/build", {
      maxAge: "40d",
    })
  );
  app.use("/", frontRouter);
}
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/chats", chatRouter);
app.use((err, req, res, next) => {
  let output = {
    message: err.message,
    name: err.name,
    text: err.toString(),
  };
  let errStatus = err.status || 500;
  res.status(errStatus).send(output);
});
server.listen(port, () => {
  console.log(`connected correctly to http://localhost:${port}`);
});

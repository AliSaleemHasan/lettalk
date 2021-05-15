require("dotenv").config();
const http = require("http");
const express = require("express");
const passport = require("passport");
const socket = require("socket.io");
const cookieParesr = require("cookie-parser");

//mongoose connection;
const { uploadStorge, connection, upload } = require("./mongoInit");
("multer-gridfs-storage");
const path = require("path");
//routes
const { userRouter, setUserState } = require("./routes/user_router");
const authRouter = require("./routes/auth_router");
const chatRouter = require("./routes/chat_router");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.json());
app.use(cookieParesr());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (req.user) res.send("fuck you " + req.user.username);
  else res.send("hello from server side ");
});

//socket io configuration

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  setUserState(id, true);

  socket.on("send__message", (otherUserID, message, index) => {
    console.log(message);
    console.log(index);
    console.log(otherUserID);
    socket.in(otherUserID).emit("recive__message", message);
    socket.emit("recive__message", message);
  });

  socket.on("typing", (otherUserID) => {
    socket.to(otherUserID).emit("is__typing");
  });

  socket.on("not__typing", (otherUserID) => {
    socket.broadcast.to(otherUserID).emit("isNot__typing");
  });

  socket.on("add__room", (chat, otherUserID) => {
    socket.to(otherUserID).emit("accept__addRoom", chat);
  });

  socket.on("disconnect", (reason) => {
    setUserState(id, false, Date.now());
  });
});

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
server.listen(process.env.PORT, () => {
  console.log(`connected correctly to http://localhost:${process.env.PORT}`);
});

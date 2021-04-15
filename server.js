require("dotenv").config();
const http = require("http");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const socket = require("socket.io");

//mongoose connection;
const { uploadStorge, connection, upload } = require("./mongoInit");
("multer-gridfs-storage");
const path = require("path");
//routes
const userRouter = require("./routes/user_router");
const authRouter = require("./routes/auth_router");
const chatRouter = require("./routes/chat_router");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.json());
app.use(
  session({
    secret: "fuck fear drank bear",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (req.user) res.send("fuck you " + req.user.username);
  else res.send("hello from server side ");
});

io.on("connection", (socket) => {
  console.log("user connected");
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("join__room", (room_id) => {
    socket.join(room_id);
    socket.on("send__message", (message) => {
      socket.broadcast.to(`${room_id}`).emit("recive__message", message);
    });
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

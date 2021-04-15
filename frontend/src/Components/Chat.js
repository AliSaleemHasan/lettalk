import React, { useState, useEffect } from "react";
import "./Chat.css";
import Message from "./Message.js";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import AttachFile from "@material-ui/icons/AttachFile";
import EmojiEmotions from "@material-ui/icons/EmojiEmotions";
import Send from "@material-ui/icons/Send";
import useWidth from "./useWidth";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import Picker from "emoji-picker-react";
import { useParams } from "react-router-dom";
import { setChat, Selector as chatSelector } from "../features/chatSlice";
import { Selector as userSelector } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { Selector as socketSelector } from "../features/socketSlice";
import requests from "../handleRequests.js";
function Chat() {
  const width = useWidth();
  const history = useHistory();
  const socket = useSelector(socketSelector);
  const [input, setInput] = useState("");
  const [toggleEmoji, setToggleEmoji] = useState(false);
  const user = useSelector(userSelector);
  const chat = useSelector(chatSelector);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const chatId = useParams();
  const gotoSidebar = (e) => {
    e.preventDefault();
    history.push("/");
  };
  const onEmojiClick = (e, emoji) => {
    e.preventDefault();
    setInput(input + emoji.emoji);
  };

  const gotoInfo = (e) => {
    e.preventDefault();
    history.push(`/chat/${chat._id}/info`);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    requests
      .sendMessage(chatId.chatId, input, user._id)
      .then((message) => {
        socket.emit("send__message", message);
        setMessages([...messages, message.message]);
      })
      .catch((err) => console.log(err));
    setInput("");
  };

  useEffect(() => {
    requests
      .getChat(chatId.chatId)
      .then((data) => {
        dispatch(setChat(data));
        setMessages(data.messages);
      })
      .catch((err) => console.log(err));

    socket.emit("join__room", chatId.chatId);
  }, []);

  useEffect(() => {
    if (socket == null) return;
    socket.on("recive__message", (message) => {
      console.log(message);
      setMessages([...messages, message.message]);
    });
    return () => socket.off("recive__message");
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="header__left">
          {width < 786 ? (
            <div>
              <IconButton color="primary" onClick={gotoSidebar}>
                <ArrowBack />
              </IconButton>
            </div>
          ) : (
            ""
          )}
          <p className="chat__headerName" onClick={gotoInfo}>
            {chat?.user1?._id === user._id
              ? chat?.user2?.username
              : chat?.user1?.username}
          </p>
          <div className="chat__headerStatus">
            <p className="chat__status"></p>
            <p className="status">online</p>
          </div>
        </div>
        <div className="header__right">
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <Search />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages?.map((message) => (
          <Message
            key={message._id}
            timestamp={message.timestamp}
            content={message.message}
            is_sender={message.sender === user._id}
            image={
              message.sender == chat?.user1._id
                ? chat?.user1?.image
                : chat?.user2?.image
            }
          />
        ))}
      </div>
      <div className="chat__footer">
        <IconButton
          color={toggleEmoji ? "primary" : ""}
          onClick={(e) => setToggleEmoji(!toggleEmoji)}
        >
          <EmojiEmotions />
        </IconButton>
        <form action="">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type something to send.."
          />
          <IconButton type="submit" onClick={sendMessage}>
            <Send />
          </IconButton>
        </form>
      </div>
      {toggleEmoji ? (
        <Picker
          className="chat__emoji"
          onEmojiClick={onEmojiClick}
          disableSearchBar={true}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Chat;

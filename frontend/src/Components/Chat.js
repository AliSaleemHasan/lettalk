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
function Chat() {
  const width = useWidth();
  const history = useHistory();
  const [input, setInput] = useState("");
  const [toggleEmoji, setToggleEmoji] = useState(false);
  const user = useSelector(userSelector);
  const chat = useSelector(chatSelector);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const chatId = useParams();
  const gotoSidebar = async (e) => {
    e.preventDefault();
    // await fetch(`/chats/${chatID}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: {},
    // }).then((response) => {});
    history.push("/");
  };
  const onEmojiClick = (e, emoji) => {
    e.preventDefault();
    setInput(input + emoji.emoji);
  };

  const gotoInfo = (e) => {
    e.preventDefault();
    history.push("/chat/ali/info");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    await fetch(`/chats/${chatId.chatId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input, sender: user._id }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  useEffect(async () => {
    console.log("comming back");
    console.log(chatId.chatId);
    await fetch(`/chats/${chatId.chatId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setChat(data));
        setMessages(data.messages);
      })
      .catch((err) => console.log(err));
  }, []);
  const pickerStyle = {
    color: "#2b3238",
    width: "100%",
  };
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
            {chat?.user1?._id == user.id
              ? chat?.user1?.username
              : chat?.user2?.username}
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
            is_sender={message.sender !== user._id}
            image={
              message.sender == user._id
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

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Chat.css";
import Message from "./Message.js";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import AttachFile from "@material-ui/icons/AttachFile";
import EmojiEmotions from "@material-ui/icons/EmojiEmotions";
import Send from "@material-ui/icons/Send";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import Picker from "emoji-picker-react";
import { useParams } from "react-router-dom";
import { setChat, Selector as chatSelector } from "../features/chatSlice";
import { Selector as userSelector } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import requests from "../handleRequests.js";
import { useSocket } from "../SocketProvider";
function Chat() {
  console.log("chat render");
  const [otherUserID, setOtherUserID] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const history = useHistory();
  const [socket] = useSocket();
  const input = useRef();
  const [toggleEmoji, setToggleEmoji] = useState(false);
  const user = useSelector(userSelector);
  const chat = useSelector(chatSelector);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();

  const gotoSidebar = (e) => {
    e.preventDefault();
    history.push("/");
  };

  const onEmojiClick = (e, emoji) => {
    e.preventDefault();
    input.current.value = input.current.value + emoji.emoji;
  };

  const gotoInfo = (e) => {
    e.preventDefault();
    history.push(`/chat/${chat._id}/${params.index}}/info`);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.current.value) return;

    requests
      .sendMessage(params.chatId, input.current.value, user._id)
      .then((message) => {
        socket.emit(
          "send__message",
          otherUserID,
          message.message,
          params.index
        );

        socket.emit("not__typing", otherUserID);
      })
      .catch((err) => console.log(err));
    input.current.value = "";
  };

  const Typing = (e) => {
    if (!socket) return;
    e.preventDefault();
    e.target.value
      ? socket.emit("typing", otherUserID)
      : socket.emit("not__typing", otherUserID);
  };

  //get chat if it is null in redux and save messages in messages state
  useEffect(() => {
    if (!socket || (!user && !chat)) return;

    requests
      .getChat(params.chatId)
      .then((data) => {
        dispatch(setChat(data.chat));

        data?.chat.user1?._id == user._id
          ? setOtherUserID(data?.chat.user2?._id)
          : setOtherUserID(data?.chat.user1?._id);
        setMessages(data.chat.messages);
      })
      .catch((err) => console.log(err));

    socket.emit("join__room", params.chatId);
  }, [socket, params.chatId]);

  //for typing effect
  useEffect(() => {
    if (socket == null) return;
    socket.on("is__typing", () => {
      setIsTyping(true);
    });

    return () => socket.off("is__typing");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("isNot__typing", () => {
      setIsTyping(false);
    });

    return () => socket.off("isNot__typing");
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;

    const setReceivedMessage = (message) => {
      setMessages([...messages, message]);
    };
    socket.on("recive__message", setReceivedMessage);

    return () => socket.off("recive__message", setReceivedMessage);
  }, [socket, messages]);

  const messageRef = useCallback((messageContainer) => {
    if (messageContainer) {
      messageContainer.scrollIntoView();
    }
  }, []);
  return (
    <div className="chat">
      <div className="chat__header">
        <div className="header__left">
          {/* NVM : non visible if width >786 */}
          <div className={"NVM"}>
            <IconButton color="primary" onClick={gotoSidebar}>
              <ArrowBack />
            </IconButton>
          </div>
          <p className="chat__headerName" onClick={gotoInfo}>
            {chat?.user1?._id === user._id
              ? chat?.user2?.username
              : chat?.user1?.username}
          </p>
          <div className="chat__headerStatus">
            <p className="chat__status"></p>
            <p className="status">
              {isTyping
                ? "Typing.. "
                : user.state.status === true
                ? "Online"
                : user.state.lastseen}
            </p>
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
          <div key={message._id} ref={messageRef}>
            <Message
              timestamp={message.timestamp}
              content={message.message}
              is_sender={message.sender === user._id}
              username={
                message.sender == chat?.user1._id
                  ? chat?.user1?.username
                  : chat?.user2?.username
              }
              image={
                message.sender == chat?.user1._id
                  ? chat?.user1?.image
                  : chat?.user2?.image
              }
            />
          </div>
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
            ref={input}
            onChange={Typing}
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

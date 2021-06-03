import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Chat.css";
import Message from "./Message.js";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import EmojiEmotions from "@material-ui/icons/EmojiEmotions";
import Send from "@material-ui/icons/Send";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import Picker from "emoji-picker-react";
import { useParams } from "react-router-dom";
import {
  editMessage,
  Selector as chatsSelector,
  setMessage,
} from "../features/chatsSlice";
import { Selector as userSelector } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import requests from "../handleRequests.js";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import { useSocket } from "../SocketProvider";
function Chat() {
  const [otherUserID, setOtherUserID] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const history = useHistory();
  const [socket] = useSocket();
  const input = useRef();
  const [toggleEmoji, setToggleEmoji] = useState(false);
  const user = useSelector(userSelector);
  const chats = useSelector(chatsSelector);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();
  const [messageToChange, setMessageToChange] = useState({});

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
    history.push(`/chat/${chats[params.index]?._id}/${params.index}/info`);
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

  const editChatMessage = (e) => {
    e.preventDefault();
    const editedMessage = prompt(
      "change the message",
      messageToChange.message?.message
    );
    requests
      .editORdeleteMessage(
        chats[params.index]?._id,
        messageToChange.message._id,
        editedMessage
      )
      .then((data) =>
        socket.emit(
          "message__editOrdelete",
          otherUserID,
          data.message,
          messageToChange.index,
          params.index,
          "edit"
        )
      )
      .catch((err) => console.log(err));

    setMessageToChange({});
  };

  const deleteMessage = (e) => {
    e.preventDefault();
    requests
      .editORdeleteMessage(
        chats[params.index]?._id,
        messageToChange.message._id
      )
      .then((data) =>
        socket.emit(
          "message__editOrdelete",
          otherUserID,
          data.message,
          messageToChange.index,
          params.index,
          "delete"
        )
      )
      .catch((err) => console.log(err));

    setMessageToChange({});
  };
  //get chat if it is null in redux and save messages in messages state
  useEffect(() => {
    if (!socket || (!user && !chats[params.index])) return;

    chats[params.index]?.user1?._id == user._id
      ? setOtherUserID(chats[params.index]?.user2?._id)
      : setOtherUserID(chats[params.index]?.user1?._id);
  }, [socket, params.chatId]);

  useEffect(() => {
    if (socket == null) return;

    const setEditedMessage = (message, index, chatIndex, type) => {
      console.log({ message, index, chatIndex, type });
      dispatch(editMessage({ type, chatIndex, message, index }));
    };
    socket.on("recive__editedMessage", setEditedMessage);

    return () => socket.off("recive__editedMessage", setEditedMessage);
  }, [socket]);

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
      dispatch(setMessage({ chatIndex: params.index, message }));
    };
    socket.on("recive__message", setReceivedMessage);

    return () => socket.off("recive__message", setReceivedMessage);
  }, [socket]);

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
            {chats[params.index]?.user1?._id === user._id
              ? chats[params.index]?.user2?.username
              : chats[params.index]?.user1?.username}
          </p>
          <div className="chat__headerStatus">
            {/* <p className="chat__status"></p> */}
            <p className="status">
              {isTyping
                ? "Typing.. "
                : new Date(user.state.lastseen).toUTCString()}
            </p>
          </div>
        </div>
        <div className="header__right">
          {messageToChange.message && (
            <div className="message__edit">
              <IconButton onClick={editChatMessage} color="primary">
                <Edit />
              </IconButton>

              <IconButton onClick={deleteMessage} color="secondary">
                <Delete />
              </IconButton>
            </div>
          )}
          <IconButton>
            <Search />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {chats[params.index]?.messages?.map((message, index) => (
          <div
            onClick={() => {
              if (message.sender !== user._id) return;
              if (!messageToChange.message) {
                setMessageToChange({ message, index });
              } else setMessageToChange({});
            }}
            key={message._id}
            ref={messageRef}
          >
            <Message
              timestamp={message.timestamp}
              content={message.message}
              is_sender={message.sender === user._id}
              username={
                message.sender == chats[params.index]?.user1._id
                  ? chats[params.index]?.user1?.username
                  : chats[params.index]?.user2?.username
              }
              image={
                message.sender == chats[params.index]?.user1._id
                  ? chats[params.index]?.user1?.image
                  : chats[params.index]?.user2?.image
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

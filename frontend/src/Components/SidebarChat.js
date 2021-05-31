import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SidebarChat.css";
import requests from "../handleRequests.js";
import { setChat, Selector as chatSelector } from "../features/chatSlice";
import { Selector as userSelector } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../SocketProvider.js";
import { useParams } from "react-router-dom";
import { LoadableAvatar } from "../loadable";
const SidebarChat = React.memo(
  ({
    user2,
    id,
    name,
    count,
    image,
    email,
    type,
    lastMessage,
    isTyping,
    index,
  }) => {
    const chatId = useParams();
    const chat = useSelector(chatSelector);
    const history = useHistory();
    const [socket] = useSocket();
    const [error, setError] = useState("");
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const gotoChat = (e) => {
      e.preventDefault();

      if (chatId.chatId === chat?._id) {
        history.push(`/chat/${id}/${index}`);
        return;
      }

      requests
        .getChat(id)
        .then((data) => {
          dispatch(setChat(data.chat));
        })
        .catch((err) => console.log(err));

      history.push(`/chat/${id}/${index}`);
    };

    const addChat = async (e) => {
      if (!socket) {
        return;
      }
      e.preventDefault();
      requests
        .addChat(user._id, user2)
        .then((data) => {
          let room = data.chat;
          room.user1 = user;

          socket.emit("add__room", room, user2);
          if (data.success) {
            return history.push(`/chat/${data.chat._id}/${index}`);
          }
          setError(data?.message);
        })
        .catch((err) => console.log(err));
    };
    return (
      <div
        className="sidebarChat"
        onClick={type !== "search" ? gotoChat : addChat}
      >
        <div className="sidebarChat__left">
          <LoadableAvatar alt="user image" src={image}>
            {!image && name && name[0]?.toUpperCase()}
          </LoadableAvatar>
        </div>
        <div className="sidebarChat__right">
          <div className="sidebarChat__info">
            <p className="sidebarChat__name">{name}</p>
            {type !== "search" && count && (
              <p className="sidebarChat__count">{count}</p>
            )}
          </div>
          {type === "search" ? (
            <p className="sidebarChat__lastmessage">{email}</p>
          ) : (
            <p className="sidebarChat__lastmessage">
              {isTyping ? "Typing" : lastMessage?.message || lastMessage}
            </p>
          )}

          <p className="error">{error}</p>
        </div>
      </div>
    );
  }
);
export default SidebarChat;

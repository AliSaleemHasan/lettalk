import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SidebarChat.css";
import requests from "../handleRequests.js";
import { Selector as userSelector } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../SocketProvider.js";
import { useParams } from "react-router-dom";
import { addChat, Selector as chatsSelector } from "../features/chatsSlice";
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
    const params = useParams();
    const history = useHistory();
    const [socket] = useSocket();
    const [error, setError] = useState("");
    const chats = useSelector(chatsSelector);
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const gotoChat = (e) => {
      // e.preventDefault();

      // if (params.chatId === chats[params.index]?._id) {
      //   history.push(`/chat/${id}/${index}`);
      //   return;
      // }

      // requests
      //   .getChat(id)
      //   .then((data) => {
      //     dispatch(setChat(data.chat));
      //   })
      //   .catch((err) => console.log(err));

      history.push(`/chat/${id}/${index}`);
    };

    const addNewChat = async (e) => {
      e.preventDefault();
      if (!socket) {
        return;
      }
      console.log("in add new chat funciton");
      requests
        .addChatToDB(user._id, user2)
        .then((data) => {
          console.log(data);
          if (data.success) {
            let room = data.chat;
            room.user1 = user;

            dispatch(addChat(room));
            socket.emit("add__room", room, user2);

            return history.push(`/chat/${data.chat._id}/${index}`);
          }
          setError(data?.message);
        })
        .catch((err) => console.log(err));
    };
    return (
      <div
        className="sidebarChat"
        onClick={type !== "search" ? gotoChat : addNewChat}
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

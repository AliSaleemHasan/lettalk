import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SidebarChat.css";
import requests from "../handleRequests.js";
import { Selector as userSelector } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../SocketProvider.js";
import { useParams } from "react-router-dom";
import { addChat, Selector as chatsSelector } from "../features/chatsSlice";
import Avatar from "@material-ui/core/Avatar";
const SidebarChat = React.memo(
  ({ otherUser, id, count, type, lastMessage, isTyping, index }) => {
    const params = useParams();
    const history = useHistory();
    const [socket] = useSocket();
    const [error, setError] = useState("");
    const chats = useSelector(chatsSelector);
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const gotoChat = () => {
      history.push(`/chat/${id}/${index}`);
    };

    const addNewChat = async (e) => {
      e.preventDefault();

      if (!socket) {
        return;
      }

      const otherUserChatPassword = prompt(
        "please enter other user chat password"
      );
      if (!otherUserChatPassword) return;

      requests
        .addChatToDB(
          user._id,
          otherUser._id,
          chats?.length,
          otherUserChatPassword
        )
        .then((data) => {
          console.log(data);
          if (data.success) {
            let room = data.chat;
            room.user1 = user;
            room.user2 = otherUser;
            console.log(room);
            dispatch(addChat(room));

            socket.emit("addingChatWarning", otherUser._id, room);
          } else {
            setError(data.error);
          }
        })
        .catch((err) => console.log(err));
    };

    return (
      <div
        className="sidebarChat"
        onClick={type !== "search" ? gotoChat : addNewChat}
      >
        <div className="sidebarChat__left">
          <Avatar alt="user image" src={otherUser?.image}>
            {!otherUser.image &&
              otherUser?.username &&
              otherUser?.username[0]?.toUpperCase()}
          </Avatar>
        </div>
        <div className="sidebarChat__right">
          <div className="sidebarChat__info">
            <p className="sidebarChat__name">{otherUser.username}</p>
            {type !== "search" && count && (
              <p className="sidebarChat__count">{count}</p>
            )}
          </div>
          {type === "search" ? (
            <p className="sidebarChat__lastmessage">{otherUser.email}</p>
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

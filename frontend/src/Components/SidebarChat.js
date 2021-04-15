import { Avatar } from "@material-ui/core";
import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./SidebarChat.css";
import requests from "../handleRequests.js";
import { Selector as chatSelector, setChat } from "../features/chatSlice";
import { Selector as userSelector } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
function SidebarChat({ user2, id, name, count, image, email, type }) {
  const history = useHistory();
  const render = useRef(0);
  const [error, setError] = useState("");
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const gotoChat = (e) => {
    e.preventDefault();
    dispatch(
      setChat({
        user1: user,
        user2,
      })
    );
    history.push(`/chat/${id}`);
  };
  const addChat = async (e) => {
    e.preventDefault();
    requests
      .addChat(user._id, user2)
      .then((data) => {
        if (data.success) return history.push(`/chat/${data.chatId}`);
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
        <Avatar src={image} />
      </div>
      <div className="sidebarChat__right">
        <div className="sidebarChat__info">
          <p className="sidebarChat__name">{name}</p>
          {type !== "search" && <p className="sidebarChat__count">{count}</p>}
        </div>
        {type === "search" ? (
          <p className="sidebarChat__lastmessage">{email}</p>
        ) : (
          <p className="sidebarChat__lastmessage">Last Message</p>
        )}

        <p className="error">{error}</p>
      </div>
    </div>
  );
}

export default SidebarChat;

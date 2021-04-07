import { Avatar } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import "./SidebarChat.css";
import { useStateValue } from "../StateProvider.js";
import { ActionTypes } from "../reducer";
function SidebarChat({ user2, id, name, count, image, bio }) {
  const history = useHistory();
  const [{ user, chat }, dispatch] = useStateValue();
  const gotoChat = (e) => {
    e.preventDefault();
    console.log(id);
    dispatch({
      type: ActionTypes.SET_CHAT,
      chat: {
        user1: user,
        user2,
      },
    });
    history.push(`/chat/${id}`);
  };
  const addChat = async (e) => {
    e.preventDefault();
    await fetch(`/chats/user/${user._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user2 }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };
  return (
    <div className="sidebarChat" onClick={!bio ? gotoChat : addChat}>
      <div className="sidebarChat__left">
        <Avatar src={image} />
      </div>
      <div className="sidebarChat__right">
        <div className="sidebarChat__info">
          <p className="sidebarChat__name">{name}</p>
          {!bio && <p className="sidebarChat__count">{count}</p>}
        </div>
        <p className="sidebarChat__lastmessage">
          {chat?.messages[chat.messages.length - 1]}
        </p>
        <p className="sidebarChat__lastmessage">{bio}</p>
      </div>
    </div>
  );
}

export default SidebarChat;

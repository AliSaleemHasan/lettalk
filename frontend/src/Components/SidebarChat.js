import { Avatar } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import "./SidebarChat.css";
import { Selector as chatSelector, setChat } from "../features/chatSlice";
import { Selector as userSelector } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
function SidebarChat({ user2, id, name, count, image, bio }) {
  const history = useHistory();
  const chat = useSelector(chatSelector);
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
        <p className="sidebarChat__lastmessage">Last Message</p>
        <p className="sidebarChat__lastmessage">{bio}</p>
      </div>
    </div>
  );
}

export default SidebarChat;

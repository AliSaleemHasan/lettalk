import { Avatar } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import "./SidebarChat.css";
function SidebarChat({ name, lastmessage, count, image, bio }) {
  const history = useHistory();
  const gotoChat = (e) => {
    e.preventDefault();
    history.push("/chat/ali");
  };
  return (
    <div className="sidebarChat" onClick={gotoChat}>
      <div className="sidebarChat__left">
        <Avatar src={image} />
      </div>
      <div className="sidebarChat__right">
        <div className="sidebarChat__info">
          <p className="sidebarChat__name">{name}</p>
          {!bio && <p className="sidebarChat__count">{count}</p>}
        </div>
        <p className="sidebarChat__lastmessage">{lastmessage}</p>
        <p className="sidebarChat__lastmessage">{bio}</p>
      </div>
    </div>
  );
}

export default SidebarChat;

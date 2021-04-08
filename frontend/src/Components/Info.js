import React from "react";
import "./Info.css";
import Avatar from "@material-ui/core/Avatar";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Person from "@material-ui/icons/Person";
import Email from "@material-ui/icons/Email";
import { Info as Inf } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Selector } from "../features/chatSlice";
import { useSelector } from "react-redux";
function Info() {
  const history = useHistory();
  const chat = useSelector(Selector);
  const returntoChat = (e) => {
    e.preventDefault();
    history.push(`/chat/${chat._id}`);
  };
  return (
    <div className="info">
      <div className="info__top">
        <h3>{chat.user2.username}'s Info</h3>
      </div>
      <div className="info__middle">
        <Avatar src={chat.user2.image} />
      </div>

      <div className="info__bottom">
        <div className="info__">
          <Person />
          <p>{chat.user2.username}</p>
        </div>

        <div className="info__">
          <Email />
          <p>{chat.user2.email}</p>
        </div>

        <div className="info__">
          <Inf />
          <p>{chat.user2.bio} </p>
        </div>
      </div>

      <IconButton onClick={returntoChat}>
        <ArrowBack />
      </IconButton>
    </div>
  );
}

export default Info;

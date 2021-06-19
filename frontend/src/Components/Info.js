import React, { useEffect, useState } from "react";
import "./Info.css";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Person from "@material-ui/icons/Person";
import Email from "@material-ui/icons/Email";
import { Info as Inf } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { Selector as userSelector } from "../features/userSlice";
import { Selector as chatsSelector } from "../features/chatsSlice";
import { useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
function Info() {
  const history = useHistory();
  const params = useParams();
  const chats = useSelector(chatsSelector);
  const [otherUser, setOtherUser] = useState(null);
  const user = useSelector(userSelector);

  useEffect(() => {
    if (chats[params.index] && user)
      user?._id === chats[params.index]?.user1?._id
        ? setOtherUser(chats[params.index].user2)
        : setOtherUser(chats[params.index].user1);
  }, []);
  const returntoChat = (e) => {
    e.preventDefault();
    history.push(`/chat/${chats[params.index]._id}/${params.index}`);
  };
  return (
    <div className="info">
      <div className="info__top">
        <h3>{otherUser?.username}'s Info</h3>
      </div>
      <div className="info__middle">
        <Avatar src={otherUser?.image} />
      </div>

      <div className="info__bottom">
        <div className="info__">
          <Person />
          <p>{otherUser?.username}</p>
        </div>

        <div className="info__">
          <Email />
          <p>{otherUser?.email}</p>
        </div>

        <div className="info__">
          <Inf />
          <p>{otherUser?.bio} </p>
        </div>
      </div>

      <IconButton onClick={returntoChat}>
        <ArrowBack />
      </IconButton>
    </div>
  );
}

export default Info;

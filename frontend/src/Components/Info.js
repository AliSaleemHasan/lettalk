import React, { useEffect, useState } from "react";
import "./Info.css";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Person from "@material-ui/icons/Person";
import Email from "@material-ui/icons/Email";
import { Info as Inf } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { Selector as userSelector } from "../features/userSlice";
import { Selector as chatSelector } from "../features/chatSlice";
import { useSelector } from "react-redux";
import { LoadableAvatar } from "../loadable";
function Info() {
  const history = useHistory();
  const params = useParams();

  const chat = useSelector(chatSelector);
  const [otherUser, setOtherUser] = useState(null);
  const user = useSelector(userSelector);

  useEffect(() => {
    if (chat && user)
      user?._id === chat?.user1?._id
        ? setOtherUser(chat.user2)
        : setOtherUser(chat.user1);
  }, []);
  const returntoChat = (e) => {
    e.preventDefault();
    history.push(`/chat/${chat._id}/${params.index}`);
  };
  return (
    <div className="info">
      <div className="info__top">
        <h3>{otherUser?.username}'s Info</h3>
      </div>
      <div className="info__middle">
        <LoadableAvatar src={otherUser?.image} />
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

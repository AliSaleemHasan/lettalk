import React from "react";
import "./Info.css";
import Avatar from "@material-ui/core/Avatar";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Person from "@material-ui/icons/Person";
import Email from "@material-ui/icons/Email";
import { Info as Inf } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
function Info() {
  const history = useHistory();
  const returntoChat = (e) => {
    e.preventDefault();
    console.log("fucking test");
    history.push("/chat/ali");
  };
  return (
    <div className="info">
      <div className="info__top">
        <h3>Chat Info</h3>
      </div>
      <div className="info__middle">
        <Avatar />
      </div>

      <div className="info__bottom">
        <div className="info__">
          <Person />
          <p>username</p>
        </div>

        <div className="info__">
          <Email />
          <p>ali1salem1hasan@gmail.com</p>
        </div>

        <div className="info__">
          <Inf />
          <p>hey my name is Aaowifej </p>
        </div>
      </div>

      <IconButton onClick={returntoChat}>
        <ArrowBack />
      </IconButton>
    </div>
  );
}

export default Info;

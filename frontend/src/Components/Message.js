import React from "react";
import "./Message.css";
import Avatar from "@material-ui/core/Avatar";
const Message = React.memo(({ content, timestamp, is_sender, image, type }) => {
  return (
    <div className={`message ${is_sender ? "message__r" : ""}`}>
      <div className="message__left">
        <Avatar
          alt="user image"
          src={image ? image : "/defaults/chaty.png"}
          width="30"
          height="30"
        ></Avatar>
      </div>
      <div className="message__right">
        <p className="message__content">
          {type && "** "}
          {content}
        </p>
        <div className="test">
          <p className="message__timestamp">{timestamp}</p>
        </div>
      </div>
    </div>
  );
});
export default Message;

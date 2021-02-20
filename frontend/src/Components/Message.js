import React from "react";
import "./Message.css";
import Avatar from "@material-ui/core/Avatar";
function Message({ content, timestamp, is_sender }) {
  return (
    <div className={`message ${!is_sender ? "message__r" : ""}`}>
      <div className="message__left">
        <Avatar />
      </div>
      <div className="message__right">
        <p className="message__content">{content}</p>
        <div className="test">
          <p className="message__timestamp">{timestamp}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;

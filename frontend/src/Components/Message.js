import React from "react";
import "./Message.css";
import { LoadableAvatar } from "../loadable";
const Message = React.memo(({ content, timestamp, is_sender, image, type }) => {
  return (
    <div className={`message ${is_sender ? "message__r" : ""}`}>
      <div className="message__left">
        <LoadableAvatar
          alt="user image"
          src={image ? image : "/defaults/Chaty.png"}
          width="75"
          height="75"
        ></LoadableAvatar>
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

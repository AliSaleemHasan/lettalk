import React, { useState } from "react";
import "./Chat.css";
import Message from "./Message.js";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import AttachFile from "@material-ui/icons/AttachFile";
import EmojiEmotions from "@material-ui/icons/EmojiEmotions";
import Send from "@material-ui/icons/Send";
import useWidth from "./useWidth";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import Picker from "emoji-picker-react";
import { Icon } from "@material-ui/core";
import Info from "./Info";
function Chat() {
  const width = useWidth();
  const history = useHistory();
  const [input, setInput] = useState("");
  const [toggleEmoji, setToggleEmoji] = useState(false);
  const gotoSidebar = (e) => {
    e.preventDefault();
    history.push("/");
  };
  const onEmojiClick = (e, emoji) => {
    e.preventDefault();
    setInput(input + emoji.emoji);
  };

  const gotoInfo = (e) => {
    e.preventDefault();
    history.push("/chat/ali/info");
  };

  const pickerStyle = {
    color: "#2b3238",
    width: "100%",
  };
  return (
    <div className="chat">
      <div className="chat__header">
        <div className="header__left">
          {width < 786 ? (
            <div>
              <IconButton color="primary" onClick={gotoSidebar}>
                <ArrowBack />
              </IconButton>
            </div>
          ) : (
            ""
          )}
          <p className="chat__headerName" onClick={gotoInfo}>
            Ali
          </p>
          <div className="chat__headerStatus">
            <p className="chat__status"></p>
            <p className="status">online</p>
          </div>
        </div>
        <div className="header__right">
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <Search />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        <Message content="Hello" timestamp="10:45aidhawam" is_sender={true} />
        <Message
          content="Hey ..how are you"
          timestamp="10:am"
          is_sender={false}
        />

        <Message
          content="fine and you!"
          timestamp="10:45aidhawam"
          is_sender={true}
        />
      </div>
      <div className="chat__footer">
        <IconButton
          color={toggleEmoji ? "primary" : ""}
          onClick={(e) => setToggleEmoji(!toggleEmoji)}
        >
          <EmojiEmotions />
        </IconButton>
        <form action="">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type something to send.."
          />
          <IconButton>
            <Send />
          </IconButton>
        </form>
      </div>
      {toggleEmoji ? (
        <Picker
          className="chat__emoji"
          onEmojiClick={onEmojiClick}
          disableSearchBar={true}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Chat;

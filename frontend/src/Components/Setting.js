import React, { useState, useRef } from "react";
import "./Setting.css";
import { Selector, setUser } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Person from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Info as Inf } from "@material-ui/icons";
import Email from "@material-ui/icons/Email";
import requests from "../handleRequests";
import Security from "@material-ui/icons/Security";
import { LoadableAppSetting, LoadableAvatar } from "../loadable";
const Settings = React.memo(({ setToggleSettings }) => {
  const user = useSelector(Selector);
  const [showInput, setshowInput] = useState(false);
  const newImageUrl = useRef();
  const dispatch = useDispatch();

  const UploadImage = async (e) => {
    e.preventDefault();

    if (newImageUrl.current.value) {
      requests
        .uploadImage(user._id, newImageUrl.current.value)
        .then((data) => dispatch(setUser(data.user)))
        .catch((err) => console.log(err));
    }
    setshowInput(false);
  };

  const returntoChat = (e) => {
    e.preventDefault();
    setToggleSettings(false);
  };
  return (
    <div className="settings">
      <div className="settings__header">
        <h2>Info</h2>
      </div>

      <div className="settings__setImage">
        <form className="settings__image">
          <LoadableAvatar
            src={user?.image}
            onClick={() => setshowInput(!showInput)}
          >
            {!user.image && user.username[0]}
          </LoadableAvatar>

          {showInput && (
            <div className="settings__afterUpbload">
              <input
                type="text"
                name="file"
                ref={newImageUrl}
                className="upload__file"
                placeholder="Put image Url .."
              />
              <button onClick={UploadImage}>Save</button>
            </div>
          )}
        </form>
      </div>

      <div className="settings__settings">
        <LoadableAppSetting
          name={user.username}
          Icon={Person}
          settingName="username"
        />
        <LoadableAppSetting name={user.bio} Icon={Inf} settingName="bio" />
        <LoadableAppSetting
          name={user.chatPassword}
          Icon={Security}
          settingName="chat__password"
          type="email"
        />
        <LoadableAppSetting
          type="email"
          Icon={Email}
          name={user.email}
          settingName="email"
        />
      </div>

      <IconButton onClick={returntoChat}>
        <ExitToAppIcon />
      </IconButton>
    </div>
  );
});

export default Settings;

import React, { useState, useRef } from "react";
import "./Setting.css";
import { Avatar } from "@material-ui/core";
import { Selector, setUser } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import AppSetting from "./AppSetting.js";
import Person from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Info as Inf } from "@material-ui/icons";
import Email from "@material-ui/icons/Email";
import requests from "../handleRequests";

function Settings({ setToggleSettings }) {
  const user = useSelector(Selector);
  const [showInput, setshowInput] = useState(false);
  const newImageUrl = useRef();
  const dispatch = useDispatch();

  //upload user image..

  // const uploadImageOptions = () => {
  //   const fileInput = document.querySelector(".upload__file");
  //   const formData = new FormData();

  //   formData.append("file", fileInput.files[0]);
  //   const options = {
  //     method: "POST",
  //     Headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //     body: formData,
  //   };
  //   return options;
  // };

  const UploadImage = async (e) => {
    e.preventDefault();
    // const options = uploadImageOptions();

    if (newImageUrl.current.value) {
      requests
        .uploadImage(user._id, newImageUrl.current.value)
        .then((data) => dispatch(setUser(data.user)))
        .catch((err) => console.log(err));
    }
    setshowInput(false);
  };

  // const handleUploadImages = (e) => {
  //   e.preventDefault();
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     if (reader.readyState === 2) {
  //       setnewImage(reader.result);
  //       setSaveImage(true);
  //     }
  //   };

  //   reader.readAsDataURL(e.target.files[0]);

  // };

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
          <Avatar src={user?.image} onClick={() => setshowInput(!showInput)}>
            {!user.image && user.username[0]}
          </Avatar>

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
        <AppSetting name={user.username} Icon={Person} settingName="username" />
        <AppSetting name={user.bio} Icon={Inf} settingName="bio" />
        <AppSetting
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
}

export default Settings;

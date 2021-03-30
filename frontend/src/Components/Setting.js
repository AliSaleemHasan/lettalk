import React, { useState } from "react";
import "./Setting.css";
import { Avatar } from "@material-ui/core";
import { useStateValue } from "../StateProvider.js";
import AppSetting from "./AppSetting.js";
import Person from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

function Settings({ setToggleSettings }) {
  const [{ user }, dispatch] = useStateValue();
  const [newImage, setnewImage] = useState("");
  const [saveImage, setSaveImage] = useState(false);

  const uploadImageOptions = () => {
    const fileInput = document.querySelector(".upload__file");
    const formData = new FormData();

    formData.append("file", fileInput.files[0]);
    // console.log(formData);
    const options = {
      method: "POST",
      Headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    };
    return options;
  };

  const UploadImage = async (e) => {
    e.preventDefault();
    const options = uploadImageOptions();
    e.preventDefault();
    await fetch(`/users/upload/image/${user._id}`, options)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  const handleUploadImages = (e) => {
    e.preventDefault();
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setnewImage(reader.result);
        setSaveImage(true);
      }
    };
    console.log(e.target.files[0]);

    reader.readAsDataURL(e.target.files[0]);
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
          <label>
            <Avatar src={newImage ? newImage : user.image}>
              {!user.image && user.username[0]}
            </Avatar>

            <input
              type="file"
              name="file"
              className="upload__file"
              onChange={handleUploadImages}
              style={{ display: "none" }}
              accept="image/*"
            />
            {saveImage && (
              <div className="settings__afterUpbload">
                <button onClick={UploadImage}>Save</button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSaveImage(false);
                    setnewImage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </label>
        </form>
      </div>

      <div className="settings__settings">
        <AppSetting name={user.username} Icon={Person} settingName="username" />
        <AppSetting name={user.bio} Icon={Person} settingName="bio" />
        <AppSetting Icon={Person} name={user.email} settingName="email" />
      </div>

      <IconButton onClick={returntoChat}>
        <ExitToAppIcon />
      </IconButton>
    </div>
  );
}

export default Settings;

import React from "react";
import "./AppSetting.css";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import { Selector, setUser } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import requests from "../handleRequests.js";

function Settings({ type, name, Icon, settingName }) {
  const user = useSelector(Selector);
  const dispatch = useDispatch();

  //edit user information and save it to database
  const editInfo = () => {
    let updatedInfo = prompt(
      "Please edit bellow information or click cancle",
      name
    );
    if (updatedInfo) {
      const response = requests.editUserInfo(
        user._id,
        settingName,
        name,
        updatedInfo
      );
      response
        .then((newUser) => dispatch(setUser(newUser.user)))
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="appSetting">
      <div className="appSetting__left">
        <Icon />
      </div>
      <div className="appSetting__right">
        <div className="appSetting__rightnow">
          <p>{name}</p>
        </div>

        <div className="appSetting__rightname">
          <p>{settingName}</p>
        </div>
      </div>

      {type !== "email" && (
        <IconButton onClick={editInfo}>
          <Edit />
        </IconButton>
      )}
    </div>
  );
}

export default Settings;

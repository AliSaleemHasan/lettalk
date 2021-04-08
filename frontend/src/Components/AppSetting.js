import React from "react";
import "./AppSetting.css";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import { Selector } from "../features/userSlice";
import { useSelector } from "react-redux";
function Settings({ type, name, Icon, settingName }) {
  const user = useSelector(Selector);
  const editInfo = async () => {
    let info = prompt("Please edit bellow information or click cancle", name);
    const response = await fetch(
      `/users/info/${user._id}?${settingName}=${name}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ info }),
      }
    );
    response.json().catch((err) => console.log(err));
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
        <IconButton>
          <Edit onClick={editInfo} />
        </IconButton>
      )}
    </div>
  );
}

export default Settings;

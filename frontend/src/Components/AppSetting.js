import React from "react";
import "./AppSetting.css";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
function Settings({ name, Icon, settingName }) {
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
      <IconButton>
        <Edit />
      </IconButton>
    </div>
  );
}

export default Settings;

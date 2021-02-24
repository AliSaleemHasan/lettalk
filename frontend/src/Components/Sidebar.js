import React, { useState } from "react";
import "./Sidebar.css";
import Avatar from "@material-ui/core/Avatar";
import Chat from "@material-ui/icons/Chat";
import Settings from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Search from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import IconButton from "@material-ui/core/IconButton";
import AppSetting from "./AppSetting.js";

import Person from "@material-ui/icons/Person";
import { useStateValue } from "../StateProvider.js";
import { ActionTypes } from "../reducer";
function Sidebar() {
  const [{ user }, dispatch] = useStateValue();

  const logout = (e) => {
    e.preventDefault();
    dispatch({
      type: ActionTypes.SET_USER,
      user: null,
    });
  };
  const [toggleSettings, setToggleSettings] = useState(false);
  const gotoSettings = (e) => {
    e.preventDefault();
    console.log(user);
    setToggleSettings(true);
  };

  const returntoChat = (e) => {
    e.preventDefault();
    setToggleSettings(false);
  };

  return toggleSettings ? (
    <div className="settings">
      <div className="settings__header">
        <h2>Info</h2>
      </div>

      <div className="settings__setImage">
        <Avatar src={user.image} />
      </div>
      <div className="settings__settings">
        <AppSetting name={user.username} Icon={Person} settingName="Name" />
        <AppSetting name={user.bio} Icon={Person} settingName="Bio" />
        <AppSetting Icon={Person} settingName="Username" />
      </div>

      <IconButton onClick={returntoChat}>
        <ExitToAppIcon />
      </IconButton>
    </div>
  ) : (
    <div className="sidebar">
      <div className="sidebar__left">
        <div className="sidebar__leftAvatar">
          <Avatar src={user.image} />
        </div>
        <div className="sidebar__leftIcons">
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton onClick={gotoSettings}>
            <Settings />
          </IconButton>
        </div>

        <div className="sidebar__leftLogout">
          <IconButton onClick={logout}>
            <ExitToAppIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__right">
        <div className="sidebar__rightsearch">
          <form action="">
            <Search />
            <input type="text" placeholder="Search.." />
            <button type="submit"></button>
          </form>
        </div>

        <div className="sidebar__rightChats">
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
          <SidebarChat
            name="Ali"
            count={10}
            lastmessage="this is last message"
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

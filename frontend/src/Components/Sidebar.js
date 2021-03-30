import React, { useState } from "react";
import "./Sidebar.css";
import Avatar from "@material-ui/core/Avatar";
import Chat from "@material-ui/icons/Chat";
import Settings from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Search from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import IconButton from "@material-ui/core/IconButton";
import Setting from "./Setting.js";
import { useStateValue } from "../StateProvider.js";
import { ActionTypes } from "../reducer";
function Sidebar() {
  const [{ user }, dispatch] = useStateValue();
  const [toggleSettings, setToggleSettings] = useState(false);

  const serverLogout = async () => {
    await fetch("/users?logout=true", {
      method: "GET",
    }).then((response) => console.log(response));
  };
  const logout = (e) => {
    e.preventDefault();
    if (user.state.Oauth) {
      serverLogout();
    }
    dispatch({
      type: ActionTypes.SET_USER,
      user: null,
    });
  };
  const gotoSettings = (e) => {
    e.preventDefault();
    console.log(user);
    setToggleSettings(true);
  };

  return toggleSettings ? (
    <div className="settings">
      <Setting setToggleSettings={setToggleSettings} />
    </div>
  ) : (
    <div className="sidebar">
      <div className="sidebar__left">
        <div className="sidebar__leftAvatar">
          <Avatar src={user.image}>
            {!user.image && user.username[0].toUpperCase()}
          </Avatar>
        </div>
        <div className="sidebar__leftIcons">
          <IconButton>
            <Chat style={{ color: "#3f51b5" }} />
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

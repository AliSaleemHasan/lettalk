import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import Avatar from "@material-ui/core/Avatar";
import Chat from "@material-ui/icons/Chat";
import Settings from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Search from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import IconButton from "@material-ui/core/IconButton";
import Setting from "./Setting.js";
import { setUser, Selector } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";

import Close from "@material-ui/icons/Close";
function Sidebar() {
  const user = useSelector(Selector);
  const dispatch = useDispatch();
  const [toggleSettings, setToggleSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const serverLogout = async () => {
    await fetch("/users?logout=true", {
      method: "GET",
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };
  const logout = (e) => {
    e.preventDefault();
    if (user.state.Oauth) {
      serverLogout();
    }
    dispatch(setUser(null));
  };
  const gotoSettings = (e) => {
    e.preventDefault();
    setToggleSettings(true);
  };

  const searchForUsers = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    await fetch("/users/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchQuery }),
    })
      .then((response) => response.json())
      .then((data) => setSearchedUsers(data))
      .catch((err) => console.log(err));
  };

  useEffect(async () => {
    await fetch(`/chats/user/${user._id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setUserList(data.chats))
      .catch((err) => console.log(err));
  }, []);
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
          <form onSubmit={searchForUsers} action="">
            <Search />
            <input
              value={searchQuery}
              type="text"
              placeholder="Search.."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"></button>
          </form>
          {isSearching && <Close onClick={() => setIsSearching(false)} />}
        </div>

        <div className="sidebar__rightChats">
          {isSearching
            ? searchedUsers?.map((resultUser) => (
                <SidebarChat
                  key={resultUser._id}
                  name={resultUser.username}
                  bio={resultUser.bio}
                  user2={resultUser._id}
                />
              ))
            : userList.map((chat) => {
                if (chat.user1._id !== user._id)
                  return (
                    <SidebarChat
                      id={chat._id}
                      image={chat.user1.image}
                      key={chat.user1._id}
                      name={chat.user1.username}
                    />
                  );
                else
                  return (
                    <SidebarChat
                      id={chat._id}
                      image={chat.user2.image}
                      key={chat._id}
                      name={chat.user2.username}
                    />
                  );
              })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

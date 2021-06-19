import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import Chat from "@material-ui/icons/Chat";
import Settings from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Search from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import IconButton from "@material-ui/core/IconButton";
import { setUser, Selector as userSelector } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import requests from "../handleRequests.js";
import Close from "@material-ui/icons/Close";
import { useSocket } from "../SocketProvider.js";
import { useHistory } from "react-router-dom";
import {
  addChat,
  setChats,
  Selector as chatsSelector,
} from "../features/chatsSlice";
import Avatar from "@material-ui/core/Avatar";
import { LoadableSetting } from "../loadable";
function Sidebar() {
  const [socket] = useSocket();
  const user = useSelector(userSelector);
  const chats = useSelector(chatsSelector);
  const dispatch = useDispatch();
  const history = useHistory();
  const [toggleSettings, setToggleSettings] = useState(false);
  const searchQuery = useRef("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const serverLogout = () => {
    requests.logout().catch((err) => console.log(err));
  };
  const logout = (e) => {
    e.preventDefault();
    history.push("/");
    serverLogout();
    dispatch(setUser(null));
  };
  const gotoSettings = (e) => {
    e.preventDefault();
    setToggleSettings(true);
  };

  const searchForUsers = (e) => {
    e.preventDefault();
    setIsSearching(true);

    requests
      .searchForUsers(searchQuery.current.value)
      .then((data) => {
        setSearchedUsers(data);
      })
      .catch((err) => console.log(err));
  };

  // useEffect(() => {
  //   if (socket == null) return;
  //   const setReceivedMessage = (message, index) => {
  //     const chats = [...userList];
  //     chats[index].messages[0] = message;
  //     setUserList(chats);
  //   };
  //   socket.on("recive__message", setReceivedMessage);

  //   return () => socket.off("recive__message", setReceivedMessage);
  // }, [socket, userList]);

  //to get room when ever other person add it to its chat!

  // useEffect(() => {
  //   if (!socket) return;

  //   let addRoomFunction = (room) => {
  //     // setUserList([...userList, room]);
  //     console.log("lestining to add room ");
  //     dispatch(addChat(room));
  //   };
  //   socket.on("accept__addRoom", addRoomFunction);

  //   return () => socket.off("accept_addRoom", addRoomFunction);
  // }, [socket]);

  useEffect(() => {
    requests
      .getAllChats(user._id)
      .then((data) => {
        if (data.chats) {
          dispatch(setChats(data.chats));
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return toggleSettings ? (
    <div className="settings">
      <LoadableSetting setToggleSettings={setToggleSettings} />
    </div>
  ) : (
    <div className="sidebar">
      <div className="sidebar__left">
        <div className="sidebar__leftAvatar">
          <Avatar src={user?.image}>
            {!user?.image && user?.username[0]?.toUpperCase()}
          </Avatar>
        </div>
        <div className="sidebar__leftIcons">
          <IconButton aria-label="chats-button">
            <Chat style={{ color: "#3f51b5" }} />
          </IconButton>
          <IconButton aria-label="Setting-button" onClick={gotoSettings}>
            <Settings />
          </IconButton>
        </div>

        <div className="sidebar__leftLogout">
          <IconButton aria-label="exit-button" onClick={logout}>
            <ExitToAppIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__right">
        <div className="sidebar__rightsearch">
          <form onSubmit={searchForUsers} action="">
            <Search />
            <input ref={searchQuery} type="text" placeholder="Search.." />
            <button type="submit"></button>
          </form>
          {isSearching && <Close onClick={() => setIsSearching(false)} />}
        </div>

        <div className="sidebar__rightChats">
          {isSearching
            ? searchedUsers?.map((resultUser) => (
                <SidebarChat
                  index={chats?.length || 0}
                  key={resultUser._id}
                  type="search"
                  otherUser={resultUser}
                />
              ))
            : chats?.map((chat, index) => {
                if (chat.user1._id !== user._id)
                  return (
                    <SidebarChat
                      index={index}
                      key={chat._id}
                      count={chat.numOfUnseened}
                      id={chat._id}
                      lastMessage={
                        chat?.messages[chat?.messages.length - 1] || "."
                      }
                      otherUser={chat?.user1}
                    />
                  );
                else
                  return (
                    <SidebarChat
                      index={index}
                      key={chat._id}
                      count={chat.numOfUnseened}
                      lastMessage={chat?.messages[0] || "."}
                      id={chat?._id}
                      otherUser={chat?.user2}
                    />
                  );
              })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

import React, { useState, useEffect, useRef } from "react";
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
import requests from "../handleRequests.js";
import Close from "@material-ui/icons/Close";
import { useSocket } from "../SocketProvider.js";
function Sidebar() {
  console.log("sidebar render");
  const [socket] = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const user = useSelector(Selector);
  const dispatch = useDispatch();
  const [toggleSettings, setToggleSettings] = useState(false);
  const searchQuery = useRef("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const serverLogout = () => {
    requests.logout().catch((err) => console.log(err));
  };
  const logout = (e) => {
    e.preventDefault();
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
        // console.log(data);
        setSearchedUsers(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (socket == null) return;
    const setReceivedMessage = (message, index) => {
      const chats = userList;
      chats[index].messages[0] = message;
      setUserList(chats);
    };
    socket.on("recive__message", setReceivedMessage);

    return () => socket.off("recive__message", setReceivedMessage);
  }, [socket, userList]);

  //to get room when ever other person add it to its chat!

  useEffect(() => {
    if (socket == null) return;
    socket.on("is__typing", () => {
      setIsTyping(true);
    });

    return () => socket.off("is__typing");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("isNot__typing", () => {
      setIsTyping(false);
    });

    return () => socket.off("isNot__typing");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.once("accept__addRoom", (room) => {
      setUserList([...userList, room]);
    });

    return () => socket.off("accept_addRoom");
  }, [socket, userList]);

  useEffect(() => {
    requests
      .getAllChats(user._id)
      .then((data) => {
        console.log(data.chats);
        setUserList(data.chats);
      })
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
          <Avatar src={user?.image}>
            {!user?.image && user?.username[0]?.toUpperCase()}
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
            <input ref={searchQuery} type="text" placeholder="Search.." />
            <button type="submit"></button>
          </form>
          {isSearching && <Close onClick={() => setIsSearching(false)} />}
        </div>

        <div className="sidebar__rightChats">
          {isSearching
            ? searchedUsers?.map((resultUser) => (
                <SidebarChat
                  index={userList.length}
                  key={resultUser._id}
                  name={resultUser.username}
                  email={resultUser.email}
                  type="search"
                  image={resultUser.image}
                  user2={resultUser._id}
                />
              ))
            : userList.map((chat, index) => {
                if (chat.user1._id !== user._id)
                  return (
                    <SidebarChat
                      index={index}
                      count={chat.numOfUnseened}
                      id={chat._id}
                      lastMessage={chat?.messages[0] || "_"}
                      image={chat.user1.image}
                      key={chat._id}
                      name={chat.user1.username}
                      isTyping={isTyping}
                    />
                  );
                else
                  return (
                    <SidebarChat
                      index={index}
                      count={chat.numOfUnseened}
                      lastMessage={chat?.messages[0] || "_"}
                      id={chat._id}
                      image={chat.user2.image}
                      key={chat._id}
                      name={chat.user2.username}
                      isTyping={isTyping}
                    />
                  );
              })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

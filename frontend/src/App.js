import "./App.css";
import Media from "react-media";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Selector as userSelector, setUser } from "./features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import requests from "./handleRequests";
import { io } from "socket.io-client";
import {
  setMessage,
  editMessage,
  addChat,
  Selector as chatsSelector,
} from "./features/chatsSlice";
import { useSocket } from "./SocketProvider.js";

import {
  LoadableInfo,
  LoadableChat,
  LoadableSidebar,
  LoadableLogin,
} from "./loadable";

function App() {
  const [socket, setSocket] = useSocket();
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const chats = useSelector(chatsSelector);

  useEffect(() => {
    let newSocket;

    if (!user) {
      requests
        .getUser()
        .then((data) => {
          dispatch(setUser(data.user));
        })
        .catch((err) => console.log(err));
    } else {
      newSocket = io("/", { query: { id: user._id } });
      setSocket(newSocket);
    }

    return () => socket?.close();
  }, [user]);

  useEffect(() => {
    if (socket == null) return;

    const setEditedMessage = (message, index, chatIndex, type) => {
      dispatch(editMessage({ type, chatIndex, message, index }));
    };
    socket.on("recive__editedMessage", setEditedMessage);

    return () => socket.off("recive__editedMessage", setEditedMessage);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const addRoomFun = (room) => {
      dispatch(addChat(room));
    };
    socket.on("addRoom", addRoomFun);

    return () => socket.off("AddRoom", addRoomFun);
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;

    const setReceivedMessage = (message, chatIndex) => {
      console.log(chatIndex);
      dispatch(setMessage({ chatIndex, message }));
    };
    socket.on("recive__message", setReceivedMessage);

    return () => socket.off("recive__message", setReceivedMessage);
  }, [socket]);
  useEffect(() => {
    if (!socket || !user) return;

    const acceptRequeset = (otherUser, FirstUserChatIndex) => {
      console.log("fuck");
      requests
        .addChatToDB(otherUser._id, user._id, FirstUserChatIndex, chats?.length)
        .then((data) => {
          console.log(data);
          if (data.success) {
            let room = data.chat;
            room.user1 = otherUser;
            room.user2 = user;
            console.log(room);
            dispatch(addChat(room));

            socket.emit("addingChatWarning", otherUser._id, room);
          }
        })
        .catch((err) => console.log(err));
    };
    socket.on("requestAccepted", acceptRequeset);

    return () => socket.off("requestAccepted", acceptRequeset);
  }, [socket, user]);

  return (
    <Media
      queries={{
        small: "(max-width:786)",
        medium: "(min-width: 787px) and (max-width: 1000px)",
        large: "(min-width:1001px)",
      }}
    >
      {(matches) =>
        !user ? (
          <LoadableLogin />
        ) : matches.large ? (
          <div className="app">
            <Router>
              <LoadableSidebar />
              <Route exact path="/chat/:chatId/:index">
                <LoadableChat />{" "}
              </Route>
              <Route exact path="/chat/:chatId/:index/info">
                <LoadableChat />
                <LoadableInfo />
              </Route>
            </Router>
          </div>
        ) : matches.medium ? (
          <div className="app">
            <Router>
              <LoadableSidebar />{" "}
              <Route exact path="/chat/:chatId/:index">
                <LoadableChat />{" "}
              </Route>
              <Route exact path="/chat/:chatId/:index/info">
                <LoadableInfo />
              </Route>
            </Router>
          </div>
        ) : (
          <div className="app">
            <Router>
              <Switch>
                <Route exact path="/chat/:chatId/:index">
                  <LoadableChat />
                </Route>
                <Route exact path="/chat/:chatId/:index/info">
                  <LoadableInfo />
                </Route>
                <Route exact path="/">
                  <LoadableSidebar />{" "}
                </Route>
              </Switch>
            </Router>
          </div>
        )
      }
    </Media>
  );
}

export default App;

import "./App.css";
import Media from "react-media";
import { useState, useCallback, useEffect } from "react";
import Chat from "./Components/Chat";
import Sidebar from "./Components/Sidebar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Info from "./Components/Info.js";
import Login from "./Components/Login.js";
import { Selector as userSelector, setUser } from "./features/userSlice";
import { Selector as chatsSelector, setChat } from "./features/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import requests from "./handleRequests";
import { io } from "socket.io-client";
import { useSocket } from "./SocketProvider.js";
function App() {
  console.log("app render ");
  const [socket, setSocket] = useSocket();
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

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

  return (
    <div>
      <Media
        queries={{
          small: "(max-width:786)",
          medium: "(min-width: 787px) and (max-width: 1000px)",
          large: "(min-width:1001px)",
        }}
      >
        {(matches) =>
          !user ? (
            <Login />
          ) : matches.large ? (
            <div className="app">
              <Router>
                <Sidebar />
                <Route exact path="/chat/:chatId/:index">
                  <Chat />
                </Route>
                <Route exact path="/chat/:chatId/:index/info">
                  <Chat />
                  <Info />
                </Route>
              </Router>
            </div>
          ) : matches.medium ? (
            <div className="app">
              <Router>
                <Sidebar />
                <Route exact path="/chat/:chatId/:index">
                  <Chat />
                </Route>
                <Route exact path="/chat/:chatId/:index/info">
                  <Info />
                </Route>
              </Router>
            </div>
          ) : (
            <div className="app">
              <Router>
                <Switch>
                  <Route exact path="/chat/:chatId/:index">
                    <Chat />
                  </Route>
                  <Route exact path="/chat/:chatId/:index/info">
                    <Info />
                  </Route>
                  <Route exact path="/">
                    <Sidebar />
                  </Route>
                </Switch>
              </Router>
            </div>
          )
        }
      </Media>
    </div>
  );
}

export default App;

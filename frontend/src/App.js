import "./App.css";
import Media from "react-media";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Selector as userSelector, setUser } from "./features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import requests from "./handleRequests";
import { io } from "socket.io-client";
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

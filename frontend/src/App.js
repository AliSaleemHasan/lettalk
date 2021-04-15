import "./App.css";
import { useEffect } from "react";
import Chat from "./Components/Chat";
import Sidebar from "./Components/Sidebar";
import useWidth from "./Components/useWidth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Info from "./Components/Info.js";
import Login from "./Components/Login.js";
import { Selector as userSelector, setUser } from "./features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { Selector as socketSelector, setSocket } from "./features/socketSlice";
import requests from "./handleRequests";
import { io } from "socket.io-client";
function App() {
  const user = useSelector(userSelector);
  const width = useWidth();
  const socket = useSelector(socketSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      requests.getUser().then((user) => {
        dispatch(setUser(user.user));
      });
    }
  }, []);

  useEffect(() => {
    let socket;
    if (!user) dispatch(setSocket(null));
    else {
      socket = io({ query: { id: user._id } });
      dispatch(setSocket(socket));
    }
    return () => socket?.close();
  }, [user]);
  return width > 786 ? (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <Router>
          <Sidebar />
          <Route exact path="/chat/:chatId">
            <Chat />
          </Route>
          {width < 1000 ? (
            <Route path="/chat/:chatId/info">
              <Info />
            </Route>
          ) : (
            <Route path="/chat/:chatId/info">
              <Chat />
              <Info />
            </Route>
          )}
        </Router>
      )}
      {/* Sidebar */}
      {/* sidebar__left */}
      {/* sidebar__right */}
      {/* sidebar__header */}
      {/* sidebar__chats */}

      {/* chat */}
      {/* chat__header */}
      {/* chat__body */}
      {/* chat__footer */}
      {/* info */}
    </div>
  ) : (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <Router>
          <Switch>
            <Route exact path="/chat/:chatId">
              <Chat />
            </Route>
            <Route path="/chat/:chatId/info">
              <Info />
            </Route>
            <Route exact path="/">
              <Sidebar />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;

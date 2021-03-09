import "./App.css";
import { useState, useEffect } from "react";
import Chat from "./Components/Chat";
import Sidebar from "./Components/Sidebar";
import useWidth from "./Components/useWidth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Info from "./Components/Info.js";
import Login from "./Components/Login.js";
import { useStateValue } from "./StateProvider.js";
import { ActionTypes } from "./reducer";

function App() {
  const width = useWidth();
  const [{ user }, dispatch] = useStateValue();
  useEffect(async () => {
    if (!user) {
      await fetch("/users", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((user) => {
          console.log(user);

          dispatch({
            type: ActionTypes.SET_USER,
            user: user.user,
          });
        });
    }
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

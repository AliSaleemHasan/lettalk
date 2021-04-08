import "./App.css";
import { useEffect } from "react";
import Chat from "./Components/Chat";
import Sidebar from "./Components/Sidebar";
import useWidth from "./Components/useWidth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Info from "./Components/Info.js";
import Login from "./Components/Login.js";
import { Selector, setUser } from "./features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import requests from "./handleRequests";
function App() {
  const width = useWidth();
  const user = useSelector(Selector);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      requests.getUser().then((user) => {
        dispatch(setUser(user.user));
      });
    }
  }, []);
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

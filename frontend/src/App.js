import "./App.css";
import Media from "react-media";
import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Selector as userSelector, setUser } from "./features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import requests from "./handleRequests";
import { io } from "socket.io-client";
import { useSocket } from "./SocketProvider.js";
const Chat = lazy(() => import("./Components/Chat"));
const Sidebar = lazy(() => import("./Components/Sidebar"));
const Info = lazy(() => import("./Components/Info.js"));
const Login = lazy(() => import("./Components/Login.js"));

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
    <Suspense fallback={<h1>...loading</h1>}>
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
    </Suspense>
  );
}

export default App;

import loadable from "react-loadable";

const Loading = ({ error, timeOut, retry }) => {
  if (error)
    return (
      <div className="page__center">
        <h1>Error : {error}</h1>
        <button onClick={retry}>relaod </button>
      </div>
    );
  else if (timeOut)
    return (
      <div className="page__center">
        <h1>Taking a long Time ...</h1>
        <button onClick={retry}>relaod </button>
      </div>
    );
  else
    return (
      <div className="page__center">
        <h1>Loading...</h1>
      </div>
    );
};

export const LoadableAvatar = loadable({
  loader: () => import("@material-ui/core/Avatar"),
  loading: Loading,
  timeout: 10000,
});

export const LoadableLogin = loadable({
  loader: () => import(/* webpackChunkName: "Login" */ "./Components/Login"),
  loading: Loading,
  timeout: 10000,
});
export const LoadableSidebar = loadable({
  loader: () =>
    import(/* webpackChunkName: "sidebar" */ "./Components/Sidebar"),
  loading: Loading,
  timeout: 10000,
});

export const LoadableSetting = loadable({
  loader: () =>
    import(/* webpackChunkName: "settings" */ "./Components/Setting"),
  loading: Loading,
  timeout: 10000,
});

export const LoadableChat = loadable({
  loader: () => import(/* webpackChunkName: "chat" */ "./Components/Chat"),
  loading: Loading,
  timeout: 10000,
});

export const LoadableInfo = loadable({
  loader: () => import(/* webpackChunkName: "info" */ "./Components/Info"),
  loading: Loading,
  timeout: 10000,
});

export const LoadableAppSetting = loadable({
  loader: () => import("./Components/AppSetting"),
  loading: Loading,
  timeout: 10000,
});

import React, { useState } from "react";
import "./Login.css";
import request from "../handleRequests.js";
import { setUser } from "../features/userSlice";
import { useDispatch } from "react-redux";
function Login() {
  const dispatch = useDispatch();
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setloginMethod] = useState(0);
  const [error, setError] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    request
      .login("/users/login", password, email)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "failed")
          setError("incorrect username or password!!!");
        else dispatch(setUser(data.user));
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    request
      .signup("/users/signup", username, password, email)
      .then((response) => response.json())
      .then((data) => {
        if (!data.user) {
          if (
            data.message ==
            'E11000 duplicate key error collection: chatApp.users index: email_1 dup key: { : "ali@hasan.com" }'
          )
            setError("email already exist!!");
          else setError("please write stronger password!!");
        }
        dispatch(setUser(data.user));
      });
  };

  const github = (e) => {
    e.preventDefault();
    window.open("http://localhost:8080/auth/github", "_self");
  };
  const google = (e) => {
    e.preventDefault();
    window.open("http://localhost:8080/auth/google", "_self");
  };

  const gotoSignup = (e) => {
    e.preventDefault();
    setSignup(!signup);
  };
  return (
    <div className="login">
      <div className="login__header">
        <img src="/defaults/Chaty.png" width="75" height="75" alt="logo" />
      </div>
      <div className="login__container">
        <h1 className="login__containerTitle">
          Welcome to <span>Chaty</span> App.
        </h1>

        {loginMethod == 0 && (
          <div className="contianer__info">
            <p>
              <span>Chaty</span> is web application to communicate with friends
              or family.
              <br /> support chats between two users and multible users through
              Groups.
            </p>
            <h2>Sign in with:</h2>
            <button onClick={() => setloginMethod(1)}>Gmail or Github</button>
            <button onClick={() => setloginMethod(2)}>
              Email And Password
            </button>
          </div>
        )}

        {loginMethod == 1 && (
          <div className="contianer__info">
            <h3 className="note">
              Sign in via Gmail or Github is <span>not</span> dengerous ! <br />
              We <span>can not</span> take your password or hack you if you sign
              in. <br />
            </h3>
            <button onClick={github}>sign in using github</button>
            <button onClick={google}>sign in using google</button>
            <button onClick={() => setloginMethod(0)}>return</button>
          </div>
        )}
        {loginMethod == 2 && (
          <div className="contianer__info">
            <h3 className="note">
              Please do not enter real email when sign in using Email and
              Password <br />
              you can enter any email like : <span>name@example.com</span>
              <br />
            </h3>
            <p className="error">{error}</p>
            <form onSubmit={signup ? handleSignup : handleLogin}>
              {signup && (
                <input
                  value={username}
                  required
                  type="text"
                  placeholder="Enter Username.."
                  onChange={(e) => setusername(e.target.value)}
                  name="username"
                />
              )}
              <input
                value={email}
                required
                type="email"
                placeholder="Enter Email.."
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
              <input
                value={password}
                required
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">{signup ? "Signup" : "Login"}</button>
              <button onClick={gotoSignup}>
                {!signup ? "Dont Have Account ! Signup" : "->"}
              </button>
              <button onClick={() => setloginMethod(0)}>Return</button>
            </form>
          </div>
        )}
        <p>Ali Saleem Hasan</p>
      </div>
    </div>
  );
}

export default Login;

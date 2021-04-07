import React, { useState } from "react";
import "./Login.css";
import { useStateValue } from "../StateProvider.js";
import { ActionTypes } from "../reducer";
import request from "../handleRequests.js";
function Login() {
  const [{ user }, dispatch] = useStateValue();
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setloginMethod] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();
    request
      .login("/users/login", password, email)
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: ActionTypes.SET_USER,
          user: data.user,
        });
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    request
      .signup("/users/signup", username, password, email)
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: ActionTypes.SET_USER,
          user: data.user,
        });
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
        <img
          src="https://ci5.googleusercontent.com/proxy/i1o6KTJQTHHmX5hnYZ7SqYRXbGgIjtJP3KMGDfF2GO40Sk6G81IuS2gaqcjCHO0e9fvMINsJOz9H_NKe7jnYy4SsdtJFu6Oxk9Z9ybAW9DvOxJrKpq-Wg7DMpq-u_7YUpzFsasTCCWM33mZB1hoWteqkgXkx5yCq=s0-d-e1-ft#https://www.freelogodesign.org/file/app/client/thumb/360c8536-91f2-483b-9f6c-7034f81996ce_200x200.png"
          width="75"
          height="75"
          alt="logo"
        />
        {signup && <button>next</button>}
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
        {/* <h2>sing in</h2>
        <p>Note:</p>
        <h3 className="note">
          sign in via Gmail or Github is not dengerous ! <br />
          We can not take your password or hack you if you sign in <br />
        </h3>
        <h3 className="note">
          Please do not enter real email when sign in using Email and Password{" "}
          <br />
          you can enter any email like : <span>name@example.com</span>
          <br />
          ,for what ever reason do not enter your real password or email cause
          this web app is just a demo!!!!!!!
        </h3> */}

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
            <form onSubmit={signup ? handleSignup : handleLogin}>
              {signup && (
                <input
                  value={username}
                  type="text"
                  placeholder="Enter Username.."
                  onChange={(e) => setusername(e.target.value)}
                  name="username"
                />
              )}
              <input
                value={email}
                type="email"
                placeholder="Enter Email.."
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
              <input
                value={password}
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">{signup ? "Signup" : "Login"}</button>
              <button onClick={gotoSignup}>
                {!signup ? "Dont Have Account ! Signup" : "->"}
              </button>
              <button onClick={() => setloginMethod(0)}>return</button>
            </form>
          </div>
        )}
        <p>Ali Saleem Hasan</p>
      </div>
    </div>
  );
}

export default Login;

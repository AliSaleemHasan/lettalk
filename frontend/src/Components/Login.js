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

  const gotoSignup = (e) => {
    e.preventDefault();
    setSignup(!signup);
  };
  return (
    <div className="login">
      <button onClick={github}>sign in using github</button>
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
      </form>

      <button onClick={gotoSignup}>
        {!signup ? "Dont Have Account ! Signup" : "->"}
      </button>
    </div>
  );
}

export default Login;

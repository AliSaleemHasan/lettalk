import React, { useState } from "react";
import "./Login.css";
import { useStateValue } from "../StateProvider.js";
import { ActionTypes } from "../reducer";
function Login() {
  const [{ user }, dispatch] = useStateValue();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async (e) => {
    e.preventDefault();
    await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: ActionTypes.SET_USER,
          user: data.user,
        });
      });
  };
  return (
    <div className="login">
      <form onSubmit={login}>
        <input
          value={email}
          type="email"
          placeholder="Enter Email.."
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          value={password}
          type="password"
          placeholder="Enter Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

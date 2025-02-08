import React, { useState } from "react";
import "../css/Login.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function Login() {
  const [buttonCss, setButtonCss] = useState({
    boxShadow: "5px 5px black",
  });

  const handleLogin = () => {
    setButtonCss((prevStyle) => ({
      ...prevStyle,
      boxShadow: "0px 0px black",
      transform: "translate(7px, 7px)"
    }));

    setTimeout(()=>{
      setButtonCss((prevStyle) => ({
        ...prevStyle,
        boxShadow: "5px 5px black",
        transform: "translate(0px, 0px)"
      }));
    },150)
  };

  return (
    <>
      <Navbar />
      <div className="login">
        <div className="partion2">
          <div className="login_content">
            <p className="signIn_login">SignIn</p>
            <input type="text" placeholder="abc@gmail.com" />
            <input type="password" placeholder="************" />
            <button
              type="submit"
              className="login_button"
              style={buttonCss}
              onClick={handleLogin}
            >
              Login
            </button>
            <Link to="/signup" className="Sign_up_link">
              Don't have an account?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}



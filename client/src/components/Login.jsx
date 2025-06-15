import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate=useNavigate();

  const [loginBtnStyle,setLoginBtnStyle]=useState({
    boxShadow:"6px 6px black",
  })

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginBtnStyle(()=>{return {boxShadow:"0px 0px black",transform:"translate(5px,5px)"}});
    
    setTimeout(()=>{
      setLoginBtnStyle(()=>{return {boxShadow:"6px 6px black"}});
    },100)
    const validateData = validate();
    if (validateData) {
      let data = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({email,password}),
      });
      data = await data.json();
      console.log(data);

      if(data.status==="SUCCESS"){
        console.log("calling toasting");
        toast.success("Login Successful", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/");
      }
      else if(data.status==="FAILED"){
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };




  const getProfile = async () => {
    if (true) {
      let data = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      data = await data.json();
      console.log(data);
    }
  };

  return (
    <>
      <div className="loginContainer">
        <form onSubmit={handleSubmit} className="loginElementsContainer">
          <div className="emailContainer">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              className="emailInput"
              placeholder="alpha@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="passwordContainer">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="passwordInput"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="loginBtnContainer">
            <button className="loginBtn" type="submit" style={loginBtnStyle}>
              Log in
            </button>
          </div>

          <p className="text-center" style={{ marginTop: "30px" }}>
            Dont have an account?{" "}
            <span
              style={{ color: "#b0306a", cursor: "pointer" }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;

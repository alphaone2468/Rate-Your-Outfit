import "../css/Navbar.css";
import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user,setUser]=useState({});

  const handleLogout = async () => {
    const res = await fetch("http://localhost:5000/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "SUCCESS") {
      navigate("/login");
    } else {
      console.log("Logout failed");
    }
  }


  const currentLoginUser = async () => {
    let data = await fetch("http://localhost:5000/isLoggedIn", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    data = await data.json();
    console.log(data);

    if (data.status === "FAILED") {
      navigate("/login");
    } else {
      navigate(`/profile/${data.user._id}`);
    }
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo" style={{color:"#b0306a",fontWeight:700,fontFamily:"Lato, sans-serif"}}>RateYourOutfit</div>
        <ul className="navbar-links">
          <li>
            <Link to="/upload">Upload</Link>
          </li>
          <li>
            <p onClick={currentLoginUser}>Profile</p>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="logoutContainer" onClick={handleLogout}>
            <MdLogout />
            <p className="logout" onClick={() => {console.log(document.cookie)}}>Logout</p>
          </li>
          {/* <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li> */}
        </ul>
      </nav>
    </div>
  );
}

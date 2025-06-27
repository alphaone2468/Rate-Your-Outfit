import "../styles/Navbar.css"; 
import { Link } from "react-router-dom"; 
import { MdLogout } from "react-icons/md"; 
import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react"; 
import {toast} from "react-hot-toast"; 
import { useLocation } from "react-router-dom";
 
export default function Navbar() { 
  const navigate = useNavigate(); 
  const [user,setUser]=useState({}); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(true);
 
  const handleLogout = async () => { 
    const res = await fetch("http://localhost:5000/api/user/logout", { 
      method: "GET", 
      headers: { 
        "Content-Type": "application/json", 
      }, 
      credentials: "include", 
    }); 
    const data = await res.json(); 
    console.log(data); 
    if (data.status === "SUCCESS") { 
      toast.success("Logout successful"); 
      navigate("/login"); 
    } else { 
      toast.error("Logout failed"); 
      console.log("Logout failed"); 
    } 
  } 
 


  const currentLoginUser = async () => {
    let data = await fetch("http://localhost:5000/api/user/isLoggedIn", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
      }, 
      credentials: "include", 
    }); 
    data = await data.json(); 
    console.log(data); 
 
    if (data.status === "FAILED") { 
      setShowAllMenu(false);
      navigate("/login"); 
    } else { 
      navigate(`/profile/${data.user._id}`); 
    } 
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
 
  return ( 
    <div> 
      <nav className="navbar"> 
        <div className="navbar-logo" style={{color:"#b0306a",fontWeight:700,fontFamily:"Lato, sans-serif"}}>RateYourOutfit</div> 
        
        {/* Hamburger Menu Button */}
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}> 
          <li> 
            <Link to="/upload" onClick={closeMenu}>Upload</Link> 
          </li> 
          <li> 
            <Link to="/search" onClick={closeMenu}>Search</Link> 
          </li> 
          <li> 
            <p onClick={() => {currentLoginUser(); closeMenu();}}>Profile</p> 
          </li> 
          <li> 
            <Link to="/" onClick={closeMenu}>Home</Link> 
          </li> 
          <li className="logoutContainer" onClick={() => {handleLogout(); closeMenu();}}> 
            <MdLogout /> 
            <p className="logout" onClick={() => {console.log(document.cookie)}}>Logout</p> 
          </li> 
        </ul> 
      </nav> 
    </div> 
  ); 
}
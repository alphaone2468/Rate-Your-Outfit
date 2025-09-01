import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const getUser = useContext(UserContext);
  const profileDropdownRef = useRef(null);
  
  console.log("from navbar", getUser.user);

  const location = useLocation();

  useEffect(() => {
    const route = window.location.pathname.split("/").pop();
    if (route === "signup" || route === "login") {
      setShowAllMenu(false);
    } else {
      setShowAllMenu(true);
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setShowProfileDropdown(false);
  };

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
    setUser(data);
    console.log("data from navbar", data);

    if (data.status === "FAILED") {
      navigate("/login");
    } else {
      navigate(`/profile/${data.user._id}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileClick = () => {
    currentLoginUser();
    setShowProfileDropdown(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo" style={{ color: "#b0306a", fontWeight: 700, fontFamily: "Lato, sans-serif" }}>
          RateYourOutfit
        </div>

        {/* Hamburger Menu Button */}
        {showAllMenu && (
          <>
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
                <Link to="/" onClick={closeMenu}>Home</Link>
              </li>
            </ul>

            {/* Profile Picture with Dropdown */}
            <div className="profile-container" ref={profileDropdownRef}>
              <div className="profile-picture" onClick={toggleProfileDropdown}>
                <img 
                  src={getUser?.user?.resizedProfilePicture || "https://via.placeholder.com/40x40/b0306a/white?text=U"} 
                  alt="Profile" 
                />
              </div>
              
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-item" onClick={handleProfileClick}>
                    View Profile
                  </div>
                  <div className="dropdown-item logout-item" onClick={handleLogout}>
                    <MdLogout />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
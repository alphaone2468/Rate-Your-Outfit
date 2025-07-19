import "../styles/Search.css";
import { IoMdSearch } from "react-icons/io";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

    useEffect(()=>{
      getProfile();
    },[])
  
  
      const getProfile = async () => {
        let data = await fetch("http://localhost:5000/api/user/isLoggedIn", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        data = await data.json();
        console.log(data);
        if(data.status==="FAILED"){
          navigate("/login");
        }
      }

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      const res = await fetch(
        `http://localhost:5000/api/user/search/?name=${e.target.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.status === "SUCCESS") {
        console.log("Search results:", data.users);
        setUsers(data.users);
      } else {
        console.error("Search failed:", data.message);
      }
    }
  };
  return (
    <div className="searchContainer">
      <div className="searchMainElement">
        <div className="nameContainer" style={{ position: "relative" }}>
          <IoMdSearch
            style={{
              fontSize: "25px",
              position: "absolute",
              left: "35px",
              top: "30px",
            }}
          />
          <input
            type="text"
            id="username"
            className="userNameInput"
            placeholder="Search UserName"
            onChange={handleSearch}
          />
        </div>
        <div className="searchResults">
          {searchQuery.length > 0 && users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <div key={user._id} className="commentElement" onClick={() => navigate(`/profile/${user._id}`)} style={{ cursor: "pointer" }}>
                  <img
                    src={user.resizedProfilePicture}
                    alt=""
                    className="postProfilePicture"
                  />
                  <div>
                    <p
                      style={{
                        fontWeight: "500",
                        marginBottom: "3px",
                        position: "relative",
                        left: "5px",
                        top: "10px",
                      }}
                    >
                      {user.userName}{" "}
                    </p>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p className="noResults">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}

import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const navigate=useNavigate();

  const getProfile = async () => {
      let data = await fetch("http://localhost:5000/api/user/isLoggedIn", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      data = await data.json();
      console.log("from context",data);
      setUser(data.user);
      if(data.status==="FAILED"){
        navigate("/login");
      }
    }

    useEffect(()=>{
        getProfile();
    },[])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

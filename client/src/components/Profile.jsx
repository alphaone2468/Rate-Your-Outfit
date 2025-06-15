import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import star from "../css/star.png";
import "../css/Profile.css";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loginUser, setLoginUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    async function getPosts() {
      console.log("Current Path:", location.pathname.slice(9,));
      const res = await fetch(`http://localhost:5000/userPosts/${window.location.pathname.split("/").pop()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let data = await res.json();
      data = data.posts;
      // Add `userRating` to each post
      const updatedPosts = data.map((post) => ({ ...post, userRating: 0 }));
      setPosts(updatedPosts);
    }
    getPosts();
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [location.pathname]);

  useEffect(() => {
    currentLoginUser();
  },[]);
  
  const currentLoginUser= async() => {
    let data = await fetch("http://localhost:5000/isLoggedIn", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    data = await data.json();
    if (data.status === "SUCCESS") {
      console.log("User is logged in",data.user);
      let profile= await fetch(`http://localhost:5000/profile/${data.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      profile = await profile.json();
      if (profile.status === "SUCCESS") {
        setLoginUser(profile.user);
        console.log("Profile fetched successfully",profile.user);
        console.log("have alook",window.location.pathname.split("/").pop());
        if(profile.user.following.includes(window.location.pathname.split("/").pop())){
          setIsFollowing(true);
        }
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, [location.pathname]);

  const getProfile = async () => {
    console.log(window.location.pathname.split("/").pop());
    let data = await fetch(`http://localhost:5000/profile/${window.location.pathname.split("/").pop()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    data = await data.json();
    console.log(data);
    if (data.status === "SUCCESS") {
      setUser(data.user);
    }

    if (data.status === "FAILED") {
      navigate("/login");
    }
  };

  const handleUserRated = async (index, rating, postId) => {
    let updatedPosts = [...posts];
    updatedPosts[index].userRating = rating;
    setPosts(() => {
      return updatedPosts;
    });

    let postData = await fetch("http://localhost:5000/addRating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        rating: rating,
      }),
      credentials: "include",
    });
    postData = await postData.json();
    console.log(postData);

    //update Live

    updatedPosts = [...posts];
    updatedPosts[index].overAllRatings =
      (updatedPosts[index].overAllRatings * updatedPosts[index].noOfRatings +
        rating) /
      (updatedPosts[index].noOfRatings + 1);
    updatedPosts[index].noOfRatings += 1;
    setPosts(() => {
      return updatedPosts;
    });
  };

  const handleChangeProfileImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToString(file);
    console.log(base64);
    setShowSaveButton(true);
    setUser(({...user,profilePicture: base64}));
  };

  function convertToString(file) {
    console.log("calling");
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }


  const handleSaveProfileImage = async () => {
    const res = await fetch("http://localhost:5000/updateProfilePicture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profilePicture: user.profilePicture,
      }),
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "SUCCESS") {
       toast.success("Profile picture updated successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
      });
    } else {
      toast.error("Failed to update profile picture", {
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

  const handleFollowUser = async () => {
    const res = await fetch("http://localhost:5000/followUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followingId: user._id,
      }),
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "SUCCESS") {
      toast.success("User followed successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Failed to follow user", {
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

  return (
    <div className="HomeContainer">
      <div className="profileContainer">
        <div className="profileInfo">
          <div>
            <img
              src={user.profilePicture}
              alt=""
              width={50}
            />
            <label htmlFor="profilePicture">
              <input
                type="file"
                id="profilePicture"
                style={{ display: "none" }}
                onChange={handleChangeProfileImage}
              />
              {(loginUser._id === user._id) && <p className="changeText">Change</p>}
            </label>
              {showSaveButton && <p className="changeText" onClick={handleSaveProfileImage} style={{ margin:"2px 30px" }}>Save</p>}
          </div>
          <div className="profileDetails">
          <div className="userName">
            <p className="userNameText">{user.userName}</p>
            
            {(loginUser._id !== user._id) ? 
              <button onClick={handleFollowUser}>
                {isFollowing ? "following" : "Follow"}
              </button> : <p></p>
            }
          </div>
          <div className="followDetails">
            <div className="followersDiv">
            <p className="followers">Followers</p>
            <p className="followersCount tc ">{user.followers?.length}</p>
          </div>
          <div className="followingDiv">
            <p className="following">Following</p>
            <p className="followingCount tc">{user.following?.length}</p>
          </div>
          </div>
          </div>
        </div>
      </div>
      <h1 className="heading"> Posts</h1>
      {posts.map((post, index) => (
        <div className="post" key={index}>
          <div className="postHeader">
            <CgProfile style={{ fontSize: "30px" }} />
            <p>{post.userName}</p>
          </div>
          <img src={post.image} alt="" className="postImage" />
          <div className="overAllRating">
            <div className="ratingInfo">
              <img src={star} alt="" className="star" />
              <p>
                {post.overAllRatings.toString().length > 1
                  ? post.overAllRatings.toFixed(1)
                  : post.overAllRatings}
              </p>
              <p>({post.noOfRatings})</p>
            </div>
          </div>
          <div className="ratingBar">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
              <p
                key={i}
                className="ratingElement text-center"
                style={{
                  backgroundColor: post.userRating >= i + 1 ? "#e7e0ff" : "",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                }}
                onClick={() => handleUserRated(index, i + 1, post._id)}
              >
                {i + 1}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

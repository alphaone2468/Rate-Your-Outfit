import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import star from "../styles/star.png";
import "../styles/Profile.css";
import { toast } from "react-hot-toast";
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
      const res = await fetch(`http://localhost:5000/api/post/userPosts/${window.location.pathname.split("/").pop()}`, {
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
    let data = await fetch("http://localhost:5000/api/user/isLoggedIn", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    data = await data.json();
    if (data.status === "SUCCESS") {
      console.log("User is logged in",data.user);
      let profile= await fetch(`http://localhost:5000/api/user/profile/${data.user._id}`, {
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
    let data = await fetch(`http://localhost:5000/api/user/profile/${window.location.pathname.split("/").pop()}`, {
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

    let postData = await fetch("http://localhost:5000/api/post/addRating", {
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

    let updatedPosts = [...posts];
    if(updatedPosts[index].userRated===0){
      console.log((updatedPosts[index].avgRating * updatedPosts[index].ratings.length));
      updatedPosts[index].avgRating = ((updatedPosts[index].avgRating * updatedPosts[index].ratings.length) + rating)/(updatedPosts[index].ratings.length + 1);
      updatedPosts[index].ratings.push({userId:user._id,rated:rating});
    }
    else{
      let oldAvgRating = updatedPosts[index].avgRating;
      let oldRating = updatedPosts[index].userRated;
      updatedPosts[index].avgRating = ((oldAvgRating * updatedPosts[index].ratings.length) - oldRating + rating) / updatedPosts[index].ratings.length;
    }
    updatedPosts[index].userRated = rating;
    console.log(updatedPosts[index]);

    setPosts(updatedPosts);
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
    const res = await fetch("http://localhost:5000/api/user/updateProfilePicture", {
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
    const res = await fetch("http://localhost:5000/api/user/followUser", {
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
      setIsFollowing(true);
      setUser({...user,followers:[...user.followers,user._id]});
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
            <img src={user.profilePicture} alt="" className="postProfilePicture" />
            <p >{user.userName}</p>
          </div>
          <img src={post.image} alt="" className="postImage" />
          <div className="overAllRating">
              <div className="ratingInfo">
                <img src={star} alt="" className="star" />
                <p>{post.avgRating.toFixed(1)}</p>
                <p>({post.ratings.length})</p>
              </div>
          </div>
          <div className="ratingBar">
            {[1,2,3,4,5,6,7,8,9,10].map((_, i) => (
              <p
                key={i}
                className="ratingElement text-center"
                style={{
                  backgroundColor: post.userRated>=i+1?"#ffadd2":"",
                  borderTopLeftRadius:"5px",
                  borderBottomLeftRadius:"5px"
                }}
                onClick={() => handleUserRated(index, i + 1,post._id)}
              >
                {i+1}
              </p>
            ))}
          </div>

          <p onClick={() => navigate(`/comments/${post._id}`)} className="commentsText">See comments</p>
        </div>
      ))}
    </div>
  );
}

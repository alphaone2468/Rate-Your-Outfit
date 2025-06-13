import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import star from "../css/star.png";
import "../css/Profile.css";
export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [profileImg, setProfileImg] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    async function getPosts() {
      const res = await fetch("http://localhost:5000/userPosts", {
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
  }, []);


  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    console.log(window.location.pathname.split("/").pop());
    return;
    let data = await fetch(`http://localhost:5000/profile/${window.location.pathname.split("/").pop()}`, {
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
    setProfileImg(base64);
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

  return (
    <div className="HomeContainer">
      <div className="profileContainer">
        <div className="profileInfo">
          <div>
            {/* <CgProfile style={{ fontSize: "100px" }} /> */}

            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt=""
              width={50}
            />
            <label htmlFor="profilePicture">
              <input
                type="file"
                id="profilePicture"
                style={{ display: "none" }}
                accept=".jpg,.jepg,.png"
                onChange={handleChangeProfileImage}
              />
              <p className="tc changeText">Change</p>
            </label>
          </div>
          <div className="followersDiv">
            <p className="followers">Followers</p>
            <p className="followersCount tc ">0</p>
          </div>
          <div className="followingDiv">
            <p className="following">Following</p>
            <p className="followingCount tc">0</p>
          </div>
        </div>
      </div>
      <h1 className="heading">Your Posts</h1>
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

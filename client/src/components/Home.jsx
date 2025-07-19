import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import star from "../styles/star.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const navigate=useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getPosts() {
      const res = await fetch("http://localhost:5000/api/post/getPost",{
        method:"GET",
        credentials:"include"
      });
      const data = await res.json();
      console.log(data);
      // Add `userRating` to each post
      setPosts(data);
      setLoading(false);
    }
    getPosts();
  }, []);

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
      setUser(data.user);
      if(data.status==="FAILED"){
        navigate("/login");
      }
    }

  const handleUserRated = async (index, rating,postId) => {
  

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

  return (
    <div className="HomeContainer">
      {loading && <p>Loading</p>}
      {posts?.map((post, index) => (
        <div className="post" key={index}>
          <div className="postHeader">
            <img src={post.userId.resizedProfilePicture} alt="" className="postProfilePicture" />
            <p onClick={() => 
              navigate(`/profile/${post.userId._id}`)}
              style={{ cursor: "pointer" }}
            >{post.userId.userName}</p>
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
                  borderRadius:"3px",
                  boxShadow:"1px 1px 5px rgba(0,0,0,0.1)"
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

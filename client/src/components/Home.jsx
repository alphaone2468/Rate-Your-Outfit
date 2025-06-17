import React, { useEffect, useState } from "react";
import "../css/Home.css";
import star from "../css/star.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    async function getPosts() {
      const res = await fetch("http://localhost:5000/getPost");
      const data = await res.json();
      console.log(data);
      // Add `userRating` to each post
      const updatedPosts = data.map(post => ({ ...post, userRating: 0 }));
      setPosts(updatedPosts);
    }
    getPosts();
  }, []);

  useEffect(()=>{
    getProfile();
  },[])


    const getProfile = async () => {
      let data = await fetch("http://localhost:5000/isLoggedIn", {
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

  const handleUserRated = async (index, rating,postId) => {
    let updatedPosts = [...posts];
    updatedPosts[index].userRating = rating;
    setPosts(() => { return updatedPosts });

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

    updatedPosts=[...posts];
    updatedPosts[index].overAllRatings = (updatedPosts[index].overAllRatings*updatedPosts[index].noOfRatings + rating) / (updatedPosts[index].noOfRatings + 1);
    updatedPosts[index].noOfRatings += 1;
    setPosts(() => { return updatedPosts });

  };

  return (
    <div className="HomeContainer">
      {posts.map((post, index) => (
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
                <p>{(post.overAllRatings.toString().length>1) ? post.overAllRatings.toFixed(1) : post.overAllRatings}</p>
                <p>({post.noOfRatings})</p>
              </div>
          </div>
          <div className="ratingBar">
            {[1,2,3,4,5,6,7,8,9,10].map((_, i) => (
              <p
                key={i}
                className="ratingElement text-center"
                style={{
                  backgroundColor: post.userRating>=i+1?"#ffadd2":"",
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

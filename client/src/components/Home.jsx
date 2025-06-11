import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { CgProfile } from "react-icons/cg";
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
  })


    const getProfile = async () => {
      let data = await fetch("http://localhost:5000/profile", {
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

  const handleUserRated = (index, rating) => {
    const updatedPosts = [...posts];
    updatedPosts[index].userRating = rating;
    setPosts(updatedPosts);
  };

  return (
    <div className="HomeContainer">
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
                <p>{post.overAllRatings}</p>
                <p>({post.noOfRatings})</p>
              </div>
          </div>
          <div className="ratingBar">
            {[1,2,3,4,5,6,7,8,9,10].map((_, i) => (
              <p
                key={i}
                className="ratingElement text-center"
                style={{
                  backgroundColor: post.userRating>=i+1?"#e7e0ff":"",
                  borderTopLeftRadius:"5px",
                  borderBottomLeftRadius:"5px"
                }}
                onClick={() => handleUserRated(index, i + 1)}
              >
                {i+1}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

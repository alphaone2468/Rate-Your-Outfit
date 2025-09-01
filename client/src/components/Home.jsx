import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import star from "../styles/star.png";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../context/UserContext";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const getUser = useContext(UserContext);
  console.log(getUser.user);

  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    getPosts(1, true); // Reset posts on component mount
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Calculate if user has scrolled 70% of the page
      const scrollPercent = (scrollTop + windowHeight) / docHeight;
      
      if (scrollPercent >= 0.8 && hasMore && !loadingMore && !loading) {
        loadMorePosts();
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function to remove event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loading, currentPage]); // Dependencies for the effect

  async function getPosts(page = 1, reset = false) {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(
        `http://localhost:5000/api/post/getPost?page=${page}&limit=${POSTS_PER_PAGE}`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      const data = await res.json();
      console.log(data);

      if (data.status === "SUCCESS") {
        if (reset) {
          setPosts(data.posts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...data.posts]);
        }
        
        // Check if there are more posts to load
        setHasMore(data.posts.length === POSTS_PER_PAGE);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      getPosts(currentPage + 1, false);
    }
  };

  const handleUserRated = async (index, rating, postId) => {
    try {
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
      if (updatedPosts[index].userRated === 0) {
        console.log((updatedPosts[index].avgRating * updatedPosts[index].ratings.length));
        updatedPosts[index].avgRating = ((updatedPosts[index].avgRating * updatedPosts[index].ratings.length) + rating) / (updatedPosts[index].ratings.length + 1);
        updatedPosts[index].ratings.push({userId: getUser.user._id, rated: rating});
      } else {
        let oldAvgRating = updatedPosts[index].avgRating;
        let oldRating = updatedPosts[index].userRated;
        updatedPosts[index].avgRating = ((oldAvgRating * updatedPosts[index].ratings.length) - oldRating + rating) / updatedPosts[index].ratings.length;
      }
      updatedPosts[index].userRated = rating;
      console.log(updatedPosts[index]);

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error rating post:", error);
    }
  };

  console.log(posts);

  return (
    <div className="HomeContainer">
      {loading && <p>Loading...</p>}
      
      {posts.map((post, index) => (
        <div className="post" key={`${post._id}-${index}`}>
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
                  backgroundColor: post.userRated >= i + 1 ? "#ffadd2" : "",
                  borderRadius: "3px",
                  boxShadow: "1px 1px 5px rgba(0,0,0,0.1)"
                }}
                onClick={() => handleUserRated(index, i + 1, post._id)}
              >
                {i + 1}
              </p>
            ))}
          </div>

          <p onClick={() => navigate(`/comments/${post._id}`)} className="commentsText">See comments</p>
        </div>
      ))}

      {/* Loading indicator for infinite scroll */}
      {loadingMore && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Loading more posts...</p>
        </div>
      )}

      {/* Manual Load More Button (optional - you can remove this if you only want infinite scroll) */}
      {hasMore && !loading && !loadingMore && (
        <div className="loadMoreContainer" style={{ textAlign: "center", padding: "20px" }}>
          <button 
            onClick={loadMorePosts}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Load More Posts
          </button>
        </div>
      )}

      {/* End of posts message */}
      {!hasMore && posts.length > 0 && (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          <p>You've reached the end of the posts!</p>
        </div>
      )}
    </div>
  );
}
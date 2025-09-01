import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import "../styles/Comments.css";
import { useNavigate } from "react-router-dom";
import star from "../styles/star.png";

export default function Comments() {
  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const [comments, setComments] = useState([]);
  const [showError, setShowError] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({
    boxShadow: "6px 6px black",
  });
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const [text, setText] = useState("");

  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  useEffect(() => {
    getProfile();
  }, []);

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
    if (data.status === "SUCCESS") {
      let profile = await fetch(
        `http://localhost:5000/api/user/profile/${data.user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      profile = await profile.json();
      if (profile.status === "SUCCESS") {
        console.log(profile);
        setUser(profile.user);
      }
      if (data.status === "FAILED") {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`http://localhost:5000/api/post/getComments/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.status === "SUCCESS") {
        const sortedComments = [...data.post.comments].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setComments(sortedComments);
        setPost(data.post);
      } else {
        console.log("I am here")
        toast.error(data.message);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setButtonStyle(() => {
      return { boxShadow: "0px 0px black", transform: "translate(5px,5px)" };
    });
    setTimeout(() => {
      setButtonStyle(() => {
        return { boxShadow: "6px 6px black" };
      });
    }, 100);
    console.log(text);
    if (!text.trim()) {
      setShowError(true);
      return;
    }
    const response = await fetch("http://localhost:5000/api/post/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, comment: text }),
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === "SUCCESS") {
      setComments([
        { userId: { userName: user.userName, resizedProfilePicture: user.resizedProfilePicture }, comment: text, createdAt: new Date() },
        ...comments,
      ]);
      setText("");
      toast.success("Comment added successfully!");
    } else {
      toast.error(data.message);
    }
  };

  const daysHappenedSinceCommented = (createdAt) => {
    createdAt = new Date(createdAt);
    if (isNaN(createdAt)) return "Invalid date";

    const now = new Date();
    const seconds = (now - createdAt) / 1000;

    if (seconds < 60) {
      const s = Math.floor(seconds);
      return `${s} second${s !== 1 ? "s" : ""} ago`;
    } else if (seconds < 60 * 60) {
      const m = Math.floor(seconds / 60);
      return `${m} minute${m !== 1 ? "s" : ""} ago`;
    } else if (seconds < 24 * 60 * 60) {
      const h = Math.floor(seconds / (60 * 60));
      return `${h} hour${h !== 1 ? "s" : ""} ago`;
    } else {
      const d = Math.floor(seconds / (24 * 60 * 60));
      return `${d} day${d !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="commentsContainer">
      <div className="commentsElementsContainer">
        <div className="post" style={{ paddingBottom: "6px" }}>
          <div className="postHeader">
            <img
              src={post?.userId?.resizedProfilePicture}
              alt=""
              className="postProfilePicture"
            />
            <p
              onClick={() => navigate(`/profile/${post?.userId?._id}`)}
              style={{ cursor: "pointer" }}
            >
              {post?.userId?.userName}
            </p>
          </div>
          <img src={post.image} alt="" className="postImage" />
          <div className="overAllRating">
            <div className="ratingInfo">
              <img src={star} alt="" className="star" />
              <p>
                {post?.overAllRatings?.toString().length > 1
                  ? post?.overAllRatings?.toFixed(1)
                  : post?.overAllRatings}
              </p>
              <p>({post?.noOfRatings})</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleCommentSubmit} className="commentForm">
          <div className="textAreaContainer">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              style={{ overflow: "hidden", resize: "none", width: "100%" }}
              className="commentInput"
              placeholder="Add a comment..."
            />
            {showError && <p className="error">Comment cannot be empty</p>}
          </div>
          <div className="loginBtnContainer">
            <button className="commentBtn" type="submit" style={buttonStyle}>
              Comment
            </button>
          </div>
        </form>
        <div className="userComments">
          {comments.map((comment) => (
            <div key={comment._id} className="commentElement">
              <img
                src={comment.userId.resizedProfilePicture}
                alt=""
                className="postProfilePicture"
              />
              <div>
                <p style={{ fontWeight: "500", marginBottom: "3px" }}>
                  @{comment.userId.userName}{" "}
                  <span style={{ color: "#595959", fontSize: "14px" }}>
                    {" "}
                    {daysHappenedSinceCommented(comment.createdAt)}
                  </span>
                </p>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

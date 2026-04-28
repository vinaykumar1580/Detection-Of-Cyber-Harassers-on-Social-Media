import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useParams } from "react-router-dom";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const { postId } = useParams(); // If fetching a single post

  useEffect(() => {
    if (userId) fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts([response.data]);
      } catch (err) {
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/${postId}/like`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, likes: response.data.likes } : post)));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/${postId}/dislike`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, dislikes: response.data.dislikes } : post)));
    } catch (err) {
      console.error("Error disliking post:", err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const commentText = (newComment[postId] || "").trim();
    if (!commentText) return alert("⚠️ Comment cannot be empty.");
    if (!userId || !userName) return alert("⚠️ You need to log in to comment.");

    try {
      // Predict if comment is offensive
      const predictionResponse = await axios.post(
        "http://127.0.0.1:5000/predict",
        { tweet: commentText },
        { headers: { "Content-Type": "application/json" } }
      );

      const prediction = predictionResponse.data.prediction;
      const isOffensive = prediction === "Hate Speech" || prediction === "Offensive";

      if (isOffensive) {
        alert("❌ Your comment was flagged as offensive and will not be posted.");
        return; // Stop execution, do not store in database
      }

      // Store only non-offensive comments
      await axios.post(
        "http://localhost:3001/api/comments/store_comment",
        { postId, userId, userName, comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPosts(); // Refresh posts after commenting
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Failed to submit comment.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-4 space-y-8">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <p className="ml-2 font-semibold text-gray-800">{post.userId?.name || "Unknown User"}</p>
            </div>

            {post.image && (
              <img src={`http://localhost:3001/uploads/${post.image}`} alt="post" className="w-full h-64 object-cover rounded-lg mb-4" />
            )}

            <p className="text-gray-800 text-lg mb-2">{post.content}</p>

            <div className="flex items-center mb-4">
              <button onClick={() => handleLike(post._id)} className="text-red-500 hover:text-red-700 flex items-center">
                <FaThumbsUp className="mr-1" />
                {post.likes?.length || 0}
              </button>
              <button onClick={() => handleDislike(post._id)} className="ml-6 text-blue-500 hover:text-blue-700 flex items-center">
                <FaThumbsDown className="mr-1" />
                {post.dislikes?.length || 0}
              </button>
            </div>

            {/* Toggle Comments Section */}
            <button
              onClick={() => setShowComments((prev) => ({ ...prev, [post._id]: !prev[post._id] }))}
              className="text-blue-600 hover:underline"
            >
              {showComments[post._id] ? "Hide Comments" : "Show Comments"}
            </button>

            {showComments[post._id] && (
              <div>
                <h3 className="text-lg font-semibold mt-4">Comments</h3>
                {post.comments?.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {post.comments.map((comment, index) => (
                      <li key={index} className="p-3 border rounded-md bg-gray-100">
                        <p className="text-sm font-bold text-blue-600">{comment.name}</p>
                        <p className="text-gray-700">{comment.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
            )}

            {/* Add Comment Input */}
            <textarea
              value={newComment[post._id] || ""}
              onChange={(e) => setNewComment((prev) => ({ ...prev, [post._id]: e.target.value }))}
              placeholder="Write your comment..."
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => handleCommentSubmit(post._id)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 mt-2"
            >
              <IoIosSend className="mr-2" />
              Post Comment
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Post;

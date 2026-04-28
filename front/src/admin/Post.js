import React, { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name"); // Retrieve stored name

  const handleContentChange = (e) => setContent(e.target.value);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    console.log("🔹 Token:", token);
    console.log("🔹 Name:", name);
    console.log("🔹 Content:", content);
    console.log("🔹 Image:", image);
  
    if (!token || !name) {
      setError("User is not authenticated. Please log in.");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);
    formData.append("name", name);
  
    try {
      const response = await axios.post(
        "http://localhost:3001/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Post created successfully:", response.data);
  
      // Reset form fields
      setContent("");
      setImage(null);
    } catch (err) {
      console.error("❌ Error creating post:", err.response?.data || err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-14">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a New Post</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handlePostSubmit}>
        {/* Content Input */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="What's on your mind?"
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
          required
        />

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="image">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            id="image"
            className="w-full text-gray-700 border-2 border-gray-300 rounded-lg p-2"
            accept="image/*"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

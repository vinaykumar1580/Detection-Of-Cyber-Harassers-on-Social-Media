const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const mongoose = require("mongoose");

// Store a comment in a post
router.post("/store_comment", async (req, res) => {
  try {
    const { postId, userId, userName, comment, isOffensive } = req.body;

    // Validate request data
    if (!postId || !userId || !userName || !comment.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find all comments for the post and user
    const existingComments = await Post.find({ postId, userId });

    // Count offensive comments
    const offensiveCount = existingComments.filter(c => c.offensiveCount >= 3).length;

    // Check if the user has made 3 offensive comments
    if (offensiveCount >= 3) {
      return res.status(403).json({ message: "❌ You are blocked from commenting on this post due to repeated offensive comments." });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Set the offensive count based on whether the comment is flagged as offensive
    const offensiveComment = isOffensive ? 1 : 0;

    // Create a new comment object
    const newComment = {
      userId: new mongoose.Types.ObjectId(userId),
      name: userName,
      text: comment.trim(),
      category: isOffensive ? "offensive" : "safe", // Set category based on offensive status
      createdAt: new Date(),
      offensiveCount: offensiveComment, // Increment if it's offensive
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);
    await post.save();
    
    // Update the offensive count for the user in the comment model
    if (isOffensive) {
      await Comment.updateOne(
        { postId, userId },
        { $inc: { offensiveCount: 1 } }
      );
    }

    return res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Fetch comments for a specific post
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID." });
    }

    // Find the post and return only its comments field
    const post = await Post.findById(postId).select("comments");

    if (!post || post.comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this post." });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;

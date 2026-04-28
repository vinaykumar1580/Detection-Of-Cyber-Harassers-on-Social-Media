const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
// const postRoutes = require("./routes/posts");
// const commentRoutes = require("./routes/comments");

// ✅ Like a post
router.post("/:postId/like", async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;
    
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "❌ Post not found" });
        }

        if (!userId) {
            return res.status(400).json({ message: "❌ Missing user ID in request body" });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "❌ User already liked this post" });
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).json({ 
            message: "✅ Post liked successfully", 
            likes: post.likes, // ✅ Returns the full array of user IDs
            likeCount: post.likes.length // ✅ Returns like count
        });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
});

// ✅ Export the router
module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const FormDataModel = require("./models/FormData");
const Post = require("./models/Post");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

const JWT_SECRET = "your_secret_key"; // Replace with a strong secret key

// Multer Storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect("mongodb://0.0.0.0:27017/instgram");

// ✅ **JWT Verification Middleware**
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(403).json({ message: "Access denied. No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Access denied. Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ **Register Route**
app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await FormDataModel.findOne({ email });
    if (existingUser) {
      return res.json("Already registered");
    }

    const newUser = await FormDataModel.create({ email, password, name });
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ **Login Route with Token Generation**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await FormDataModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "No records found!" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    // ✅ Generate JWT Token including `name`
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login Successful",
      userId: user._id,
      name: user.name,
      token: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/api/profile/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching profile for user ID:", userId);

    // Ensure the profile belongs to the authenticated user
    if (userId !== req.user.userId) {  // Ensure userId from token matches
      return res.status(403).json({ error: "You are not authorized to view this profile" });
    }

    const user = await FormDataModel.findById(userId).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ **Post Upload API**
app.post("/api/posts", verifyToken, upload.single("image"), async (req, res) => {
  console.log("🟢 Incoming POST request to /api/posts");
  console.log("📩 Request body:", req.body);
  console.log("📸 Uploaded file:", req.file);

  const { content, name } = req.body;
  const { userId } = req.user; // Extract user from JWT token

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  let imageUrl = req.file ? req.file.filename : ""; // Use filename from Multer

  try {
    const newPost = new Post({
      content,
      image: imageUrl,
      userId,
      name,
      createdAt: new Date(),
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ **Get All Posts**

// ✅ **Fetch all Posts**
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name").exec();
    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err); // Log the full error
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
});
app.get("/api/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Post.find({ postId });
    if (!comments) return res.status(404).json({ message: "No comments found" });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ **Like a Post**
app.use("/api/posts",postRoutes);
app.use("/api/comments", commentRoutes);
// Dislike a post (Ensure user can remove like)
// app.post("/api/posts/:postId/like", async (req, res) => {
//   const { postId } = req.params;
//   const { userId } = req.body;

//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "❌ Post not found" });
//     }

//     // Remove user from dislikes if they are in dislikes
//     post.dislikes = post.dislikes.filter(id => id.toString() !== userId);

//     // Toggle like: Add user if not liked, remove if already liked
//     if (post.likes.includes(userId)) {
//       post.likes = post.likes.filter(id => id.toString() !== userId);
//     } else {
//       post.likes.push(userId);
//     }

//     await post.save();
//     res.status(200).json({ message: "✅ Like updated", likes: post.likes.length, dislikes: post.dislikes.length });
//   } catch (error) {
//     res.status(500).json({ message: "❌ Server error", error });
//   }
// });

app.post("/api/posts/:postId/dislike", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "❌ Post not found" });
    }

    // ✅ Ensure dislikes array exists
    if (!post.dislikes) {
      post.dislikes = [];
    }
    if (!post.likes) {
      post.likes = [];
    }

    // Debugging Logs
    console.log(`🔍 Processing dislike for Post ID: ${postId} by User ID: ${userId}`);
    console.log(`Before: Likes - ${post.likes}, Dislikes - ${post.dislikes}`);

    // ✅ Remove user from likes if they already liked
    post.likes = post.likes.filter(id => id.toString() !== userId);

    // ✅ Toggle dislike: Add user if not disliked, remove if already disliked
    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
    } else {
      post.dislikes.push(userId);
    }

    await post.save();
    console.log(`After: Likes - ${post.likes}, Dislikes - ${post.dislikes}`);

    res.status(200).json({ message: "✅ Dislike updated", likes: post.likes.length, dislikes: post.dislikes.length });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "❌ Server error", error });
  }
});

// ✅ **Fetch Comments for a Post**
app.get("/api/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate("userId", "name avatarUrl").exec();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
});

// ✅ **Add a Comment to a Post**
app.post("/api/posts/:postId/comments", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const newComment = new Comment({
      postId: req.params.postId,
      userId: req.user.id, // Extracted from token
      content,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
});
app.get("/api/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate postId format (MongoDB ObjectId check)
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId format" });
    }

    // Find post and return comments
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
});
app.get("/api/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("comments.userId", "name"); // Populate the user name

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/uploads", express.static("uploads"));

// ✅ Start Server
app.listen(3001, () => {
  console.log("Server listening on http://localhost:3001");
});

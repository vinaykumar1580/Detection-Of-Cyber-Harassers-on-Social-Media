const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    default: "" 
  },
  video: { 
    type: String, 
    default: "" 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "log_reg_form", // Ensure this matches your User model name
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  likes: { 
    type: [mongoose.Schema.Types.ObjectId], 
    ref: "log_reg_form", 
    default: [] 
  },
  comments: [
    {
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "log_reg_form" 
      }, 
      name: { 
        type: String, 
        required: true 
      }, 
      text: { 
        type: String, 
        required: true 
      }, 
      category: { 
        type: String, 
        enum: ["safe", "offensive", "hate_speech"], 
        default: "safe" 
      }, // Stores the category of the comment
      createdAt: { 
        type: Date, 
        default: Date.now 
      },
      offensiveCount: { 
        type: Number, 
        default: 0 
      },
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Optional: You can add indexes to improve performance when querying posts by user or comments.
PostSchema.index({ userId: 1 });
PostSchema.index({ "comments.userId": 1 });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;

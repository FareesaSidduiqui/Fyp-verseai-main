const express = require("express");
const router = express.Router();
const { runVideoPipeline } = require("../pipeline/generateVideo");
const admin = require("../firebase"); // Firebase Admin SDK initialized with serviceAccount
const Story = require("../models/storyModel"); // adjust path to where Story.js is
const User = require('../models/user')
const { uploader, uploadToCloudinary } = require('../utils/cloudinary');

// POST /api/videos/generate
router.post("/generate", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // 1. Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    const mongoUser = await User.findOne({ uid });
    if (!mongoUser) {
      return res.status(404).json({ error: "User not found in database" });
    } else {
      console.log(mongoUser);

    }

    // 2. Extract and validate request body
    const { prompt, genre, duration, visibility } = req.body;
    if (!prompt || !genre || !duration) {
      return res.status(400).json({ error: "Missing required fields: prompt, genre, duration" });
    }

    // 3. Run video generation pipeline
    const result = await runVideoPipeline({ prompt, genre, duration });

    // Save to MongoDB with user reference
    const savedStory = await Story.create({
      userId: mongoUser._id, // ⬅️ ObjectId reference to User
      storyName: result.storyTitle,
      videoUrl: result.videoUrl,
      thumbnail: result.thumbnailUrl,
      visibility: visibility || "private",
    });

    // 4. Return response
    res.status(200).json({
      message: "Video generation complete",
      storyId: savedStory._id,              // Optional: send MongoDB ID
      storyName: savedStory.storyName,
      videoUrl: savedStory.videoUrl,
      thumbnailUrl: savedStory.thumbnail,
      publicVideoId: savedStory.publicVideoId,
      publicThumbnailId: savedStory.publicThumbnailId,
      visibility: savedStory.visibility || "private",
    });

    console.log(prompt, genre, duration, uid, visibility);


  } catch (error) {
    console.error("Error in /generate:", error.message || error);
    res.status(500).json({ error: "Failed to generate video or verify token" });
  }
});

// GET /api/videos
router.get("/community", async (req, res) => {
  try {
    const stories = await Story.find({}, 'storyName videoUrl thumbnail visibility createdAt')
      .populate('userId', 'username') // optional: include user info
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ stories });
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// DELETE /api/videos/:id
router.delete("/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];
  const storyId = req.params.id;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const mongoUser = await User.findOne({ uid });
    if (!mongoUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (story.userId.toString() !== mongoUser._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this story" });
    }

    // Delete video and thumbnail from Cloudinary
    const deleteResults = {};
    console.log("Deleting Cloudinary resources:", {
      publicVideoId: story.publicVideoId,
      publicThumbnailId: story.publicThumbnailId
    });

    if (story.publicVideoId) {
      const result = await uploader.destroy(story.publicVideoId, { resource_type: 'video' });
      deleteResults.video = result;
    }

    if (story.publicThumbnailId) {
      const result = await uploader.destroy(story.publicThumbnailId, { resource_type: 'image' });
      deleteResults.thumbnail = result;
    }


    // Finally delete from MongoDB
    await Story.findByIdAndDelete(storyId);

    res.status(200).json({ message: "Story and associated media deleted", deleteResults });

  } catch (error) {
    console.error("Error deleting story:", error.message || error);
    res.status(500).json({ error: "Failed to delete story" });
  }
});




module.exports = router;

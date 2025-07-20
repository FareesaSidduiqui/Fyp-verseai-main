const express = require("express");
const router = express.Router();
const admin = require("../firebase");
const User = require("../models/User");
const wrapAsync = require("../utils/wrapAsync");

// POST /api/auth/verify-token
router.post(
  "/verify-token",
  wrapAsync(async (req, res) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if (!idToken) return res.status(401).json({ error: "No token provided" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const email = decodedToken.email;
    const username = decodedToken.name || email;
    const uid = decodedToken.uid; // 🔥 Firebase unique ID

    if (!email || !uid) return res.status(400).json({ error: "Invalid token payload" });

    // Save user if not exists
    let user = await User.findOne({ uid }); // 🔄 use UID to identify the user uniquely
    if (!user) {
      user = new User({ uid, email, username }); // ✅ Store UID
      await user.save();
    }

    return res.status(200).json({ message: "User verified and saved", user });
  })
);

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// ── LOGIN — check if user exists by phone ─────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      // User not found → frontend should redirect to signup
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up.",
        redirectToSignup: true,
      });
    }

    // User found → login success
    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── REGISTER — create new user ────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { phone, email } = req.body;

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: "Phone number already registered. Please login." });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email already registered." });
      }
    }

    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user,
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ── GET ALL USERS ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET USER BY ID ────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET ALL FARMERS ───────────────────────────────────────────────────────────
router.get("/role/farmers", async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" });
    res.json({ success: true, count: farmers.length, farmers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET ALL BUYERS ────────────────────────────────────────────────────────────
router.get("/role/buyers", async (req, res) => {
  try {
    const buyers = await User.find({ role: "buyer" });
    res.json({ success: true, count: buyers.length, buyers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
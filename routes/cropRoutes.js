const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");

// Add a new crop listing
router.post("/", async (req, res) => {
  try {
    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json({ success: true, message: "Crop listed successfully", crop });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all crops
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find({ status: "available" }).populate("farmerId", "name phone state district");
    res.json({ success: true, count: crops.length, crops });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get crop by ID
router.get("/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate("farmerId", "name phone state district");
    if (!crop) return res.status(404).json({ success: false, message: "Crop not found" });
    res.json({ success: true, crop });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get crops by millet type
router.get("/type/:milletType", async (req, res) => {
  try {
    const crops = await Crop.find({ milletType: req.params.milletType, status: "available" })
      .populate("farmerId", "name phone state district");
    res.json({ success: true, count: crops.length, crops });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get crops by farmer ID
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.params.farmerId });
    res.json({ success: true, count: crops.length, crops });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update crop status (e.g., mark as sold)
router.patch("/:id/status", async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!crop) return res.status(404).json({ success: false, message: "Crop not found" });
    res.json({ success: true, message: "Crop status updated", crop });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
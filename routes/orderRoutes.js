const express = require("express");
const router = express.Router();
const Order = require("../Models/Order");
const Crop = require("../Models/Crop");

// Place a new order
router.post("/", async (req, res) => {
  try {
    const { cropId, buyerId, pricePaid } = req.body;

    // Check if crop exists and is available
    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ success: false, message: "Crop not found" });
    if (crop.status !== "available") {
      return res.status(400).json({ success: false, message: "Crop is no longer available" });
    }

    // Create the order
    const order = new Order({ cropId, buyerId, pricePaid });
    await order.save();

    // Mark crop as sold
    crop.status = "sold";
    await crop.save();

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("cropId", "milletType quantity price")
      .populate("buyerId", "name phone");
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("cropId", "milletType quantity price")
      .populate("buyerId", "name phone");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get orders by buyer ID
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.buyerId })
      .populate("cropId", "milletType quantity price location");
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update delivery status
router.patch("/:id/delivery", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        deliveryStatus: req.body.deliveryStatus,
        trackingLocation: req.body.trackingLocation
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Delivery status updated", order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
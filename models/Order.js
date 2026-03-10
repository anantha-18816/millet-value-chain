const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
    required: true,
  },

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  pricePaid: {
    type: Number,
    required: true,
  },

  // Order Status
  deliveryStatus: {
    type: String,
    enum: ["Processing", "Dispatched", "In Transit", "Delivered"],
    default: "Processing",
  },

  // Full Tracking Timeline (NEW)
  trackingHistory: [
    {
      location: {
        type: String,
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      note: {
        type: String, // e.g. "Left warehouse"
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent OverwriteModelError
module.exports =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
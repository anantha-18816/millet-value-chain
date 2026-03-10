const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  milletType: String,
  harvestDate: String,
  quantity: String,
  price: Number,
  marketType: String,
  state: String,
  district: String,
  location: String,
  status: {
    type: String,
    default: "available"
  }
}, { timestamps: true });

module.exports =
  mongoose.models.Crop || mongoose.model("Crop", CropSchema);
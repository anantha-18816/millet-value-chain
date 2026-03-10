const mongoose = require("mongoose");

const GovernmentPriceSchema = new mongoose.Schema({
  milletType: {
    type: String,
    required: true,
    unique: true
  },
  maxPrice: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: true
  }
});

module.exports =
  mongoose.models.GovernmentPrice || mongoose.model("GovernmentPrice", GovernmentPriceSchema);
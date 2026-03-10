const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===============================================
// VERIFY TOKEN (Protect Routes)
// ===============================================
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Remove "Bearer "
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, "secretkey");

    req.user = await User.findById(decoded.id).select("-password");

    next();

  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};


// ===============================================
// ONLY FARMER ALLOWED
// ===============================================
const farmerOnly = (req, res, next) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({ message: "Only farmers allowed" });
  }
  next();
};


// ===============================================
// ONLY BUYER ALLOWED
// ===============================================
const buyerOnly = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ message: ",Only buyers allowed" });
  }
  next();
};

module.exports = { protect, farmerOnly, buyerOnly };
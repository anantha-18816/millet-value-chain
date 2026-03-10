const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Allow all origins (works for emulator, real device & production)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/api/users",  require("./routes/userRoutes"));
app.use("/api/crops",  require("./routes/cropRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// ✅ Root endpoint
app.get("/", (req, res) => res.send("✅ Millet Marketplace API is Running!"));

// ✅ Health check endpoint (required for Railway & UptimeRobot monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ✅ 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ✅ Use Railway's dynamic PORT — do NOT hardcode
const PORT = process.env.PORT || 5000;

// ✅ Bind to 0.0.0.0 for cloud compatibility
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
const dns = require("dns");
try {
    dns.setDefaultResultOrder("ipv4first");
} catch (e) {
    console.log("Could not set dns result order:", e);
}

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./source/configuration/dbConfig");
const authRoutes = require("./source/routes/auth");
const { initWebPush, startScheduler } = require("./source/services/notificationService");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Increase JSON body parser limit to handle large base64 images (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lessons", require("./source/routes/lessons"));
app.use("/api/progress", require("./source/routes/progress"));
app.use("/api/profile", require("./source/routes/profile"));
app.use("/api/leaderboard", require("./source/routes/leaderboard"));
app.use("/api/notifications", require("./source/routes/notifications"));
app.use("/api/chatbot", require("./source/routes/chatbot"));


// Init notifications
initWebPush();
startScheduler();


// Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./source/configuration/dbConfig");
const authRoutes = require("./source/routes/auth");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS for your frontend
app.use(
  cors({
    origin: [
      "https://fluent-flow-six.vercel.app", // frontend URL
      
      "http://localhost:3000"            // optional for local dev
    ],
    credentials: true
  })
);

// Routes
app.use("/api/auth", authRoutes);

// Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

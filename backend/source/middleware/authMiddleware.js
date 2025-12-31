const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const logPath = path.join(__dirname, '..', '..', 'debug_auth.log');
  const log = (msg) => {
      try {
        fs.appendFileSync(logPath, `${new Date().toISOString()} - ${msg}\n`);
      } catch (e) {
          console.error("Log failed", e);
      }
  };

  try {
    // Debug logging
    console.log("--- Auth Middleware Debug ---");
    const secret = process.env.JWT_SECRET;
    const secretLog = secret ? `${secret.substring(0, 5)}... (len: ${secret.length})` : "MISSING";
    const tokenLog = token.substring(0, 20) + "...";
    
    log(`Secret: ${secretLog}`);
    log(`Token: ${tokenLog}`);
    
    console.log(`Secret: ${secretLog}`);
    console.log(`Token: ${tokenLog}`);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    req.user = decoded;
    console.log("req.user set to:", req.user);
    console.log("req.user.id:", req.user.id);
    next();
  } catch (error) {
    const errorMsg = `JWT Verify Error: ${error.message}`;
    console.error(errorMsg);
    log(errorMsg);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

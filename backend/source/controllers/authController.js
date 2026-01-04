const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -----------------------------
// POST /api/auth/signup
// -----------------------------
async function signup(req, res) {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Unique email check
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash & save
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed
    });

    // Sanitize response
    const safeUser = User.toSafeUser(user);

    return res.status(201).json({ message: "User created successfully", user: safeUser });
  } catch (err) {
    console.error("Signup error:", err);
    // Handle unique constraint violation
    if (err.code === '23505') {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

// -----------------------------
// POST /api/auth/login
// -----------------------------
async function login(req, res) {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findByEmail(email);
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Invalid email or password" });

    const safeUser = User.toSafeUser(user);

    // 🔐 Create JWT Token
    const expiresIn = rememberMe ? "7d" : "1h"; // 7 days if "remember me" checked, else 1 hour
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    return res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// -----------------------------
// POST /api/auth/google
// -----------------------------
async function googleLogin(req, res) {
  try {
    const { token, isSignup } = req.body;
    
    console.log("Google Login Attempt:");
    console.log("Received Token length:", token ? token.length : "null");
    console.log("Backend GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Operation Mode:", isSignup ? "Signup" : "Login");

    if (!token) return res.status(400).json({ message: "Token is required" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    let user = await User.findByEmail(email);

    // If user does not exist...
    if (!user) {
      // If performing a Login, reject it
      if (!isSignup) {
        return res.status(404).json({ message: "User not found. Please sign up first." });
      }

      // If Signup, create the user
      user = await User.create({
        firstName: given_name || "User",
        lastName: family_name || "",
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
    } else {
        // If user DOES exist and it's a Signup attempt, reject it
        if (isSignup) {
          return res.status(400).json({ message: "User already registered with this email. Please log in." });
        }
    }

    const safeUser = User.toSafeUser(user);

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Google login successful",
      user: safeUser,
      token: jwtToken
    });
  } catch (err) {
    console.error("Google login error details:", err);
    console.error("Backend configured Client ID:", process.env.GOOGLE_CLIENT_ID);
    return res.status(500).json({ message: "Google login verification failed", error: err.message });
  }
}

module.exports = { signup, login, googleLogin };

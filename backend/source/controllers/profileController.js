const User = require("../models/User");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.query?.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required" });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(userIdInt);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const safeUser = User.toSafeUser(user);
    res.json({ success: true, data: safeUser });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || req.query?.userId;
    const { firstName, lastName, profileImage, phone, dateOfBirth, country, residenceCountry } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required" });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (profileImage !== undefined) updates.profileImage = profileImage;
    if (phone !== undefined) updates.phone = phone;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    if (country !== undefined) updates.country = country;
    if (residenceCountry !== undefined) updates.residenceCountry = residenceCountry;

    const updatedUser = await User.update(userIdInt, updates);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const safeUser = User.toSafeUser(updatedUser);
    res.json({ success: true, data: safeUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};


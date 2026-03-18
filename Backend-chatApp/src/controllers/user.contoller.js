const User = require("../models/user.model");

// 1️⃣ Get My Profile
async function getMyProfile(req, res) {
    try {
        return res.status(200).json({
            user:req.user
        })
    } catch (error) {
        return res.status(404).json({
            message:"user not found"
        })
    }
}

// 2️⃣ Update Profile
// userController.js
async function updateProfile(req, res) {
  try {
    const { username, about } = req.body;
    
    // Ek update object banayein
    let updateData = { username, about };

    // AGAR FILE AAYI HAI (Jo ki aa rahi hai aapke folder mein)
    if (req.file) {
      // Database mein path save karein: /uploads/filename.jpg
      updateData.avatar = `/uploads/${req.file.filename}`;
      console.log("Saving path to DB:", updateData.avatar); 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData }, // $set se ensure hota hai ki sirf ye fields update hon
      { new: true }
    ).select("-otp -otpExpire");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser, // Frontend ko naya data wapas bhejein
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
}
// 3️⃣ Get User By ID (for chat header)
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id)
      .select("username email avatar about online lastSeen");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
    
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
}


// 4️⃣ Get All Users (for sidebar)
async function getAllUsers(req, res) {
  try {
    const myId = req.user._id;

    const users = await User.find({
      _id: { $ne: myId } // exclude me
    })
      .select("username email about avatar online lastSeen")
      .sort({ online: -1, username: 1 }); // online first

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
}

module.exports = {
  getMyProfile,
  updateProfile,
  getUserById,
  getAllUsers,
};
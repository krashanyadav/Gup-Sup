const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authMiddleware(req, res, next) {
  try {
    let token;

    // ✅ 1. Check header (Bearer token)
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

 
    // ✅ 2. Fallback to cookie
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId)
      .select("-otp -otpExpire");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "User not verified",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;
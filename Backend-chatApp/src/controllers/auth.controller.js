const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const SendOTP = require("../services/mail.service");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
//1.send-otp
async function sendOtp(req, res) {
  try {

    const { username, email } = req.body;

    const existingUser = await User.findOne({ email });
   

    // ❌ already registered
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        message: "User already registered, please login"
      });
    }

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    let user;

    if (!existingUser) {

      user = await  User.create({
        username,
        email,
        otp,
        otpExpire
      });

    } else {

      existingUser.otp = otp;
      existingUser.username=username;
      existingUser.otpExpire = otpExpire;

      await existingUser.save();

      user = existingUser;

    }
//send otp within email
    await SendOTP(email, otp);

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to send OTP"
    });

  }
}
//2. register
async function register(req, res) {

  try {

    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // already registered
    if (user.isVerified) {
      return res.status(400).json({
        message: "User already registered"
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Registration successful"
    });

  } catch (error) {

    res.status(500).json({
      message: "Registration failed"
    });

  }

}
//3.login
async function login(req, res) {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password"
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({
      message: "Invalid email or password"
    });
  }
  const jwt = require("jsonwebtoken")
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("token" , token);

  res.json({
    message: "Login successful",
    token
  });

}
//4.logOut
async function logout(req, res){
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}

// router.post("/register", register);
// router.post("/verify-otp", verifyOtp);
// router.post("/login", login);
// router.post("/logout", logout);
module.exports ={sendOtp,register,login,logout}
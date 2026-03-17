const router = require("express").Router();
const  AuthContro = require("../controllers/auth.controller");

router.post("/send-otp", AuthContro.sendOtp);

router.post("/register", AuthContro.register);

router.post("/login", AuthContro.login);

router.post("/logout", AuthContro.logout);
module.exports = router;
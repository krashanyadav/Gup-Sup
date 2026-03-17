const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const profiles  = require("../controllers/user.contoller");
const upload = require("../middlewares/upload.middleware");

// Protected routes
router.get("/me", authMiddleware, profiles.getMyProfile);
//my profile
router.put("/update", authMiddleware, upload.single("avatar"),profiles.updateProfile);
//update profile
router.get("/:id", authMiddleware, profiles.getUserById);
//get user by id
router.get("/", authMiddleware, profiles.getAllUsers); 
//get alluser

module.exports = router;
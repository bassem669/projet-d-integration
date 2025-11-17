const express = require("express");
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const uploadProfile = require("../middleware/uploadProfilePicture");

const {
  getProfile,
  updateProfile,
  changePassword,
  updateProfilePicture
} = require("../controllers/profileController");

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.put("/password", auth, changePassword);
router.post("/picture", auth, uploadProfile.single("profilePicture"), updateProfilePicture);

module.exports = router;

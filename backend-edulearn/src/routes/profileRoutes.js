const express = require("express");
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware'); 
const uploadProfile = require("../middleware/uploadProfilePicture");

const {
  getProfile,
  updateProfile,
  changePassword,
  updateProfilePicture
} = require("../controllers/profileController");

router.get("/", auth, getProfile);
router.put("/", auth, roleMiddleware(['admin', 'enseignant', 'etudiant']), updateProfile);
router.put("/password", auth, roleMiddleware(['admin', 'enseignant', 'etudiant']), changePassword);
router.post(
  "/picture",
  auth,
  roleMiddleware(['admin', 'enseignant', 'etudiant']),
  uploadProfile.single("profilePicture"),
  updateProfilePicture
);

module.exports = router;

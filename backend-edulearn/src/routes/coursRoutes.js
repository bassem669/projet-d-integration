const express = require('express');
const router = express.Router();
const {
  getAllCours,
  getCoursById,
  createCours,
  updateCours,
  deleteCours
} = require('../controllers/coursController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getAllCours);
router.get('/:id', auth, getCoursById);
router.post('/', auth, createCours);
router.put('/:id', auth, updateCours);
router.delete('/:id', auth, deleteCours);

module.exports = router;

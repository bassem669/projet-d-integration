const express = require('express');
const router = express.Router();
const {
  getResourcesByCourse,
  addResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');
const auth = require('../middleware/authMiddleware');

router.get('/:courseId', auth, getResourcesByCourse);
router.post('/', auth, addResource);
router.put('/:id', auth, updateResource);
router.delete('/:id', auth, deleteResource);

module.exports = router;


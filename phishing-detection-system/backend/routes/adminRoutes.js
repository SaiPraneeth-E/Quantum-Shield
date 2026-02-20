const express = require('express');
const {
  getUsers,
  getPredictions,
  getAnalytics,
  manageUser,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect, adminOnly);
router.get('/users', getUsers);
router.get('/predictions', getPredictions);
router.get('/analytics', getAnalytics);
router.patch('/users/:id', manageUser);

module.exports = router;

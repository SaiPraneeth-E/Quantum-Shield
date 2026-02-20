const express = require('express');
const { predict, getHistory } = require('../controllers/predictController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);
router.post('/', predict);
router.get('/history', getHistory);

module.exports = router;

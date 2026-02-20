const User = require('../models/User');
const Prediction = require('../models/Prediction');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch users.' });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const predictions = await Prediction.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch predictions.' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalPredictions, phishingCount, legitimateCount, recentPredictions] =
      await Promise.all([
        User.countDocuments(),
        Prediction.countDocuments(),
        Prediction.countDocuments({ prediction: 'phishing' }),
        Prediction.countDocuments({ prediction: 'legitimate' }),
        Prediction.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'name email').lean(),
      ]);
    res.json({
      totalUsers,
      totalPredictions,
      phishingCount,
      legitimateCount,
      recentActivity: recentPredictions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch analytics.' });
  }
};

exports.manageUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update user.' });
  }
};

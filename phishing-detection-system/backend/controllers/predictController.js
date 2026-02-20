const axios = require('axios');
const Prediction = require('../models/Prediction');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

exports.predict = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: 'URL is required.' });
    }
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      url: url.trim(),
    }, { timeout: 30000 });
    const { prediction, confidence, risk_factors } = response.data;
    const record = await Prediction.create({
      userId: req.user._id,
      inputUrl: url.trim(),
      prediction: prediction === 'phishing' ? 'phishing' : 'legitimate',
      confidence: Number(confidence) || 0,
      riskFactors: risk_factors || [],
    });
    res.json({
      prediction: record.prediction,
      confidence: record.confidence,
      riskFactors: record.riskFactors,
      id: record._id,
      timestamp: record.timestamp,
    });
  } catch (err) {
    if (err.response?.data) {
      return res.status(err.response.status || 500).json({
        message: err.response.data.detail || err.response.data.message || 'ML service error.',
      });
    }
    res.status(500).json({
      message: err.message || 'Prediction failed. Ensure ML service is running.',
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch history.' });
  }
};

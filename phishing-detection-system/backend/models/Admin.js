// Admin is represented by User model with role: 'admin'
// This file can hold admin-specific schema extensions or be used for admin-only collections if needed.
const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

module.exports = {
  AdminLog: mongoose.models.AdminLog || mongoose.model('AdminLog', adminLogSchema),
};

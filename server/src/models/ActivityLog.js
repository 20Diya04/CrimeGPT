const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: String,
  action: String,
  caseNumber: String,
  ip: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);

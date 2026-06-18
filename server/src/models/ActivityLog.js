import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: String,
  action: String,
  caseNumber: String,
  ip: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model('ActivityLog', ActivityLogSchema);

import mongoose from 'mongoose';

const EvidenceSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  label: String,
  type: { type: String, enum: ['image', 'video', 'audio', 'pdf', 'other'], default: 'other' },
  filename: String,
  originalName: String,
  mimeType: String,
  path: String,
  hash: String,
  uploadedBy: String,
  chainOfCustody: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Evidence', EvidenceSchema);

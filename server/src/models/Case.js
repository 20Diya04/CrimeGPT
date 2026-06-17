const mongoose = require('mongoose');

const WitnessSchema = new mongoose.Schema({
  name: String,
  relation: String,
  statement: String,
  contact: String,
});

const EvidenceReferenceSchema = new mongoose.Schema({
  label: String,
  type: String,
  filename: String,
  hash: String,
  uploadedAt: { type: Date, default: Date.now },
  chainOfCustody: [String],
});

const DiaryEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  event: String,
  details: String,
  officer: String,
});

const AuditEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  action: String,
  user: String,
  note: String,
});

const CaseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true, unique: true },
  accused: {
    name: String,
    fatherName: String,
    address: String,
    age: Number,
    gender: String,
  },
  victim: {
    name: String,
    relation: String,
    address: String,
    contact: String,
  },
  witnesses: [WitnessSchema],
  crimeLocation: String,
  incidentDate: Date,
  statement: String,
  legalSections: [String],
  evidence: [EvidenceReferenceSchema],
  status: {
    type: String,
    enum: ['pending', 'arrested', 'chargesheet_filed', 'closed'],
    default: 'pending',
  },
  generatedDocuments: [{ type: String }],
  diary: [DiaryEntrySchema],
  audit: [AuditEntrySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Case', CaseSchema);

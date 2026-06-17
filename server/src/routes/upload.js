const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateHash } = require('../utils/hash');
const Evidence = require('../models/Evidence');
const Case = require('../models/Case');
const authenticate = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();
const uploadPath = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/:caseId', authenticate, upload.single('evidence'), async (req, res) => {
  const caseRecord = await Case.findById(req.params.caseId);
  if (!caseRecord) return res.status(404).json({ message: 'Case not found' });
  const hash = generateHash(fs.readFileSync(req.file.path));
  const evidence = await Evidence.create({
    caseId: caseRecord._id,
    label: req.body.label || req.file.originalname,
    type: req.file.mimetype.split('/')[0],
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    path: req.file.path,
    hash,
    uploadedBy: req.user.email,
    chainOfCustody: [`Uploaded by ${req.user.email} at ${new Date().toISOString()}`],
  });
  caseRecord.evidence.push({ label: evidence.label, type: evidence.type, filename: evidence.originalName, hash, chainOfCustody: evidence.chainOfCustody });
  caseRecord.updatedAt = new Date();
  await caseRecord.save();
  await ActivityLog.create({ user: req.user.email, action: 'upload_evidence', caseNumber: caseRecord.caseNumber, ip: req.ip });
  res.json(evidence);
});

module.exports = router;

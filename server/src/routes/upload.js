import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { generateHash } from '../utils/hash.js';
import Evidence from '../models/Evidence.js';
import Case from '../models/Case.js';
import authenticate from '../middleware/auth.js';
import ActivityLog from '../models/ActivityLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadPath = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

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

export default router;

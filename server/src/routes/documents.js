const express = require('express');
const Case = require('../models/Case');
const { generatePDF, generateDOCX } = require('../utils/documentGenerator');
const authenticate = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

router.use(authenticate);

router.post('/generate', async (req, res) => {
  const { caseId, type, format } = req.body;
  const caseRecord = await Case.findById(caseId);
  if (!caseRecord) return res.status(404).json({ message: 'Case not found' });

  let buffer;
  let mimeType;
  let extension;
  if (format === 'docx') {
    buffer = await generateDOCX(type, caseRecord);
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    extension = 'docx';
  } else {
    buffer = await generatePDF(type, caseRecord);
    mimeType = 'application/pdf';
    extension = 'pdf';
  }

  await ActivityLog.create({ user: req.user.email, action: 'generate_document', caseNumber: caseRecord.caseNumber, ip: req.ip });
  caseRecord.generatedDocuments.push(`${type}.${extension}`);
  await caseRecord.save();

  res.set('Content-Type', mimeType);
  res.set('Content-Disposition', `attachment; filename="${caseRecord.caseNumber}-${type}.${extension}"`);
  res.send(buffer);
});

module.exports = router;

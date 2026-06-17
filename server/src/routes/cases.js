const express = require('express');
const Case = require('../models/Case');
const ActivityLog = require('../models/ActivityLog');
const authenticate = require('../middleware/auth');
const permit = require('../middleware/roles');

const router = express.Router();

const analyzeComplaint = (statement, legalSections) => {
  const rules = [
    { pattern: /theft|robbery|burglary/, sections: ['BNS 303', 'BNS 304', 'BSA 137'] },
    { pattern: /assault|injury|attack/, sections: ['BNS 115', 'BNS 116', 'BSA 159'] },
    { pattern: /murder|kill|homicide/, sections: ['BNS 302', 'BNS 304', 'BSA 132'] },
    { pattern: /fraud|scam|forgery/, sections: ['BNS 420', 'BNS 468', 'IT Act 66'] },
  ];
  const text = `${statement} ${legalSections.join(' ')}`.toLowerCase();
  const matched = rules.filter((rule) => rule.pattern.test(text));
  return matched.length ? matched.flatMap((rule) => rule.sections) : ['BNS 107', 'BNS 108'];
};

router.use(authenticate);

router.post('/', async (req, res) => {
  const record = await Case.create({ ...req.body, caseNumber: `CASE/${Date.now()}` });
  await ActivityLog.create({ user: req.user.email, action: 'create_case', caseNumber: record.caseNumber, ip: req.ip });
  res.json(record);
});

router.get('/', async (req, res) => {
  const { search, status } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { caseNumber: new RegExp(search, 'i') },
      { 'accused.name': new RegExp(search, 'i') },
      { 'victim.name': new RegExp(search, 'i') },
    ];
  }
  if (status) filter.status = status;
  const cases = await Case.find(filter).sort({ createdAt: -1 });
  res.json(cases);
});

router.get('/:id', async (req, res) => {
  const record = await Case.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Case not found' });
  res.json(record);
});

router.put('/:id', permit('supervisor', 'admin'), async (req, res) => {
  const updated = await Case.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
  await ActivityLog.create({ user: req.user.email, action: 'update_case', caseNumber: updated.caseNumber, ip: req.ip });
  res.json(updated);
});

router.post('/:id/diary', async (req, res) => {
  const { event, details } = req.body;
  const record = await Case.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Case not found' });
  record.diary.push({ event, details, officer: req.user.email });
  record.updatedAt = new Date();
  await record.save();
  await ActivityLog.create({ user: req.user.email, action: 'add_diary_entry', caseNumber: record.caseNumber, ip: req.ip });
  res.json(record);
});

router.get('/:id/analysis', async (req, res) => {
  const record = await Case.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Case not found' });
  const suggestions = analyzeComplaint(record.statement, record.legalSections || []);
  res.json({ sections: suggestions, judgments: ['Sample State v. Case (2025)'], crossReferences: ['CrPC 154', 'Evidence Act 65B'] });
});

module.exports = router;

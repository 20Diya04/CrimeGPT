const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashed, role: role || 'officer' });
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
  await ActivityLog.create({ user: user.email, action: 'register', caseNumber: '', ip: req.ip });
  res.json({ token, user: { firstName, lastName, email, role: user.role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
  await ActivityLog.create({ user: user.email, action: 'login', caseNumber: '', ip: req.ip });
  res.json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
});

module.exports = router;

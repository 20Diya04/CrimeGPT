require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Case = require('./models/Case');

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Case.deleteMany();

  const officer = await User.create({
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@gov.in',
    password: '$2a$10$wH1k5eZNcX5v9jFQzv5rnu0uYdv5s6nV5gGq3vW7r0B6S9kF2W2xK',
    role: 'admin',
  });

  await Case.create({
    caseNumber: 'CASE/2025/001',
    accused: { name: 'Rakesh Sharma', fatherName: 'Sunil Sharma', address: 'Sector 8, Ahmedabad', age: 32, gender: 'Male' },
    victim: { name: 'Priya Patel', relation: 'Friend', address: 'Navrangpura, Ahmedabad', contact: '+91-9876543210' },
    witnesses: [{ name: 'Jitendra Singh', relation: 'Bystander', statement: 'I saw the accused take the bag.', contact: '+91-9123456780' }],
    crimeLocation: 'Maninagar Railway Station',
    incidentDate: new Date('2025-04-12'),
    statement: 'Theft of a laptop from a locked carriage while the victim was unloading goods.',
    legalSections: ['BNS 303', 'BSA 137'],
    evidence: [],
    status: 'pending',
    diary: [{ event: 'FIR registered', details: 'Complaint registered at Ahmedabad South Police Station.', officer: 'Inspector Desai' }],
    audit: [{ action: 'seed_import', user: 'system', note: 'Sample case inserted for demo' }],
  });

  console.log('Sample data loaded for CrimeGPT');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

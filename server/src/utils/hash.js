const crypto = require('crypto');

const generateHash = (payload) => {
  return crypto.createHash('sha256').update(payload).digest('hex');
};

module.exports = { generateHash };

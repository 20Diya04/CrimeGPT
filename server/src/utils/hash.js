import crypto from 'crypto';

export const generateHash = (payload) => {
  return crypto.createHash('sha256').update(payload).digest('hex');
};
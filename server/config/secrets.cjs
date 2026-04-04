/**
 * Server Configuration & Secrets Management
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function getSecret(name, fallback = null) {
  const value = process.env[name];
  if (!value && !fallback && process.env.NODE_ENV === 'production') {
    throw new Error(`CRITICAL ERROR: Environment variable ${name} is missing in PRODUCTION.`);
  }
  return value || fallback;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  auth: {
    secret: getSecret('AUTH_SECRET', 'tn-mbnr-auth-secret-dev-only-2025'),
    expiresIn: '24h',
  },
  qr: {
    secret: getSecret('QR_SECRET_KEY', 'tn-mbnr-qr-secret-dev-only-2025'),
    expiryMs: 30000, // 30 seconds
  },
  db: {
    path: process.env.DB_PATH || './tn_mbnr.db',
  },
  ai: {
    geminiKey: getSecret('VITE_GEMINI_API_KEY'), // Shared or distinct key
  }
};

module.exports = config;

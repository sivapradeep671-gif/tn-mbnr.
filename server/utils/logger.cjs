/**
 * Structured Logging Utility
 * In production, this output can be piped to ELK, Datadog, or Cloudwatch.
 */

const log = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta,
    env: process.env.NODE_ENV || 'development',
  };

  if (level === 'ERROR') {
    console.error(JSON.stringify(logEntry));
  } else if (level === 'WARN') {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
};

const logger = {
  info: (msg, meta) => log('INFO', msg, meta),
  warn: (msg, meta) => log('WARN', msg, meta),
  error: (msg, meta) => log('ERROR', msg, meta),
  debug: (msg, meta) => {
    if (process.env.DEBUG || process.env.NODE_ENV !== 'production') {
      log('DEBUG', msg, meta);
    }
  }
};

module.exports = logger;

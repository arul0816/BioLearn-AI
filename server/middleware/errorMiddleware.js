const redactApiKeys = (text) => {
  if (!text || typeof text !== 'string') return text;
  // redact OpenAI keys like sk-********************************
  text = text.replace(/sk-[A-Za-z0-9-_\.]{20,}/g, '[REDACTED_API_KEY]');
  // redact Google API keys starting with AIza
  text = text.replace(/AIza[0-9A-Za-z-_]{10,}/g, '[REDACTED_API_KEY]');
  return text;
};

const errorMiddleware = (err, req, res, next) => {
  // Log full error server-side (no change)
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Resource already exists', field: err.errors[0]?.path });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: redactApiKeys(err.message) });
  }

  // Default server error
  const publicMessage = process.env.NODE_ENV === 'production' ? 'Internal server error' : redactApiKeys(err.message);
  res.status(500).json({ error: publicMessage });
};

module.exports = errorMiddleware;
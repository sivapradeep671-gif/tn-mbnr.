/**
 * Request Validation Middleware (Zod-compatible)
 */
const validateBody = (schema) => (req, res, next) => {
    // If it's a Zod schema
    if (schema.safeParse) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
            return res.status(400).json({ status: 'error', message: 'Validation failed', errors });
        }
        // Use the parsed/sanitized data from Zod
        req.body = result.data;
        return next();
    }

    // Fallback for old manual scheme (if any)
    const errors = [];
    for (const [field, rule] of Object.entries(schema)) {
        const value = req.body[field];
        if (rule.required && !value) {
            errors.push(`${field} is required`);
        }
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ status: 'error', message: 'Validation failed', errors });
    }
    
    next();
};

module.exports = { validateBody };

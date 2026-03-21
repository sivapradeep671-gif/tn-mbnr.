/**
 * Request Validation Middleware
 */
const validateBody = (schema) => (req, res, next) => {
    const errors = [];
    
    for (const [field, rule] of Object.entries(schema)) {
        const value = req.body[field];
        
        if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push(`${field} is required`);
            continue;
        }
        
        if (value !== undefined && value !== null) {
            if (rule.type === 'string' && typeof value !== 'string') {
                errors.push(`${field} must be a string`);
            } else if (rule.type === 'number' && typeof value !== 'number') {
                errors.push(`${field} must be a number`);
            } else if (rule.pattern && !rule.pattern.test(value)) {
                errors.push(`${field} has invalid format`);
            }
        }
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ status: 'error', message: 'Validation failed', errors });
    }
    
    next();
};

module.exports = { validateBody };

const createError = require('http-errors');

/**
 * Authorization Middleware: Require Admin Role
 */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return next(createError(403, 'Access denied. Admin permission required.', { code: 'FORBIDDEN_ROLE' }));
};

module.exports = requireAdmin;
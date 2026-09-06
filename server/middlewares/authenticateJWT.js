const createError = require('http-errors');
const { verifyAccessToken } = require('../services/jwt.service');
const { isAccessTokenBlacklisted } = require('../repositories/token.repository');
const User = require('../models/user.model');

/**
 * Enterprise Access Token Authentication Middleware
 */
const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(createError(401, 'Authentication token missing or invalid format.', { code: 'TOKEN_MISSING' }));
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        // Check if token is blacklisted in Redis
        const isBlacklisted = await isAccessTokenBlacklisted(decoded.jti);
        if (isBlacklisted) {
            return next(createError(401, 'Token has been revoked or logged out.', { code: 'TOKEN_REVOKED' }));
        }

        // Verify active user status in MongoDB
        const user = await User.findById(decoded.sub).select('-password');
        if (!user || user.isDeleted) {
            return next(createError(401, 'User account does not exist or has been disabled.', { code: 'USER_INACTIVE' }));
        }

        // Attach authenticated user payload to req.user
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            jti: decoded.jti,
            exp: decoded.exp
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(createError(401, 'Access Token has expired. Please refresh token.', { code: 'TOKEN_EXPIRED' }));
        }
        if (error.name === 'JsonWebTokenError') {
            return next(createError(401, 'Invalid Access Token signature or structure.', { code: 'TOKEN_INVALID' }));
        }
        return next(createError(401, 'Authentication failed.', { code: 'AUTH_FAILED' }));
    }
};

module.exports = authenticateJWT;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

const ALGORITHM = 'HS256';

/**
 * 1. Generate Access Token for User
 * Returns { token, payload }
 */
exports.generateAccessToken = (user) => {
    const payload = {
        sub: user._id.toString(),
        role: user.role,
        jti: crypto.randomUUID()
    };

    const token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN || '15m'
    });

    return { token, payload };
};

/**
 * 2. Generate Refresh Token for User
 * Returns { token, payload }
 */
exports.generateRefreshToken = (user) => {
    const payload = {
        sub: user._id.toString(),
        jti: crypto.randomUUID()
    };

    const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d'
    });

    return { token, payload };
};

/**
 * 3. Verify Access Token
 */
exports.verifyAccessToken = (token) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
        algorithms: [ALGORITHM]
    });
};

/**
 * 4. Verify Refresh Token
 */
exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        algorithms: [ALGORITHM]
    });
};

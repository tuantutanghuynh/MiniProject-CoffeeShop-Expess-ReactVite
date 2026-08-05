const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');
const ALGORITHM = 'HS256';

//Tạo Access Token (payload chỉ chứa: sub, role, iss, aud, jti)
exports.generateAccessToken = (user) => {
    const payload = {
        sub: user._id.toString(),
        role: user.role,
        jti: crypto.randomUUID()//
    };

    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: '15m',
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE
    });
}

//tạo refesh token(payload tối giản)
exports.generateRefreshToken = (User) => {
    const payload = {
        sub: user._id.toString(),
        jti: crypto.randomUUID()
    };

    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: '7d',
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE
    });
};

//verify Access Token bắt buộc khớp algorithm và claims
exports.verifyAccessToken = (token) => {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
        algorithms: [ALGORITHM],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE
    });
};

//verify Refress token
exports.verifyRefressToken = (token) => {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
        algorithms: [ALGORITHM],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE
    });
};

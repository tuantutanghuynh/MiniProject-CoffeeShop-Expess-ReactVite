const createError = require('http-errors');
const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../services/jwt.service');
const { validationResult } = require('express-validator');
const {
    storeRefreshToken,
    isRefreshTokenValid,
    revokeRefreshToken,
    revokeAllUserRefreshTokens,
    blacklistAccessToken
} = require('../repositories/token.repository');

/**
 * Register User API
 */
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw createError(400, errors.array()[0].msg);
    }
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError(400, 'Email address is already registered on the system.');
    }

    const newUser = await User.create({
        fullname,
        email,
        password,
        role: 'user'
    });

    res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: {
            id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            role: newUser.role
        }
    });
};

/**
 * Login User API
 */
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw createError(400, errors.array()[0].msg);
    }
    const { email, password } = req.body;

    if (!email || !password) {
        throw createError(400, 'Email and password are required.');
    }

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
        throw createError(401, 'Invalid email address or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw createError(401, 'Invalid email address or password.');
    }

    // Generate Access & Refresh Tokens
    const { token: accessToken, payload: accessPayload } = generateAccessToken(user);
    const { token: refreshToken, payload: refreshPayload } = generateRefreshToken(user);

    // Store Refresh Token in Redis
    await storeRefreshToken(user._id.toString(), refreshPayload.jti);

    res.json({
        success: true,
        message: 'Logged in successfully.',
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        }
    });
};

/**
 * Refresh Token Rotation API
 */
exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw createError(400, 'Refresh Token is required in request body.');
    }

    let decoded;
    try {
        // try/catch riêng này KHÔNG bị xoá: nó không chỉ forward lỗi mà còn
        // CHUYỂN ĐỔI lỗi jwt.verify (vd TokenExpiredError) thành 1 createError
        // với message/code khác hẳn — đây là logic nghiệp vụ thật, phải giữ.
        decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
        throw createError(401, 'Refresh Token is invalid or has expired.', { code: 'REFRESH_TOKEN_EXPIRED' });
    }

    const userId = decoded.sub;
    const jti = decoded.jti;

    // Check if Refresh Token is valid in Redis
    const isValid = await isRefreshTokenValid(userId, jti);

    if (!isValid) {
        // Token Reuse Attack Detected! Revoke all refresh tokens of user
        await revokeAllUserRefreshTokens(userId);
        throw createError(401, 'Security alert: Refresh Token reuse detected. Please log in again.', { code: 'TOKEN_REUSE_DETECTED' });
    }

    // Revoke old refresh token (Rotation)
    await revokeRefreshToken(userId, jti);

    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
        throw createError(401, 'User account does not exist or has been disabled.');
    }

    // Generate new Access Token & Refresh Token
    const { token: newAccessToken } = generateAccessToken(user);
    const { token: newRefreshToken, payload: newRefreshPayload } = generateRefreshToken(user);

    // Store new Refresh Token in Redis
    await storeRefreshToken(userId, newRefreshPayload.jti);

    res.json({
        success: true,
        message: 'Tokens refreshed successfully.',
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    });
};

/**
 * Logout User API
 */
exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    const user = req.user;

    // Blacklist current Access Token in Redis
    if (user && user.jti && user.exp) {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const remainingTtl = user.exp - nowInSeconds;
        await blacklistAccessToken(user.jti, remainingTtl);
    }

    // Revoke Refresh Token if provided
    if (refreshToken) {
        try {
            // try/catch riêng này KHÔNG bị xoá: mục đích là CỐ TÌNH nuốt lỗi
            // (refresh token đã hết hạn thì bỏ qua, vẫn cho logout thành công)
            // chứ không phải để forward lỗi — khác hẳn ý nghĩa try/catch cũ.
            const decoded = verifyRefreshToken(refreshToken);
            await revokeRefreshToken(decoded.sub, decoded.jti);
        } catch (err) {
            // Ignore error if refresh token was already expired
        }
    }

    res.json({
        success: true,
        message: 'Logged out successfully.'
    });
};

/**
 * Get Profile API (/me)
 */
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        throw createError(404, 'User profile not found.');
    }

    res.json({
        success: true,
        data: user
    });
};

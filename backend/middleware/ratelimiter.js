const setRateLimit = require('express-rate-limit');
const { STATUS_CODES, STATUS_MESSAGES } = require('../common/Constant');
let rateLimiter = {};

rateLimiter.loginRouteRateLimiter = setRateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: async (req, res) => {
    return res.status(STATUS_CODES.FORBIDDEN_CODE).json({
      code: STATUS_CODES.FORBIDDEN_CODE,
      message: STATUS_MESSAGES.TOO_MANY_REQUEST,
    });
  },
  headers: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

rateLimiter.otpRouteRateLimiter = setRateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: async (req, res) => {
    return res.status(STATUS_CODES.FORBIDDEN_CODE).json({
      code: STATUS_CODES.FORBIDDEN_CODE,
      message: STATUS_MESSAGES.TOO_MANY_REQUEST,
    });
  },
  headers: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

rateLimiter.commonOperationsRouteRateLimiter = setRateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: async (req, res) => {
    return res.status(STATUS_CODES.FORBIDDEN_CODE).json({
      code: STATUS_CODES.FORBIDDEN_CODE,
      message: STATUS_MESSAGES.TOO_MANY_REQUEST,
    });
  },
});

module.exports = rateLimiter;

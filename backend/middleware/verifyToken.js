const jwt = require('jsonwebtoken');
const { createError } = require('../error.js');
const { STATUS_CODES, STATUS_MESSAGES } = require('../common/Constant.js');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  try {
    // Extract the authorization header from the request
    const authorizationHeader = req.headers['authorization'];

    // Check if authorization header exists and has the correct format
    if (!authorizationHeader || !authorizationHeader.startsWith(`Bearer `)) {
      // If not, return an error response
      return next(
        createError(
          STATUS_CODES.INVALID_CODE,
          STATUS_MESSAGES.USER_TOKEN_NOTFOUND
        )
      );
    }

    // Extract the token from the authorization header
    const token = authorizationHeader.slice(7); // Remove 'Bearer ' prefix

    try {
      // Verify the token using the provided JWT secret key
      const decodedUser = jwt.verify(token, process.env.JWTTOKENKEY);

      // Attach the decoded user to the request for further handling in subsequent middleware/routes
      req.user = decodedUser;

      // Continue to the next middleware or route handler
      next();
    } catch (jwtError) {
      // If token verification fails, return an error response
      return next(
        createError(
          STATUS_CODES.INVALID_CODE,
          STATUS_MESSAGES.USER_TOKEN_INVALID
        )
      );
    }
  } catch (error) {
    // Handle any unexpected errors with a generic server error response
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = verifyToken;

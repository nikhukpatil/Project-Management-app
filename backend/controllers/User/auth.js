const mongoose = require('mongoose');
const User = require('../../models/User/User.js');
const { ADMIN_EMAILS } = require('../../envVariables.js');
const { generateAuthToken } = require('../../helpers/generateAuthToken.js');
const { createError } = require('../../error.js');
const {
  STATUS_CODES,
  STATUS_MESSAGES,
  VALIDATIONS,
} = require('../../common/Constant.js');

// Signup
exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return next(
        createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS)
      );
    }

    if (password !== confirmPassword) {
      return next(
        createError(
          STATUS_CODES.BAD_REQUEST,
          STATUS_MESSAGES.PASSWORDS_NOT_MATCH
        )
      );
    }

    if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
      return next(
        createError(
          STATUS_CODES.BAD_REQUEST,
          STATUS_MESSAGES.INVALID_EMAIL_FORMAT
        )
      );
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return next(
        createError(STATUS_CODES.CONFLICT, STATUS_MESSAGES.EMAIL_ALREADY_EXIST)
      );
    }

    const role = ADMIN_EMAILS.includes(email) ? 'Admin' : 'User';
    let newUser = new User({
      fullName,
      email: email,
      password,
      role,
    });

    await newUser.save();

    return res
      .status(STATUS_CODES.OK)
      .json({ success: true, message: STATUS_MESSAGES.SIGNUP_SUCCESSFUL });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle Mongoose validation error
      const errors = Object.values(err.errors).map((el) => el.message);
      return next(createError(400, errors.join('. ')));
    }
    return next(
      createError(
        STATUS_CODES.SERVER_ERROR,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Signin
exports.signin = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return next(
        createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS)
      );
    }

    if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
      return next(
        createError(
          STATUS_CODES.BAD_REQUEST,
          STATUS_MESSAGES.INVALID_EMAIL_FORMAT
        )
      );
    }

    let user = null;

    user = await User.findOne({ email: email }).select('email password');

    if (!user || !(await user.checkCorrectPassword(password))) {
      return next(
        createError(
          STATUS_CODES.INVALID_CODE,
          STATUS_MESSAGES.INVALID_CREDENTIALS
        )
      );
    }
    const token = generateAuthToken(user);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: STATUS_MESSAGES.LOGIN_SUCCESSFUL,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.SERVER_ERROR,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

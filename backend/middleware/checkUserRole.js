const { STATUS_CODES, STATUS_MESSAGES } = require('../common/Constant');

let checkUser = {};

checkUser.admin = async (req, res, next) => {
  try {
    if (req.user.role === 'Admin') {
      return next();
    }
    return res.status(STATUS_CODES.INVALID_CODE).json({
      success: false,
      message: STATUS_MESSAGES.UNAUTHORIZED_REQUEST,
    });
  } catch (error) {
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
checkUser.ProjectManager = async (req, res, next) => {
  try {
    if (req.user.role === 'ProjectManager') {
      return next();
    }
    return res.status(STATUS_CODES.INVALID_CODE).json({
      success: false,
      message: STATUS_MESSAGES.UNAUTHORIZED_REQUEST,
    });
  } catch (error) {
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
checkUser.TeamLead = async (req, res, next) => {
  try {
    if (req.user.role === 'TeamLead') {
      return next();
    }
    return res.status(STATUS_CODES.INVALID_CODE).json({
      success: false,
      message: STATUS_MESSAGES.UNAUTHORIZED_REQUEST,
    });
  } catch (error) {
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = checkUser;

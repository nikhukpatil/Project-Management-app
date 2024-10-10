const User = require('../../models/User/User.js');
const Tasks = require('../../models/Task/Task.js');
const { STATUS_CODES, STATUS_MESSAGES } = require('../../common/Constant.js');
const { createError } = require('../../error.js');
const { generateAuthToken } = require('../../helpers/generateAuthToken.js');

exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return next(
        createError(
          STATUS_CODES.BAD_REQUEST,
          STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        )
      );
    }

    let user = await User.findById(userId).select('-password').lean();

    if (!user) {
      return next(
        createError(STATUS_CODES.INVALID_CODE, STATUS_MESSAGES.USER_NOT_FOUND)
      );
    }

    const token = generateAuthToken(user);

    res.status(STATUS_CODES.OK).json({
      success: true,
      token: `Bearer ${token}`,
      user: {
        _id: user.id,
        fullName: user.fullName,
        role: user.role,
      },
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

exports.getAllUser = async (req, res, next) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return next(
        createError(
          STATUS_CODES.BAD_REQUEST,
          STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        )
      );
    }

    const users = await User.find({}, '_id fullName');

    return res.status(STATUS_CODES.OK).json({
      success: true,
      users,
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

exports.getAllTask = async (req, res, next) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return next(
        createError(
          STATUS_CODES.BAD_REQUEST,
          STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        )
      );
    }

    const tasks = await Tasks.find({ assignee: userId });

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(
      (task) => task.status === 'pending'
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === 'in progress'
    ).length;
    const completedTasks = tasks.filter(
      (task) => task.status === 'completed'
    ).length;
    return res.status(STATUS_CODES.OK).json({
      status: 'success',
      data: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    console.error(error);
    return next(
      createError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

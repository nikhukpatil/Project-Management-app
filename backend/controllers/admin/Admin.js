const User = require('../../models/User/User.js');
const Projects = require('../../models/Projects/Projects.js');
const Tasks = require('../../models/Task/Task.js');
const { createError } = require('../../error.js');
const { STATUS_CODES, STATUS_MESSAGES } = require('../../common/Constant.js');

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({}, '_id fullName email role');

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

exports.updateRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId || !role) {
      return next(
        createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS)
      );
    }

    if (!['Admin', 'ProjectManager', 'TeamLead', 'User'].includes(role)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ success: false, message: STATUS_MESSAGES.INVALID_ROLE });
    }

    await User.findByIdAndUpdate(userId, { role });
    res
      .status(STATUS_CODES.OK)
      .json({ success: true, message: STATUS_MESSAGES.UPDATED_SUCCESSFUL });
  } catch (error) {
    console.log(error);

    return next(
      createError(
        STATUS_CODES.SERVER_ERROR,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    const skip = (pageInt - 1) * limitInt;
    const totalProjects = await Projects.countDocuments();
    const totalPages = Math.ceil(totalProjects / limitInt);
    const projects = await Projects.find().skip(skip).limit(limitInt).lean();

    return res
      .status(STATUS_CODES.OK)
      .json({ success: true, projects, currentPage: pageInt, totalPages });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.SERVER_ERROR,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const task = await Tasks.find().lean();

    return res.status(STATUS_CODES.OK).json({ success: true, task });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.SERVER_ERROR,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.getProjectCounts = async (req, res, next) => {
  try {
    const count = await Projects.countDocuments();

    return res.status(STATUS_CODES.OK).json({ success: true, count });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.SERVER_ERROR,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.getTaskCounts = async (req, res, next) => {
  try {
    const taskCounts = await Tasks.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
    };
    taskCounts.forEach((task) => {
      if (task._id === 'pending') {
        counts.pending = task.count;
      } else if (task._id === 'in progress') {
        counts.inProgress = task.count;
      } else if (task._id === 'completed') {
        counts.completed = task.count;
      }
    });

    return res.status(STATUS_CODES.OK).json({ success: true, counts });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.SERVER_ERROR,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.getUserCount = async (req, res, next) => {
  try {
    const userCounts = await User.aggregate([
      {
        $match: { role: { $ne: 'Admin' } },
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);
    const counts = {
      ProjectManager: 0,
      TeamLead: 0,
      User: 0,
    };
    userCounts.forEach((user) => {
      if (user._id === 'ProjectManager') {
        counts.ProjectManager = user.count;
      } else if (user._id === 'TeamLead') {
        counts.TeamLead = user.count;
      } else if (user._id === 'User') {
        counts.User = user.count;
      }
    });

    return res.status(STATUS_CODES.OK).json({
      success: true,
      counts,
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

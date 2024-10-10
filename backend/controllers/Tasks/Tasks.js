const Tasks = require('../../models/Task/Task.js');
const mongoose = require('mongoose');
const { createError } = require('../../error.js');
const { STATUS_CODES, STATUS_MESSAGES } = require('../../common/Constant.js');

exports.createTask = async (req, res, next) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return next(
        createError(
          STATUS_CODES.UNAUTHORIZED_CODE,
          STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        )
      );
    }

    const { title, description, dueDate, assignee, projectId } = req.body;

    if (!title || !description || !dueDate || !assignee || !projectId) {
      return next(
        createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS)
      );
    }

    const newTask = new Tasks({
      title,
      description,
      createdBy: userId,
      dueDate,
      assignee,
      projectId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const savedTask = await newTask.save();

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: STATUS_MESSAGES.TASK_CREATED,
      task: savedTask,
    });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.BAD_REQUEST,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.getProjectTask = async (req, res, next) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return next(
        createError(
          STATUS_CODES.UNAUTHORIZED_CODE,
          STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        )
      );
    }

    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(
        createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_ID)
      );
    }

    const tasks = await Tasks.find({ projectId: projectId });

    if (!tasks) {
      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: STATUS_MESSAGES.NO_TASK_FOUND,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        tasks,
      },
    });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.BAD_REQUEST,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.getUsersTask = async (req, res, next) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return next(
        createError(
          STATUS_CODES.UNAUTHORIZED_CODE,
          STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        )
      );
    }

    const tasks = await Tasks.find({ assignee: userId });

    if (!tasks) {
      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: STATUS_MESSAGES.NO_TASK_FOUND,
      });
    }
    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        tasks,
      },
    });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.BAD_REQUEST,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return next(
        createError(
          STATUS_CODES.UNAUTHORIZED_CODE,
          STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        )
      );
    }

    const { taskId } = req.params;
    const { status } = req.body;

    const updatedTask = await Tasks.findByIdAndUpdate(
      taskId,
      {
        status: status,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: STATUS_MESSAGES.NO_TASK_FOUND });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: STATUS_MESSAGES.TASK_UPDATED,
      task: updatedTask,
    });
  } catch (error) {
    return next(
      createError(
        STATUS_CODES.BAD_REQUEST,
        STATUS_MESSAGES.INTERNAL_SERVER_ERROR
      )
    );
  }
};

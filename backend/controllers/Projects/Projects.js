const Projects = require('../../models/Projects/Projects.js');
const { createError } = require('../../error.js');
const mongoose = require('mongoose');
const { STATUS_CODES, STATUS_MESSAGES } = require('../../common/Constant.js');

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

exports.createProject = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const { name, description } = req.body;

    if (!userId) {
      return next(
        createError(
          STATUS_CODES.BAD_REQUEST,
          STATUS_MESSAGES.UNAUTHORIZED_REQUEST
        )
      );
    }

    if (!name) {
      return next(
        createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS)
      );
    }

    const newProject = new Projects({
      userId,
      name,
      description,
    });

    await newProject.save();

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: STATUS_MESSAGES.PROJECT_CREATED,
      project: newProject,
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

exports.getUserProjects = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    const skip = (pageInt - 1) * limitInt;
    const totalProjects = await Projects.countDocuments({ userId });
    const totalPages = Math.ceil(totalProjects / limitInt);
    const projects = await Projects.find({ userId })
      .skip(skip)
      .limit(limitInt)
      .lean();

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

exports.getProjectByID = async (req, res, next) => {
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

    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(
        createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_ID)
      );
    }

    if (!projectId) {
      return next(
        createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS)
      );
    }

    let project = await Projects.findById({ _id: projectId }).lean();

    if (!project) {
      return next(
        createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.PROJECT_NOT_FOUND)
      );
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      project,
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

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken.js');

const {
  createProject,
  getAllProjects,
  getUserProjects,
  getProjectByID,
} = require('../../controllers/Projects/Projects.js');

router.get('/', getAllProjects);

// Authenticated routes
router.post('/', verifyToken, createProject);
router.get('/userProjects', verifyToken, getUserProjects);
router.get('/getprojectbyid/:projectId', verifyToken, getProjectByID);

module.exports = router;

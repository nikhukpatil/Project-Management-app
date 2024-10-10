const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');

const {
  createTask,
  getProjectTask,
  getUsersTask,
  updateTask,
} = require('../../controllers/Tasks/Tasks.js');

// Authenticated routes
router.post('/', verifyToken, createTask);
router.get('/getprojecttask/:projectId', verifyToken, getProjectTask);
router.get('/getusertask', verifyToken, getUsersTask);
router.put('/updatetask/:taskId', verifyToken, updateTask);

module.exports = router;

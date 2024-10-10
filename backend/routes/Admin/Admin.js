const express = require('express');
const router = express.Router();
const checkUser = require('../../middleware/checkUserRole.js');
const verifyToken = require('../../middleware/verifyToken.js');

const {
  getAllUser,
  updateRole,
  getAllProjects,
  getAllTasks,
  getProjectCounts,
  getTaskCounts,
  getUserCount,
} = require('../../controllers/admin/Admin.js');

router.get('/', verifyToken, checkUser.admin, getAllUser);
router.put('/updaterole/:userId', verifyToken, checkUser.admin, updateRole);
router.get('/getallprojects', verifyToken, checkUser.admin, getAllProjects);
router.get('/getalltasks', verifyToken, checkUser.admin, getAllTasks);
router.get('/getprojectcounts', verifyToken, checkUser.admin, getProjectCounts);
router.get('/gettaskcounts', verifyToken, checkUser.admin, getTaskCounts);
router.get('/getusercounts', verifyToken, checkUser.admin, getUserCount);

module.exports = router;

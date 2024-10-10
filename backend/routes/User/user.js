const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken.js');
const {
  getUser,
  getAllUser,
  getAllTask,
} = require('../../controllers/User/user.js');

router.get('/', verifyToken, getUser);
router.get('/getAllUser', verifyToken, getAllUser);
router.get('/getalltask', verifyToken, getAllTask);

module.exports = router;

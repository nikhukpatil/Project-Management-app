const express = require('express');
const router = express.Router();
const rateLimiter = require('../../middleware/ratelimiter.js');

const { signup, signin } = require('../../controllers/User/auth.js');

router.post('/signup', signup);
router.post('/signin', rateLimiter.loginRouteRateLimiter, signin);

module.exports = router;

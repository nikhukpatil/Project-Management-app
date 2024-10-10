const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/User/auth.js');
const userRoute = require('./routes/User/user.js');
const projectRoute = require('./routes/Projects/Projects.js');
const taskRoute = require('./routes/Task/Task.js');
const adminRoute = require('./routes/Admin/Admin.js');

dotenv.config({
  path: '.env',
});

const app = express();
app.use(cors());
app.use(express.json());

// API's
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/projects', projectRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/admin', adminRoute);

//middleware for handling error
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

module.exports = { app };

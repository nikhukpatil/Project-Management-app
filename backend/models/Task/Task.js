const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Created by is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Assignee is required'],
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Projects',
    required: [true, 'ProjectId is required'],
  },
});

const Task = mongoose.model('Tasks', taskSchema);

module.exports = Task;

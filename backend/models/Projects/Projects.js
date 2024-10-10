const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
},
{ timestamps: true });

const Project = mongoose.model('Projects', projectSchema);

module.exports = Project;

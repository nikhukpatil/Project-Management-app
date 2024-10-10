const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      validate: [validator.isStrongPassword, 'Password must be strong'],
    },
    role: {
      type: String,
      enum: ['Admin', 'ProjectManager', 'TeamLead', 'User'],
      default: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.checkCorrectPassword = async function (prevPassword) {
  return await bcrypt.compare(prevPassword, this.password);
};

const User = mongoose.model('users', UserSchema);
module.exports = User;

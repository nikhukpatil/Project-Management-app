const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
  CREATED: 201,
  REQ_DATING_ERROR_CODE: 204,
  INVALID_CODE: 401,
  FORBIDDEN_CODE: 403,
  INACTIVATE: 406,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

const STATUS_MESSAGES = {
  REQUIRED_DETAILS: 'Please fill all the necessary details!',
  INVALID_EMAIL_FORMAT: 'Please provide valid email!',
  EMAIL_ALREADY_EXIST: 'Email address already in use!',
  VERIFICATION_CODE_SENT: 'Verification code sent',
  INTERNAL_SERVER_ERROR: 'Internal server error!',
  TOO_MANY_REQUEST: 'Too many request! Try again after 10 minutes!',
  UNAUTHORIZED_REQUEST: 'You are not authorized to perform this request!',
  OTP_EXPIRED: 'OTP has expired or is invalid',
  EMAIL_NOT_VERIFIED: 'Please verify your Email address first',
  OTP_VERIFIED: 'verified successfully',
  PASSWORDS_NOT_MATCH: 'Plese check the password and confirm password!',
  SIGNUP_SUCCESSFUL: 'Signup successful',
  INVALID_CREDENTIALS: 'Invalid Credentials!',
  LOGIN_SUCCESSFUL: 'Login Successfully.',
  USER_NOT_FOUND: 'User not found',
  USER_TOKEN_NOTFOUND: 'You are not logged in, Login now',
  USER_TOKEN_INVALID: 'Your session is expired, Login again',
  PROJECT_CREATED: 'Project successfully created',
  TASK_CREATED: 'Task successfully created',
  PROJECT_NOT_FOUND: 'Project not found',
  INVALID_ID: 'Invalid ID',
  NO_TASK_FOUND: 'No task has been created for this project',
  TASK_UPDATED: 'task updated successfully',
  INVALID_ROLE: 'Invalid role',
  UPDATED_SUCCESSFUL: 'Updated_Successfully',
};

const VALIDATIONS = {
  TOKEN_EXPIRY_TIME: '15d',
  EMAIL_REGEX_VALIDATION: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
};

module.exports = {
  STATUS_CODES,
  STATUS_MESSAGES,
  VALIDATIONS,
};

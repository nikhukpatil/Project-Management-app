const Jwt = require('jsonwebtoken');
const {VALIDATIONS} = require('../common/Constant.js');

const generateAuthToken = (user) => {
  return Jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWTTOKENKEY,
    {
      expiresIn: VALIDATIONS.TOKEN_EXPIRY_TIME,
    }
  );
};

module.exports = {
  generateAuthToken,
};

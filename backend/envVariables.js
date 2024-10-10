require('dotenv').config({
  path: '.env',
});

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',')
  : [];

module.exports = {
  ADMIN_EMAILS,
};

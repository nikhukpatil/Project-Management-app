const API_URL = 'http://localhost:5000';

const token = JSON.parse(localStorage.getItem('token'));

const config = {
  headers: {
    'Content-type': 'application/json',
    Authorization: token,
  },
};

module.exports = {
  config,
  API_URL,
};

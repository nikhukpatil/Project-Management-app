import axios from 'axios';
import { API_URL, config } from '../../../config/config.js';

const signin = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/signin`, userData);
  if (response.data) {
    localStorage.setItem('token', JSON.stringify(response.data.token));
  }
  return response.data;
};

const getUser = async () => {
  const response = await axios.get(`${API_URL}/api/user/`, config);
  if (response.data) {
    localStorage.setItem('token', JSON.stringify(response.data.token));
  }
  return response.data;
};

const signOut = async () => {
  localStorage.removeItem('token');
  return;
};

const authService = {
  signin,
  getUser,
  signOut,
};

export default authService;

import axios from 'axios';
import { API_URL, config } from '../../../config/config.js';

const createProject = async (projectData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/projects`,
      projectData,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const projectService = {
  createProject,
};

export default projectService;

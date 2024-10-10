import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';
import TaskForm from '../projects/TaskForm';
import ProjectForm from '../projects/ProjectForm';
import { useNavigate } from 'react-router-dom';

const ManageProjects = () => {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const limit = 10;
  const navigate = useNavigate();

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const getUserProjects = async (page) => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/api/admin/getallprojects`, {
        params: { page, limit },
        ...config,
      });
      setProjects(response.data.projects);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProjects(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openTaskForm = (project) => {
    setSelectedProject(project);
    setShowTaskForm(true);
  };

  const viewProject = (projectId) => {
    navigate(`/admin-dashboard/view-project/${projectId}`);
  };

  return (
    <div className='sm:p-12 py-10 p-5'>
      <div className=' flex items-center justify-between'>
        <p className=' text-xl'>My Projects</p>
        <button
          onClick={toggleForm}
          className='bg-[#00416A] text-white py-2 px-4 rounded'>
          {showForm ? 'Hide Form' : 'Add New Project'}
        </button>
      </div>
      {showForm && (
        <ProjectForm onClose={toggleForm} getUserProjects={getUserProjects} />
      )}
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div>
          {projects.length > 0 ? (
            <table className=' w-full border-collapse border border-gray-300 mt-4'>
              <thead>
                <tr>
                  <th className='border border-gray-300 p-2'>Title</th>
                  <th className='border border-gray-300 p-2'>Description</th>
                  <th className='border border-gray-300 p-2 w-32'>View Task</th>
                  <th className='border border-gray-300 p-2 w-32'>
                    Create Task
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td className='border border-gray-300 p-2'>
                      {project.name}
                    </td>
                    <td className='border border-gray-300 p-2'>
                      {project.description}
                    </td>
                    <td className='border border-gray-300 p-2'>
                      <button
                        onClick={() => viewProject(project._id)}
                        className='bg-[#00416A] text-white py-1 sm:px-3 rounded text-sm px-1 mx-auto flex'>
                        View
                      </button>
                    </td>
                    <td className='border border-gray-300 p-2'>
                      <button
                        onClick={() => openTaskForm(project)}
                        className='bg-[#00416A] text-white py-1 sm:px-3 px-1 text-sm rounded'>
                        Create Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div> No Projects created.</div>
          )}

          {currentPage < totalPages && (
            <div className='flex justify-between mt-4'>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className='bg-gray-300 text-black py-1 px-2 rounded'>
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className='bg-gray-300 text-black py-1 px-2 rounded'>
                Next
              </button>
            </div>
          )}
        </div>
      )}
      {showTaskForm && (
        <TaskForm
          project={selectedProject}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
};

export default ManageProjects;

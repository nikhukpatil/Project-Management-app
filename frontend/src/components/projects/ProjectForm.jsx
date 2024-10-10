import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../Redux/features/projects/projectSlice.js'; // Import your Redux action here
import { toast } from 'react-toastify';
import ERROR from '../../constants/ErrorConstants.js';

const ProjectForm = ({ onClose, getUserProjects }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createProject(formData)).then((response) => {
        if (response.error) {
          toast.error(ERROR.SOMETHING_WRONG);
        } else {
          setFormData({ name: '', description: '' });
          toast.success(response.payload.message);
          getUserProjects();
          onClose();
        }
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 bg-white text-black rounded shadow-md'>
      <h2 className='text-lg font-bold mb-4'>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-1'>Project Name:</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Description:</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2 w-full'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded'>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
        <button
          type='button'
          onClick={onClose}
          className='bg-gray-300 text-black py-2 px-4 rounded ml-2'>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;

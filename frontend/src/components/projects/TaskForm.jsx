import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';
import { toast } from 'react-toastify';

const TaskForm = ({ project, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/tasks`,
        {
          title,
          description,
          dueDate,
          assignee,
          projectId: project._id,
        },
        config
      );
      toast.success(response.data.message);
      onClose();
    } catch (error) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/user/getAllUser`,
          config
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='fixed inset-0 bg-gray-500 text-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white w-[30%] p-6 rounded-lg'>
        <h2 className='text-xl mb-4'>
          Create Task for Project: {project.name}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block mb-1'>Title</label>
            <input
              type='text'
              className='border w-full p-2'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-1'>Description</label>
            <textarea
              className='border w-full p-2'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-1'>Due Date</label>
            <input
              type='date'
              className='border w-full p-2'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-1'>Assignee</label>
            <select
              className='border w-full p-2'
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              required>
              <option value=''>Select Assignee</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>

          {error && <p className='text-red-500'>{error}</p>}

          <div className='flex justify-between'>
            <button
              type='submit'
              className='bg-[#00416A] text-white py-2 px-4 rounded'
              disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 text-black py-2 px-4 rounded'>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

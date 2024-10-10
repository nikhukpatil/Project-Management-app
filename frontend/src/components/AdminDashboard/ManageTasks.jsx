import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsersTasks = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/admin/getalltasks`,
          config
        );

        console.log(response);
        setTasks(response.data.task);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        // Fetch all users
        const userResponse = await axios.get(
          `${API_URL}/api/user/getAllUser`,
          config
        );
        setUsers(userResponse.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsersTasks();
    fetchUsers();
  }, []);

  const getAssigneeName = (assigneeId) => {
    const assignee = users.find((user) => user._id === assigneeId);
    return assignee ? assignee.fullName : 'Unassigned';
  };

  return (
    <div className='sm:p-12 py-10 px-5'>
      <h1 className='text-2xl'>OverAll Tasks</h1>

      {/* Display cards for small screens and table for larger screens */}
      <div className='my-5 md:hidden'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className='border rounded p-4 mb-4 shadow-md'>
              <h2 className='text-lg font-bold'>{task.title}</h2>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Assigned To:</strong> {getAssigneeName(task.assignee)}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <p>
                <strong>Due Date:</strong>{' '}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong>{' '}
                {new Date(task.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className='text-center'>
            <p className='px-4 py-2'>No task to show.</p>
          </div>
        )}
      </div>

      <div className='hidden md:block my-5'>
        {tasks.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full border-collapse'>
              <thead>
                <tr className='bg-gray-200'>
                  <th className='border px-4 py-2'>Title</th>
                  <th className='border px-4 py-2'>Description</th>
                  <th className='border px-4 py-2'>Assigned To</th>
                  <th className='border px-4 py-2'>Status</th>
                  <th className='border px-4 py-2'>Due Date</th>
                  <th className='border px-4 py-2'>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className='text-center'>
                    <td className='border px-4 py-2'>{task.title}</td>
                    <td className='border px-4 py-2'>{task.description}</td>
                    <td className='border px-4 py-2'>
                      {getAssigneeName(task.assignee)}
                    </td>
                    <td className='border px-4 py-2'>{task.status}</td>
                    <td className='border px-4 py-2'>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className='border px-4 py-2'>
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center'>
            <p className='px-4 py-2'>No task to show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTasks;

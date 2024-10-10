import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getUsersTasks = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/admin/getalltasks`,
          config
        );

        setTasks(response.data.data.tasks);
      } catch (error) {}
    };
    getUsersTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/updatetask/${taskId}`,
        { status: newStatus },
        config
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className='sm:p-12 py-10 px-5'>
      <h1 className='text-2xl'>My Tasks</h1>

      <div className='my-5'>
        {tasks.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full border-collapse'>
              <thead>
                <tr>
                  <th className='border px-4 py-2'>Title</th>
                  <th className='border px-4 py-2'>Description</th>
                  <th className='border px-4 py-2'>Status</th>
                  <th className='border px-4 py-2'>Due Date</th>
                  <th className='border px-4 py-2'>Updated At</th>
                  <th className='border px-4 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className='text-center'>
                    <td className='border px-4 py-2'>{task.title}</td>
                    <td className='border px-4 py-2'>{task.description}</td>
                    <td className='border px-4 py-2'>{task.status}</td>
                    <td className='border px-4 py-2'>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className='border px-4 py-2'>
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </td>
                    <td className='border px-4 py-2 text-black'>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }>
                        <option value='pending'>Pending</option>
                        <option value='in progress'>In Progress</option>
                        <option value='completed'>Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <tr>
            <td className='px-4 py-2' colSpan='6'>
              No task to show.
            </td>
          </tr>
        )}
      </div>
    </div>
  );
};

export default ViewTasks;

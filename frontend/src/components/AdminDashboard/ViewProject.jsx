import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL, config } from '../../config/config';
import { toast } from 'react-toastify';
import ERROR from '../../constants/ErrorConstants';

const ViewProject = () => {
  const { projectId } = useParams();
  const id = projectId;

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const getProject = async () => {
      try {
        await axios.get(`${API_URL}/api/projects/getprojectbyid/${id}`, config);

        const taskResponse = await axios.get(
          `${API_URL}/api/tasks/getprojecttask/${id}`,
          config
        );
        setTasks(taskResponse.data.data.tasks);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(ERROR.SOMETHING_WRONG);
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
    getProject();
    fetchUsers();
  }, [id]);

  const getAssigneeName = (assigneeId) => {
    const assignee = users.find((user) => user._id === assigneeId);

    return assignee ? assignee.fullName : 'Unassigned';
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=' p-12 text-black'>
      <div className=' my-5'>
        <h2 className=' text-xl'>Projects Task Details</h2>

        <table className=' w-full'>
          <thead>
            <tr>
              <th className='border px-4 py-2'>Title</th>
              <th className='border px-4 py-2'>Description</th>
              <th className='border px-4 py-2'>Assigned To</th>
              <th className='border px-4 py-2'>Status</th>
              <th className='border px-4 py-2'>Due Date</th>
              <th className='border px-4 py-2'>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} className=' text-center'>
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
              ))
            ) : (
              <tr>
                <td className='px-4 py-2' colSpan='6'>
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProject;

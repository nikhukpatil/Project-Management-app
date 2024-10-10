import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/common/InputField';
import {
  signin,
  getUser,
  resetMessage,
} from '../Redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import VALIDATIONS from '../constants/ValidationsConstants';
import ERROR from '../constants/ErrorConstants';

const inputFields = [
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    name: 'email',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    name: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
];

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'email' ? value.toLowerCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!VALIDATIONS.EMAIL_REGEX.test(formData.email)) {
      return toast.error(ERROR.INVALID_EMAIL);
    }

    let email = formData.email;
    let password = formData.password;
    dispatch(signin({ email, password })).then((response) => {
      if (response.error) {
        toast.error(response.payload);
        dispatch(resetMessage());
        setLoading(false);
      } else {
        toast.success(response.payload.message);
        dispatch(getUser());
        setLoading(false);
        dispatch(resetMessage());
        window.location.href = '/';
      }
    });
  };

  return (
    <div className='flex justify-center items-center h-screen text-black px-5'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md bg-white p-6 rounded shadow-md'>
        {loading && (
          <div className='fixed inset-0 overflow-hidden w-full h-full flex justify-center items-center z-50  bg-[#00000040]'>
            <div className='w-20 h-20'>Loading..</div>
          </div>
        )}
        <h1 className='text-2xl mb-4 text-center'>Signin</h1>
        {inputFields.map((field) => (
          <InputField
            key={field.id}
            fields={field}
            value={formData[field.name]}
            onChange={handleChange}
          />
        ))}
        <p className=' text-sm text-end'>
          Don't have an account?{' '}
          <span className=' text-blue-400'>
            <Link to='/signup'>Signup</Link>
          </span>
        </p>
        <button
          type='submit'
          className='w-full bg-[#00416A] text-white py-2 px-4 rounded mt-4'>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signin;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/common/InputField';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config/config';
import ERROR from '../constants/ErrorConstants.js';
import VALIDATIONS from '../constants/ValidationsConstants.js';

const inputFields = [
  {
    id: 'fullName',
    label: 'Full Name',
    type: 'text',
    name: 'fullName',
    placeholder: 'Enter your full name',
    required: true,
  },
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
  {
    id: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'Confirm your password',
    required: true,
  },
];

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'email' ? value.toLowerCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Check password strength if the password field is being updated
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSymbols = /[-+_!@#$%^&*.,?]/.test(password);
    const hasMinimumLength = password.length >= 8;

    if (
      hasMinimumLength &&
      hasLowerCase &&
      hasUpperCase &&
      hasDigits &&
      hasSymbols
    ) {
      setPasswordStrength('strong');
    } else if (
      hasMinimumLength &&
      (hasLowerCase || hasUpperCase || hasDigits || hasSymbols)
    ) {
      setPasswordStrength('moderate');
    } else {
      setPasswordStrength('weak');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation: Check for empty fields
    for (const key in formData) {
      if (!formData[key]) {
        return toast.error(
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required!`
        );
      }
    }

    // Additional validation for password match
    if (formData.password !== formData.confirmPassword) {
      return toast.error(ERROR.PASSWORD_NOT_MATCH);
    }

    if (!VALIDATIONS.EMAIL_REGEX.test(formData.email)) {
      return toast.error(ERROR.INVALID_EMAIL);
    }

    // Additional validation for strong password
    if (passwordStrength !== 'strong') {
      return toast.error(ERROR.WEAK_PASSWORD);
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, formData);
      setLoading(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      navigate('/signin');
      window.scrollTo(0, 0);
      toast.success(response.data.message);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen px-5 text-black'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md bg-white p-6 rounded shadow-md'>
        {loading && (
          <div className='fixed inset-0 overflow-hidden w-full h-full flex justify-center items-center z-50  bg-[#00000040]'>
            <div className='w-20 h-20'>Loading..</div>
          </div>
        )}
        <h1 className='text-2xl mb-4 text-center'>Sign Up</h1>
        {inputFields.map((field) => (
          <InputField
            key={field.id}
            fields={field}
            value={formData[field.name]}
            onChange={handleChange}
          />
        ))}
        {formData.password && (
          <div
            className={`mt-2 ${
              passwordStrength === 'strong'
                ? 'text-green-600'
                : passwordStrength === 'moderate'
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
            Password Strength:{' '}
            {passwordStrength.charAt(0).toUpperCase() +
              passwordStrength.slice(1)}
          </div>
        )}
        <p className=' text-sm text-end'>
          Already have an account?{' '}
          <span className=' text-blue-400'>
            <Link to='/signin'>Signin</Link>
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

export default Signup;

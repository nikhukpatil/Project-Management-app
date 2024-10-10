import React, { useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

const InputField = ({ fields, value, onChange }) => {
  const { label, type, name, placeholder, required } = fields;
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-gray-700' htmlFor={name}>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <div className='relative'>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          id={name}
          name={name}
          value={value} // Use the value prop passed down
          onChange={onChange} // Use the onChange prop passed down
          placeholder={placeholder}
          required={required}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        />
        {type === 'password' && (
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'>
            {showPassword ? (
              <IoEye className='text-gray-500' size={20} />
            ) : (
              <IoEyeOff className='text-gray-500' size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;

import React from 'react';

const Input = ({title, placeholder}) => {
  return (
    <div className="flex flex-col my-5">
      <label className="text-lg font-bold mb-2">{title}</label>
      <input
        type="text"
        placeholder={placeholder ?? 'Enter the travel destination'}
        className="p-4 border-none rounded-xl bg-gray-100 text-gray-600 w-full placeholder-gray-400"
      />
    </div>
  );
};

export default Input;
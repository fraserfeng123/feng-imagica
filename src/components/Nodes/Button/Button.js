import React from 'react';

const Button = ({children}) => {
  return (
    <button
      className="w-full px-4 py-2 bg-gray-50 text-black rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      {children ?? "Submit"}
    </button>
  );
};

export default Button;
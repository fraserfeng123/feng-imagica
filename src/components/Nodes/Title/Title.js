import React from 'react';

const Title = ({text}) => {
  return (
    <div className="flex justify-center items-center pb-2">
      <h1 className="text-3xl font-bold text-gray-800 text-center">{text}</h1>
    </div>
  );
};

export default Title;
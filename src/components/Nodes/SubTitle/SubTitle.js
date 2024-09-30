import React from 'react';

const SubTitle = ({text}) => {
  return (
    <div className="flex justify-center items-center pb-2">
      <h1 className="text-1xl text-gray-800 text-center">{text}</h1>
    </div>
  );
};

export default SubTitle;
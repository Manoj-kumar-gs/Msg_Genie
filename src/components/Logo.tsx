'use client';
import React from 'react';

type MsgGenieProps = {
  onClick?: () => void;
};

const MsgGenie: React.FC<MsgGenieProps> = ({ onClick }) => {
  return (
    <div
      className="text-[22px] md:text-2xl font-bold w-fit cursor-pointer"
      onClick={onClick}
    >
      <span className='text-indigo-600'>&lt;</span>MsgGenie <span className='text-indigo-600'>/&gt;</span>
    </div>
  );
};
 
export default MsgGenie;

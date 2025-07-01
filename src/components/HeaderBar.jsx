// components/HeaderBar.js
import React from 'react';
import { Trophy, Zap } from 'lucide-react';

const HeaderBar = ({ 
  title, 
  score, 
  onHomeClick, 
  homeIcon: HomeIcon
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-black bg-opacity-20 shadow-lg text-white">
      <button
        onClick={onHomeClick}
        className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-2 mb-3 sm:mb-0 hover:bg-opacity-30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white active:scale-95"
      >
        <HomeIcon className="w-5 h-5" />
      </button>
      
      <h2 className="text-2xl md:text-3xl font-bold text-center my-3 sm:my-0">{title}</h2>
      
      <div className="flex items-center space-x-4 bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 mr-1 text-yellow-300" />
          <span className="font-semibold">{score}</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
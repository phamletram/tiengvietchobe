// components/Header.js
import React from 'react';
import { Home, Trophy, Heart } from 'lucide-react';

const Header = ({ title, score, lives, onHomeClick, showHome = true }) => (
  <div className="flex justify-between items-center p-4 text-white">
    {showHome ? (
      <button
        onClick={onHomeClick}
        className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 hover:bg-opacity-30 transition-all"
      >
        <Home className="w-5 h-5 mr-2" />
        Trang chủ
      </button>
    ) : (
      <div></div>
    )}
    
    <h2 className="text-2xl font-bold">{title}</h2>
    
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Trophy className="w-5 h-5 mr-1" />
        <span>{score}</span>
      </div>
      <div className="flex items-center">
        <Heart className="w-5 h-5 mr-1 text-red-300" />
        <span>{lives}</span>
      </div>
    </div>
  </div>
);

export default Header;
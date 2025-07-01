// components/MenuScreen.js
import React from 'react';
import { Trophy, Zap } from 'lucide-react';
import PageCounter from './PageCounter.jsx';

const MenuScreen = ({ 
  lessons, 
  score, 
  lives, 
  setCurrentLesson, 
  setGameState 
}) => {
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 font-inter">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
          Học Tiếng Việt
        </h1>
        <p className="text-xl md:text-2xl text-white drop-shadow-md opacity-90">Cùng nhau vui học!!!</p>
      </div>
      
      
        <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-6 max-w-7xl w-full">
          
            <button
              
              onClick={() => {
              
                setGameState('topic');
              }}
              className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
            >
            <div className="text-7xl mb-4 text-center group-hover:animate-bounce-y">
                <span role="img" aria-label="vocabulary">📚</span>
            </div>
              <h3 className="text-2xl sm:text-2xl font-bold text-gray-800 text-center mb-1">Từ vựng theo chủ đề</h3>
              
            </button>
            <button
              onClick={() => {
              
                setGameState('game');
              }}
              className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
            >
              <div className="text-7xl mb-4 text-center group-hover:animate-bounce-y">
                
                <span role="img" aria-label="game">📟</span>

              </div>
              <h3 className="text-2xl sm:text-2xl font-bold text-gray-800 text-center mb-1">Trò chơi lật thẻ</h3>
              
              
            </button>

            <button
              onClick={() => {
              
                setGameState('puzzlegame');
              }}
              className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
            >
              <div className="text-7xl mb-4 text-center group-hover:animate-bounce-y">
                
                <span role="img" aria-label="game">🧩</span>

              </div>
              <h3 className="text-2xl sm:text-2xl font-bold text-gray-800 text-center mb-1">Game xếp chữ</h3>
              
              
            </button>

            <button
              onClick={() => {
              
                setGameState('alphabet');
              }}
              className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
            >
              <div className="text-7xl mb-4 text-center group-hover:animate-bounce-y">
                
                <span role="img" aria-label="alphabet">🔤</span>

              </div>
              <h3 className="text-2xl sm:text-2xl font-bold text-gray-800 text-center mb-1">Học chữ cái</h3>
              
              
            </button>
          
        </div>
     
      
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center space-x-6 text-white">
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
            <Trophy className="w-6 h-6 mr-2 text-yellow-300" />
            <span className="text-xl font-semibold">Điểm: {score}</span>
          </div>
          
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
            <PageCounter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
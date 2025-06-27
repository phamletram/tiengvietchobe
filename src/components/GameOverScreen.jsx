// components/GameOverScreen.js
import React from 'react';

const GameOverScreen = ({ resetGame }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 font-inter">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-lg w-full text-center transform transition-transform duration-300 ease-in-out hover:scale-[1.01]">
        <div className="text-8xl mb-6 animate-bounce">😢</div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Hết mạng rồi!</h2>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">Đừng lo, hãy thử lại nhé!</p>
        
        <button
          onClick={resetGame}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
        >
          Chơi lại
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
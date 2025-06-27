// components/CompleteScreen.js
import React from 'react';
import { Star } from 'lucide-react';

const CompleteScreen = ({
  currentLesson,
  score,
  lessons,
  setCurrentWord,
  setGameState,
  resetGame
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 font-inter">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-lg w-full text-center transform transition-transform duration-300 ease-in-out hover:scale-[1.01]">
        <div className="text-8xl mb-6 animate-spin-slow">🏆</div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Hoàn thành!</h2>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Bạn đã hoàn thành bài học "<span className="text-indigo-600 font-semibold">{lessons[currentLesson].title}</span>"
        </p>
        
        <div className="bg-yellow-100 rounded-2xl p-6 mb-8 border-2 border-yellow-200 shadow-inner">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-9 h-9 text-yellow-500 mr-3 animate-pulse" />
            <span className="text-4xl font-extrabold text-yellow-700">{score}</span>
          </div>
          <p className="text-gray-700 text-lg font-medium">Điểm số của bạn</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              setCurrentWord(0);
              setGameState('lesson');
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
          >
            Học lại
          </button>
          
          <button
            onClick={() => {
              //resetGame();
              setGameState('menu');
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-3 text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
          >
            Chọn bài khác
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteScreen;
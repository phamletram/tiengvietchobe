// components/MenuScreen.js
import React from 'react';
import { Trophy, Zap ,Home} from 'lucide-react';
import PageCounter from './PageCounter.jsx';
import HeaderBar from './HeaderBar.jsx';
const MenuScreen = ({ 
  lessons, 
  score, 
  lives, 
  setCurrentLesson, 
  setGameState 
}) => {
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 font-inter">
      <HeaderBar
        title="Học từ vựng theo chủ đề"
        score={score}
        lives={lives}
        onHomeClick={() => setGameState('menu')}
        homeIcon={Home}
      />
      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl w-full  p-6 sm:p-8">
        {lessons.map((lesson, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentLesson(index);
              setGameState('lesson');
            }}
            className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
          >
            <div className="text-7xl mb-4 text-center group-hover:animate-bounce-y">{lesson.icon}</div>
            <h3 className="text-2xl sm:text-2xl font-bold text-gray-800 text-center mb-1">{lesson.title}</h3>
            <p className="text-gray-600 text-center text-sm">{lesson.words.length} từ vựng</p>
          </button>
        ))}
      </div>
      
      
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-6 text-white">
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
            <Trophy className="w-6 h-6 mr-2 text-yellow-300" />
            <span className="text-xl font-semibold">Điểm: {score}</span>
          </div>
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
            <Zap className="w-6 h-6 mr-2 text-yellow-300"  />
            <span className="text-xl font-semibold">{lives} cơ hội!</span>
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
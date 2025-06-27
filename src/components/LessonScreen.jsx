// components/LessonScreen.js
import React from 'react';
import { Volume2, Star, ArrowLeft, ArrowRight, Home, Trophy, Zap } from 'lucide-react';
import WordCard from './WordCard.jsx';
import HeaderBar from './HeaderBar.jsx';

const LessonScreen = ({
  currentLesson,
  currentWord,
  score,
  lives,
  lessons,
  setCurrentWord,
  setGameState,
  playSound
}) => {
  const word = lessons[currentLesson].words[currentWord];
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 font-inter">
      <HeaderBar
        title={lessons[currentLesson].title}
        score={score}
        lives={lives}
        onHomeClick={() => setGameState('menu')}
        homeIcon={Home}
        homeText="Trang chủ"
      />

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
        <WordCard
          word={word}
          onPlaySound={() => playSound(word.vietnamese)}
        />
        
        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-6 w-full max-w-lg">
          <button
            onClick={() => setCurrentWord(Math.max(0, currentWord - 1))}
            disabled={currentWord === 0}
            className="flex items-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-5 py-3 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-95 text-gray-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Trước
          </button>
          
          <span className="text-white text-lg font-medium bg-black bg-opacity-20 rounded-full px-4 py-2">
            {currentWord + 1} / {lessons[currentLesson].words.length}
          </span>
          
          {currentWord < lessons[currentLesson].words.length - 1 ? (
            <button
              onClick={() => setCurrentWord(currentWord + 1)}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-3 transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 font-semibold"
            >
              Tiếp
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentWord(0);
                setGameState('quiz');
                setLives(3);
              }}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-3 transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-95 font-semibold"
            >
              Kiểm tra
              <Star className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonScreen;
// components/Navigation.js
import React from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

const Navigation = ({ 
  currentWord, 
  totalWords, 
  onPrevious, 
  onNext, 
  onQuiz, 
  isLastWord 
}) => (
  <div className="flex justify-between items-center mt-6">
    <button
      onClick={onPrevious}
      disabled={currentWord === 0}
      className="flex items-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-full px-4 py-2 transition-all"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Trước
    </button>
    
    <span className="text-gray-600">
      {currentWord + 1} / {totalWords}
    </span>
    
    {isLastWord ? (
      <button
        onClick={onQuiz}
        className="flex items-center bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 transition-all"
      >
        Kiểm tra
        <Star className="w-5 h-5 ml-2" />
      </button>
    ) : (
      <button
        onClick={onNext}
        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 transition-all"
      >
        Tiếp
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    )}
  </div>
);

export default Navigation;
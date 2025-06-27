// components/QuizContent.js
import React from 'react';

const QuizContent = ({
  word,
  options,
  currentWord,
  totalWords,
  handleQuizAnswer,
  selectedAnswer,
  showResult
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-2xl w-full text-center">
      <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 leading-snug">
        Từ nào có nghĩa là "<span className="text-blue-600">{word.english}</span>"?
      </h3>
      
      <div className="text-7xl md:text-8xl mb-10 animate-fade-in">
        {word.image.startsWith('/') ? (
          <div className="flex justify-center">
            <img 
              src={word.image} 
              alt={word.name || 'Image'} 
              className="w-32 h-32 object-cover"
            />
          </div>
        ) : (
          <div className="text-center">
            {word.image}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && handleQuizAnswer(option)}
            disabled={showResult}
            className={`
              p-4 sm:p-5 rounded-2xl text-2xl font-bold transition-all transform shadow-md
              ${
                showResult
                  ? option.vietnamese === word.vietnamese
                    ? 'bg-green-500 text-white animate-pop'
                    : selectedAnswer?.vietnamese === option.vietnamese
                    ? 'bg-red-500 text-white animate-shake'
                    : 'bg-gray-200 text-gray-600 opacity-60'
                  : 'bg-blue-100 hover:bg-blue-200 text-gray-800 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95'
              }
            `}
          >
            {option.vietnamese}
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className={`text-2xl font-bold p-4 rounded-2xl animate-fade-in-up ${
          selectedAnswer?.vietnamese === word.vietnamese
            ? 'bg-green-100 text-green-800 shadow-inner'
            : 'bg-red-100 text-red-800 shadow-inner'
        }`}>
          {selectedAnswer?.vietnamese === word.vietnamese 
            ? '🎉 Đúng rồi!' 
            : `😢 Sai rồi! Từ đúng là "${word.vietnamese}".`}
        </div>
      )}
      
      <div className="mt-8 text-gray-600 text-lg">
        Câu {currentWord + 1} / {totalWords}
      </div>
    </div>
  );
};

export default QuizContent;
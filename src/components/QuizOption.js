// components/QuizOption.js
import React from 'react';

const QuizOption = ({ option, isCorrect, isSelected, isRevealed, onClick }) => {
  let className = "p-4 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 ";
  
  if (isRevealed) {
    if (isCorrect) {
      className += "bg-green-500 text-white";
    } else if (isSelected) {
      className += "bg-red-500 text-white";
    } else {
      className += "bg-gray-200 text-gray-600";
    }
  } else {
    className += "bg-blue-100 hover:bg-blue-200 text-gray-800";
  }

  return (
    <button
      onClick={onClick}
      disabled={isRevealed}
      className={className}
    >
      {option.vietnamese}
    </button>
  );
};

export default QuizOption;
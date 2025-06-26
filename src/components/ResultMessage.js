// components/ResultMessage.js
import React from 'react';

const ResultMessage = ({ isCorrect }) => (
  <div className={`text-2xl font-bold p-4 rounded-2xl ${
    isCorrect
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }`}>
    {isCorrect ? '🎉 Đúng rồi!' : '😢 Sai rồi!'}
  </div>
);

export default ResultMessage;
// components/LessonCard.js
import React from 'react';

const LessonCard = ({ lesson, index, onSelect }) => (
  <div
    onClick={() => onSelect(index)}
    className="bg-white rounded-2xl p-6 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
  >
    <div className="text-6xl mb-4 text-center">{lesson.icon}</div>
    <h3 className="text-2xl font-bold text-gray-800 text-center">{lesson.title}</h3>
    <p className="text-gray-600 text-center mt-2">{lesson.words.length} từ vựng</p>
  </div>
);

export default LessonCard;
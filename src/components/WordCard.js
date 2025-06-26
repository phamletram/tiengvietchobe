// components/WordCard.js
import React from 'react';
import { Volume2 } from 'lucide-react';

const WordCard = ({ word, onPlaySound }) => (
  <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full text-center">
    <div className="text-8xl mb-6">{word.image}</div>
    <h3 className="text-4xl font-bold text-gray-800 mb-2">{word.vietnamese}</h3>
    <p className="text-xl text-gray-500 mb-6">{word.english}</p>
    
    <button
      onClick={() => onPlaySound(word.vietnamese)}
      className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 mb-6 transition-all transform hover:scale-110 shadow-lg"
    >
      <Volume2 className="w-8 h-8" />
    </button>
  </div>
);

export default WordCard;
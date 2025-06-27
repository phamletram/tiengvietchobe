// components/WordCard.js
import React from 'react';
import { Volume2 } from 'lucide-react';

const WordCard = ({ word, onPlaySound }) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-lg w-full text-center transform transition-transform duration-300 ease-in-out hover:scale-[1.01]">
      <div className="text-8xl mb-6">
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
      
      <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">{word.vietnamese}</h3>
      <p className="text-xl md:text-2xl text-gray-500 mb-6">{word.english}</p>
      
      <button
        onClick={onPlaySound}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 md:p-5 mb-8 transition-all transform hover:scale-110 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
        aria-label="Play pronunciation"
      >
        <Volume2 className="w-8 h-8 md:w-9 md:h-9" />
      </button>
    </div>
  );
};

export default WordCard;
// screens/MenuScreen.js
import React from 'react';
import { Trophy, Heart } from 'lucide-react';
import LessonCard from '../components/LessonCard';

const MenuScreen = ({ lessons, score, lives, onLessonSelect }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex flex-col items-center justify-center p-4">
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
        Học Tiếng Việt 🇻🇳
      </h1>
      <p className="text-xl text-white drop-shadow">Vui học cùng bé!</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
      {lessons.map((lesson, index) => (
        <LessonCard
          key={index}
          lesson={lesson}
          index={index}
          onSelect={onLessonSelect}
        />
      ))}
    </div>
    
    <div className="mt-8 text-center">
      <div className="flex items-center justify-center space-x-4 text-white">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 mr-2" />
          <span className="text-lg">Điểm: {score}</span>
        </div>
        <div className="flex items-center">
          <Heart className="w-6 h-6 mr-2 text-red-300" />
          <span className="text-lg">Mạng: {lives}</span>
        </div>
      </div>
    </div>
  </div>
);

export default MenuScreen;
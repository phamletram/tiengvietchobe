// screens/QuizScreen.js
import React from 'react';
import { ArrowLeft, Trophy, Heart } from 'lucide-react';
import QuizOption from '../components/QuizOption';
import ResultMessage from '../components/ResultMessage';

const QuizScreen = ({ 
  lesson, 
  currentWord, 
  score, 
  lives, 
  quizOptions, 
  selectedAnswer, 
  showResult, 
  onBack, 
  onAnswerSelect 
}) => {
  const word = lesson.words[currentWord];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <button
          onClick={onBack}
          className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 hover:bg-opacity-30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Học lại
        </button>
        <h2 className="text-2xl font-bold">Kiểm tra - {lesson.title}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-1" />
            <span>{score}</span>
          </div>
          <div className="flex items-center">
            <Heart className="w-5 h-5 mr-1 text-
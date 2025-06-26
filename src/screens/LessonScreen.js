// screens/LessonScreen.js
import React from 'react';
import Header from '../components/Header';
import WordCard from '../components/WordCard';
import Navigation from '../components/Navigation';

const LessonScreen = ({ 
  lesson, 
  currentWord, 
  score, 
  lives, 
  onHome, 
  onPrevious, 
  onNext, 
  onQuiz, 
  onPlaySound 
}) => {
  const word = lesson.words[currentWord];
  const isLastWord = currentWord === lesson.words.length - 1;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex flex-col">
      <Header
        title={lesson.title}
        score={score}
        lives={lives}
        onHomeClick={onHome}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <WordCard word={word} onPlaySound={onPlaySound} />
        <Navigation
          currentWord={currentWord}
          totalWords={lesson.words.length}
          onPrevious={onPrevious}
          onNext={onNext}
          onQuiz={onQuiz}
          isLastWord={isLastWord}
        />
      </div>
    </div>
  );
};

export default LessonScreen;
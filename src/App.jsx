// App.js - Main component
import React, { useState, useEffect } from 'react';
import MainScreen from './components/MainScreen.jsx';
import LessonScreen from './components/LessonScreen.jsx';
import QuizScreen from './components/QuizScreen.jsx';

import TopicWordScreen from './components/TopicWordsScreen.jsx';
import FlipGameScreen from './components/FlipGameScreen.jsx';
import WordPuzzleGame from './components/WordPuzzleGame.tsx';
import AlphabetGame from './components/AlphabetGame.jsx';
import AlphabetWritingGame from './components/AlphabetWritingGame.jsx';
import AlphabetIntroScreen from './components/AlphabetIntroScreen.jsx';
import VowelConsonantScreen from './components/VowelConsonantScreen.jsx';
import AlphabetSortGame from './components/AlphabetSortGame.jsx';
//import WordGame from './components/WordGame.jsx';
import { lessons } from './data/lessons.js';
import { FullscreenContext } from './components/Header.jsx';

const VietnameseLearningApp = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  //const [score, setScore] = useState(0);
  // Khởi tạo score từ localStorage hoặc mặc định là 0
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('vietnamese_learning_score');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('alphabet-intro');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState([]);

  // Effect để lưu score vào localStorage mỗi khi score thay đổi
  useEffect(() => {
    localStorage.setItem('vietnamese_learning_score', score.toString());
  }, [score]);

  // Function to play sound (Vietnamese pronunciation)
  const playSound = (text) => {
    window.responsiveVoice.speak(text, 'Vietnamese Female', { rate: 1 });
  };

  // Function to generate quiz options
  const generateQuizOptions = (correctWord) => {
    const lesson = lessons[currentLesson];
    const otherWords = lesson.words.filter(w => w.vietnamese !== correctWord.vietnamese);
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    const options = [correctWord, ...shuffled.slice(0, 2)];
    return options.sort(() => 0.5 - Math.random());
  };

  // Handler for quiz answer selection
  const handleQuizAnswer = (selectedWord) => {
    const correctWord = lessons[currentLesson].words[currentWord];
    setSelectedAnswer(selectedWord);
    setShowResult(true);

    if (selectedWord.vietnamese === correctWord.vietnamese) {
      setScore(score + 10);
      playSound("Đúng rồi!");
    } else {
      setLives(lives - 1);
      playSound("Sai rồi, thử lại nhé!");
    }

    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentWord < lessons[currentLesson].words.length - 1) {
        setCurrentWord(currentWord + 1);
      } else {
        setCurrentWord(currentWord + 1); // Đảm bảo currentWord = totalWords khi hoàn thành quiz
      }
    }, 2000);
  };

  // Reset game state
  const resetGame = () => {
    setCurrentWord(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameState('quiz');
  };

  const handleSetGameState = (nextState) => {
    setHistory(prev => [...prev, gameState]);
    setGameState(nextState);
  };

  const handleBack = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop();
      setGameState(last || 'main');
      return newHistory;
    });
  };

  // Game Over Screen

  // Props object for all screens
  const screenProps = {
    currentLesson,
    currentWord,
    score,
    lives,
    lessons,
    setCurrentLesson,
    setCurrentWord,
    setScore,
    setLives,
    setGameState: handleSetGameState,
    onBack: handleBack,
    playSound,
    generateQuizOptions,
    handleQuizAnswer,
    resetGame,
    selectedAnswer,
    showResult,
    isFullscreen,
    setIsFullscreen
  };

  // Main render logic
  return (
    <FullscreenContext.Provider value={{ isFullscreen, setIsFullscreen }}>
      {(() => {
        switch (gameState) {
          case 'main':
            return <MainScreen {...screenProps} />;
          case 'topic':
            return <TopicWordScreen {...screenProps} />;
          case 'lesson':
            return <LessonScreen {...screenProps} />;
          case 'quiz':
            return <QuizScreen {...screenProps} />;
         
          case 'flipgame':
            return <FlipGameScreen {...screenProps} />;
          case 'puzzlegame':
            return <WordPuzzleGame {...screenProps} />;
          case 'alphabet':
            return <AlphabetGame {...screenProps} />;
          case 'writing':
            return <AlphabetWritingGame {...screenProps} />;
          case 'alphabet-intro':
            return <AlphabetIntroScreen {...screenProps} />;
          case 'vowel-consonant':
            return <VowelConsonantScreen {...screenProps} />;
          case 'sort-vowel-consonant':
            return <AlphabetSortGame {...screenProps} />;
          default:
            return <MainScreen {...screenProps} />;
        }
      })()}
    </FullscreenContext.Provider>
  );
};

export default VietnameseLearningApp;
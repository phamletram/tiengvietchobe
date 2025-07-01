// App.js - Main component
import React, { useState, useEffect } from 'react';
import MenuScreen from './components/MenuScreen.jsx';
import LessonScreen from './components/LessonScreen.jsx';
import QuizScreen from './components/QuizScreen.jsx';
import CompleteScreen from './components/CompleteScreen.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';
import TopicWordScreen from './components/TopicWordsScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import WordPuzzleGame from './components/WordPuzzleGame.tsx';
import AlphabetGame from './components/AlphabetGame.jsx';
//import WordGame from './components/WordGame.jsx';
import { lessons } from './data/lessons.js';

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
  const [gameState, setGameState] = useState('menu'); // menu, lesson, quiz, complete
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

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
        setGameState('complete');
      }
    }, 2000);
  };

  // Reset game state
  const resetGame = () => {
    setCurrentWord(0);
    //resetScore();
    setLives(3);
    setGameState('menu');
    setSelectedAnswer(null);
    setShowResult(false);
  };

   // Function để reset hoàn toàn điểm số (nếu cần)
  const resetScore = () => {
    setScore(0);
    localStorage.removeItem('vietnamese_learning_score');
  };

  // Game Over Screen
  if (lives <= 0) {
    return <GameOverScreen resetGame={resetGame} />;
  }

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
    setGameState,
    playSound,
    generateQuizOptions,
    handleQuizAnswer,
    resetGame,
    selectedAnswer,
    showResult
  };

  // Main render logic
  switch (gameState) {
    case 'menu':
      return <MenuScreen {...screenProps} />;
    case 'topic':
      return <TopicWordScreen {...screenProps} />;
    case 'lesson':
      return <LessonScreen {...screenProps} />;
    case 'quiz':
      return <QuizScreen {...screenProps} />;
    case 'complete':
      return <CompleteScreen {...screenProps} />;
    case 'game':
      return <GameScreen {...screenProps} />;
    case 'puzzlegame':
        return <WordPuzzleGame {...screenProps} />;
    case 'alphabet':
        return <AlphabetGame {...screenProps} />;
    default:
      return <MenuScreen {...screenProps} />;
  }
};

export default VietnameseLearningApp;
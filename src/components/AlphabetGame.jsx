import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import PropTypes from 'prop-types';

const vietnameseAlphabet = [
  { letter: 'A', smallLetter: 'a', pronunciation: 'a', example: 'áo', exampleMeaning: 'shirt' },
  { letter: 'Ă', smallLetter: 'ă', pronunciation: 'ă', example: 'ăn', exampleMeaning: 'eat' },
  { letter: 'Â', smallLetter: 'â', pronunciation: 'â', example: 'ấm', exampleMeaning: 'warm' },
  { letter: 'B', smallLetter: 'b', pronunciation: 'bê', example: 'bàn', exampleMeaning: 'table' },
  { letter: 'C', smallLetter: 'c', pronunciation: 'xê', example: 'cá', exampleMeaning: 'fish' },
  { letter: 'D', smallLetter: 'd', pronunciation: 'dê', example: 'Con dê', exampleMeaning: 'Goat' },
  { letter: 'Đ', smallLetter: 'đ', pronunciation: 'đê', example: 'đi', exampleMeaning: 'go' },
  { letter: 'E', smallLetter: 'e', pronunciation: 'e', example: 'em', exampleMeaning: 'younger sibling' },
  { letter: 'Ê', smallLetter: 'ê', pronunciation: 'ê', example: 'êm', exampleMeaning: 'smooth' },
  { letter: 'G', smallLetter: 'g', pronunciation: 'giê', example: 'gà', exampleMeaning: 'chicken' },
  { letter: 'H', smallLetter: 'h', pronunciation: 'hát', example: 'học', exampleMeaning: 'study' },
  { letter: 'I', smallLetter: 'i', pronunciation: 'i', example: 'in', exampleMeaning: 'print' },
  { letter: 'K', smallLetter: 'k', pronunciation: 'ca', example: 'kem', exampleMeaning: 'ice cream' },
  { letter: 'L', smallLetter: 'l', pronunciation: 'lờ', example: 'lá', exampleMeaning: 'leaf' },
  { letter: 'M', smallLetter: 'm', pronunciation: 'mờ', example: 'mẹ', exampleMeaning: 'mother' },
  { letter: 'N', smallLetter: 'n', pronunciation: 'nờ', example: 'nước', exampleMeaning: 'water' },
  { letter: 'O', smallLetter: 'o', pronunciation: 'o', example: 'Con ong', exampleMeaning: 'Bee' },
  { letter: 'Ô', smallLetter: 'ô', pronunciation: 'ô', example: 'ốc', exampleMeaning: 'snail' },
  { letter: 'Ơ', smallLetter: 'ơ', pronunciation: 'ơ', example: 'ở', exampleMeaning: 'at' },
  { letter: 'P', smallLetter: 'p', pronunciation: 'pê', example: 'phở', exampleMeaning: 'pho' },
  { letter: 'Q', smallLetter: 'q', pronunciation: 'cu', example: 'quả', exampleMeaning: 'fruit' },
  { letter: 'R', smallLetter: 'r', pronunciation: 'rờ', example: 'rồng', exampleMeaning: 'dragon' },
  { letter: 'S', smallLetter: 's', pronunciation: 'sì', example: 'sách', exampleMeaning: 'book' },
  { letter: 'T', smallLetter: 't', pronunciation: 'tê', example: 'tôi', exampleMeaning: 'I/me' },
  { letter: 'U', smallLetter: 'u', pronunciation: 'u', example: 'uống', exampleMeaning: 'drink' },
  { letter: 'Ư', smallLetter: 'ư', pronunciation: 'ư', example: 'ưa', exampleMeaning: 'like' },
  { letter: 'V', smallLetter: 'v', pronunciation: 'vê', example: 'và', exampleMeaning: 'and' },
  { letter: 'X', smallLetter: 'x', pronunciation: 'ích-xì', example: 'xanh', exampleMeaning: 'green' },
  { letter: 'Y', smallLetter: 'y', pronunciation: 'i-cờ-rét', example: 'yêu', exampleMeaning: 'love' }
];

const AlphabetGame = ({ setGameState, score, setScore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameMode, setGameMode] = useState('learn'); // 'learn' or 'quiz'
  const [gameScore, setGameScore] = useState(0); // Local game score
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const { showMenu, setShowMenu } = useResponsiveMenu();

  const audioCtxRef = useRef(null);
  if (!audioCtxRef.current && typeof window !== 'undefined') {
    audioCtxRef.current = new (window.AudioContext || window.AudioContext)();
  }

  const playSound = (type) => {
    if (!audioCtxRef.current) return;
    const audioContext = audioCtxRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
    } else {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.type = 'sawtooth';
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playLetterSound = () => {
    if (typeof window !== 'undefined' && window.responsiveVoice) {
      window.responsiveVoice.speak(currentLetter.letter, 'Vietnamese Female', { rate: 0.8 });
    }
  };

  const currentLetter = vietnameseAlphabet[currentIndex];

  const nextLetter = () => {
    if (currentIndex < vietnameseAlphabet.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const generateQuiz = () => {
    const randomLetter = vietnameseAlphabet[Math.floor(Math.random() * vietnameseAlphabet.length)];
    const otherLetters = vietnameseAlphabet.filter(l => l.letter !== randomLetter.letter);
    const shuffledOthers = otherLetters.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffledOthers, randomLetter].sort(() => Math.random() - 0.5);
    
    setCurrentQuiz(randomLetter);
    setQuizOptions(options);
    setShowResult(false);
    setIsCorrect(null);
  };

  const startQuiz = () => {
    setGameMode('quiz');
    setGameScore(0); // Reset local game score
    setAttempts(0);
    generateQuiz();
  };

  const checkAnswer = (selectedLetter) => {
    setAttempts(prev => prev + 1);
    const correct = selectedLetter.letter === currentQuiz.letter;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      playSound('correct');
      const pointsEarned = 10;
      setGameScore(prev => prev + pointsEarned);
      setScore(score + pointsEarned); // Update global score
    } else {
      playSound('incorrect');
    }
    
    setTimeout(() => {
      generateQuiz();
    }, 2000);
  };

  const resetGame = () => {
    setGameMode('learn');
    setCurrentIndex(0);
    setGameScore(0); // Reset local game score
    setAttempts(0);
    setShowResult(false);
    setIsCorrect(null);
  };

  const onMenuClick = (menuKey) => {
    if (setGameState) {
      handleMenuClick(menuKey, setShowMenu, setGameState);
    }
  };

  // Learn Mode UI
  if (gameMode === 'learn') {
    return (
      <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
        <Header
          title="📝 Học chữ cái"
          showMenu={showMenu}
          onMenuToggle={() => setShowMenu(show => !show)}
        />
        <Menu
          showMenu={showMenu}
          onMenuClick={onMenuClick}
        />
        <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full sm:overflow-y-auto overflow-hidden ${showMenu ? 'pl-44' : ''}`} style={{willChange: 'transform', height: 'calc(100vh - 56px - 32px)', marginTop: '56px'}}>
          <div className="max-w-4xl mx-auto w-full p-6 sm:p-8">
            {/* Letter Display */}
            <div className="bg-white rounded-2xl shadow-xl p-12 mb-8 relative">
              {/* Progress - góc trái */}
              <div className="absolute top-4 left-4">
                <div className="bg-blue-100 rounded-lg p-2 shadow-md">
                  <span className="text-sm font-semibold text-blue-700">
                    {currentIndex + 1} / {vietnameseAlphabet.length}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center items-center gap-8 mb-6">
                  <div className="text-9xl font-bold text-blue-600">
                    {currentLetter.letter}
                  </div>
                  <div className="text-9xl font-bold text-purple-600">
                    {currentLetter.smallLetter}
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4 mb-6">
                  <button
                    onClick={playLetterSound}
                    className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-8 h-8 text-blue-600" />
                  </button>
                </div>
                <div className="text-2xl text-gray-600 mb-6">
                  Ví dụ: <span className="font-semibold text-purple-600">{currentLetter.example}</span>
                  <span className="text-gray-500 ml-4">•</span>
                  <span className="text-gray-500 ml-4">Nghĩa: {currentLetter.exampleMeaning}</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-8">
              <button
                onClick={prevLetter}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 sm:gap-2 bg-blue-500 text-white px-3 py-1.5 sm:px-6 sm:py-3 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Trước
              </button>
              <button
                onClick={startQuiz}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 sm:px-8 sm:py-3 rounded-xl font-semibold text-sm sm:text-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🎯 Quiz
              </button>
              <button
                onClick={nextLetter}
                disabled={currentIndex === vietnameseAlphabet.length - 1}
                className="flex items-center gap-1 sm:gap-2 bg-blue-500 text-white px-3 py-1.5 sm:px-6 sm:py-3 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs sm:text-base"
              >
                Sau
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </main>
        <Footer score={score} lives={3} />
      </div>
    );
  }

  // Quiz Mode UI
  if (gameMode === 'quiz') {
    return (
      <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
        <Header
          title="🎯 Quiz chữ cái"
          showMenu={showMenu}
          onMenuToggle={() => setShowMenu(show => !show)}
        />
        <Menu
          showMenu={showMenu}
          onMenuClick={onMenuClick}
        />
        <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full sm:overflow-y-auto overflow-hidden ${showMenu ? 'pl-44' : ''}`} style={{willChange: 'transform', height: 'calc(100vh - 56px - 32px)', marginTop: '56px'}}>
          <div className="max-w-4xl mx-auto w-full p-6 sm:p-8">
            {/* Stats and Back Button */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={resetGame}
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-2xl font-bold shadow-md hover:from-blue-500 hover:to-purple-500 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 text-xs sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Học chữ cái
              </button>
              
              <div className="flex gap-1 sm:gap-4">
                <div className="bg-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md min-w-[64px] sm:min-w-[100px]">
                  <span className="font-semibold text-green-600 text-xs sm:text-base">Điểm: {gameScore}</span>
                </div>
                <div className="bg-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md min-w-[64px] sm:min-w-[100px]">
                  <span className="font-semibold text-blue-600 text-xs sm:text-base">Lần thử: {attempts}</span>
                </div>
              </div>
            </div>

            {/* Quiz Question */}
            <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Chọn chữ cái bắt đầu của từ: <span className="text-purple-600">{currentQuiz?.example}</span>
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                {quizOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(option)}
                    disabled={showResult}
                    className={`p-6 rounded-xl text-4xl font-bold transition-all duration-200 ${
                      showResult
                        ? option.letter === currentQuiz.letter
                          ? 'bg-green-100 border-2 border-green-400 text-green-700'
                          : 'bg-red-100 border-2 border-red-400 text-red-700'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700 hover:scale-105'
                    }`}
                  >
                    <div className="flex justify-center items-center gap-2">
                      <span>{option.letter}</span>
                      <span className="text-2xl text-gray-500">{option.smallLetter}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Result */}
              {showResult && (
                <div className="text-center mt-6">
                  {isCorrect ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="w-8 h-8" />
                      <span className="text-2xl font-bold">Chính xác! 🎉</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <XCircle className="w-8 h-8" />
                      <span className="text-2xl font-bold">Sai rồi! Đáp án đúng là: {currentQuiz.letter}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer score={score} lives={3} />
      </div>
    );
  }
};

AlphabetGame.propTypes = {
  setGameState: PropTypes.func,
  score: PropTypes.number,
  setScore: PropTypes.func,
};

export default AlphabetGame; 
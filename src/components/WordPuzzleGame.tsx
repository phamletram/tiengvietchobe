import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shuffle, RotateCcw, Trophy, Clock, Target, CheckCircle, XCircle, Shuffle as ShuffleIcon } from 'lucide-react';
import { lessons } from '../data/lessons.js';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';

interface Word {
  vietnamese: string;
  english: string;
  image: string;
}

interface Lesson {
  title: string;
  icon: string;
  words: Word[];
}

interface LetterTile {
  id: string;
  letter: string;
  isPlaced: boolean;
  correctPosition: number;
  currentPosition: number;
}

interface Card {
  id: string;
  content: string;
  type: 'vietnamese' | 'english';
  isFlipped: boolean;
  isMatched: boolean;
  originalWord: Word;
}

interface WordPuzzleGameProps {
  setGameState?: (state: string) => void;
  score: number;
  setScore: (score: number) => void;
}

const WordPuzzleGame: React.FC<WordPuzzleGameProps & { isFullscreen?: boolean, setIsFullscreen?: (v: boolean) => void }> = ({ setGameState, score, setScore, isFullscreen, setIsFullscreen }) => {
  // Chế độ chơi: 'puzzle' (ghép chữ) hoặc 'card' (lật thẻ)
  const [mode] = useState<'puzzle'>('puzzle');
  const { showMenu, setShowMenu } = useResponsiveMenu();
  const { isFullscreen: headerIsFullscreen, setIsFullscreen: setHeaderIsFullscreen } = useFullscreen() || {};

  // State chọn bài học
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const sampleLesson = lessons[currentLessonIndex];

  // --- State cho chế độ puzzle (ghép chữ) ---
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letterTiles, setLetterTiles] = useState<LetterTile[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameScore, setGameScore] = useState(0); // Local game score
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // --- State cho chế độ card (lật thẻ) ---
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [cardAttempts, setCardAttempts] = useState(0);
  const [cardGameStarted, setCardGameStarted] = useState(false);
  const [cardGameCompleted, setCardGameCompleted] = useState(false);
  const [cardStartTime, setCardStartTime] = useState<number | null>(null);
  const [cardGameTime, setCardGameTime] = useState(0);

  // Âm thanh hiệu ứng
  const audioCtxRef = useRef<AudioContext | null>(null);
  if (!audioCtxRef.current && typeof window !== 'undefined') {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  const playSound = (type: 'correct' | 'incorrect') => {
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
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  };

  const currentWord = sampleLesson.words[currentWordIndex];

  // --- Logic cho chế độ puzzle (ghép chữ) ---
  const initializeGame = () => {
    setCurrentWordIndex(0);
    setGameScore(0); // Reset local game score
    setAttempts(0);
    setGameCompleted(false);
    setGameStarted(true);
    setStartTime(Date.now());
    setGameTime(0);
    setupCurrentWord(0);
  };

  const setupCurrentWord = (wordIndex: number) => {
    const word = sampleLesson.words[wordIndex];
    const letters = word.vietnamese.split('');
    const tiles: LetterTile[] = letters.map((letter, index) => ({
      id: `${wordIndex}-${index}`,
      letter: letter,
      isPlaced: false,
      correctPosition: index,
      currentPosition: -1
    }));
    const shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);
    setLetterTiles(shuffledTiles);
    setUserAnswer(new Array(letters.length).fill(''));
    setIsCorrect(null);
    setShowHint(false);
  };

  const handleLetterClick = (tileId: string) => {
    const tile = letterTiles.find(t => t.id === tileId);
    if (!tile || tile.isPlaced) return;
    const emptyIndex = userAnswer.findIndex(letter => letter === '');
    if (emptyIndex === -1) return;
    const newUserAnswer = [...userAnswer];
    newUserAnswer[emptyIndex] = tile.letter;
    setUserAnswer(newUserAnswer);
    setLetterTiles(prev => prev.map(t => t.id === tileId ? { ...t, isPlaced: true, currentPosition: emptyIndex } : t));
  };

  const handleAnswerClick = (position: number) => {
    const letter = userAnswer[position];
    if (!letter) return;
    const newUserAnswer = [...userAnswer];
    newUserAnswer[position] = '';
    setUserAnswer(newUserAnswer);
    setLetterTiles(prev => prev.map(t => t.currentPosition === position && t.letter === letter ? { ...t, isPlaced: false, currentPosition: -1 } : t));
  };

  const checkAnswer = () => {
    const answer = userAnswer.join('');
    const correct = answer === currentWord.vietnamese;
    setIsCorrect(correct);
    setAttempts(prev => prev + 1);
    if (correct) {
      playSound('correct');
      const pointsEarned = 100;
      setGameScore(prev => prev + pointsEarned);
      setScore(score + pointsEarned); // Update global score
      setTimeout(() => {
        if (currentWordIndex < sampleLesson.words.length - 1) {
          const nextIndex = currentWordIndex + 1;
          setCurrentWordIndex(nextIndex);
          setupCurrentWord(nextIndex);
        } else {
          setGameCompleted(true);
          setGameStarted(false);
        }
      }, 2000);
    } else {
      playSound('incorrect');
      setTimeout(() => {
        setIsCorrect(null);
        setUserAnswer(new Array(currentWord.vietnamese.length).fill(''));
        setLetterTiles(prev => prev.map(t => ({ ...t, isPlaced: false, currentPosition: -1 })));
      }, 1500);
    }
  };

  const skipWord = () => {
    if (currentWordIndex < sampleLesson.words.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setupCurrentWord(nextIndex);
    } else {
      setGameCompleted(true);
      setGameStarted(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted && startTime) {
      interval = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted, startTime]);

  useEffect(() => {
    if (userAnswer.every(letter => letter !== '') && userAnswer.length > 0) {
      setTimeout(() => checkAnswer(), 500);
    }
  }, [userAnswer]);

  // Tự động bắt đầu game khi component mount hoặc khi đổi lesson
  useEffect(() => {
    if (!gameStarted && !gameCompleted) {
      initializeGame();
    }
    // eslint-disable-next-line
  }, [currentLessonIndex]);

  // --- Logic cho chế độ card (lật thẻ) ---
  const initializeCardGame = () => {
    const gameCards: Card[] = [];
    sampleLesson.words.forEach((word, index) => {
      gameCards.push({
        id: `vn-${index}`,
        content: word.vietnamese,
        type: 'vietnamese',
        isFlipped: false,
        isMatched: false,
        originalWord: word
      });
      gameCards.push({
        id: `en-${index}`,
        content: word.english,
        type: 'english',
        isFlipped: false,
        isMatched: false,
        originalWord: word
      });
    });
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setCardAttempts(0);
    setCardGameCompleted(false);
    setCardGameStarted(true);
    setCardStartTime(Date.now());
    setCardGameTime(0);
  };

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId)) return;
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    setCards(prevCards => prevCards.map(card => card.id === cardId ? { ...card, isFlipped: true } : card));
    if (newFlippedCards.length === 2) {
      setCardAttempts(prev => prev + 1);
      setTimeout(() => {
        checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkForMatch = (flippedCardIds: string[]) => {
    const [firstCardId, secondCardId] = flippedCardIds;
    const firstCard = cards.find(card => card.id === firstCardId);
    const secondCard = cards.find(card => card.id === secondCardId);
    if (firstCard && secondCard) {
      const isMatch = firstCard.originalWord.vietnamese === secondCard.originalWord.vietnamese && firstCard.type !== secondCard.type;
      if (isMatch) {
        setMatchedPairs(prev => [...prev, firstCard.originalWord.vietnamese]);
        setCards(prevCards => prevCards.map(card => (card.id === firstCardId || card.id === secondCardId) ? { ...card, isMatched: true } : card));
      } else {
        setCards(prevCards => prevCards.map(card => (card.id === firstCardId || card.id === secondCardId) ? { ...card, isFlipped: false } : card));
      }
    }
    setFlippedCards([]);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cardGameStarted && !cardGameCompleted && cardStartTime) {
      interval = setInterval(() => {
        setCardGameTime(Math.floor((Date.now() - cardStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cardGameStarted, cardGameCompleted, cardStartTime]);

  useEffect(() => {
    if (matchedPairs.length === sampleLesson.words.length && cardGameStarted) {
      setCardGameCompleted(true);
      setCardGameStarted(false);
    }
  }, [matchedPairs.length, sampleLesson.words.length, cardGameStarted]);

  // Hàm chọn random lesson
  const selectRandomLesson = () => {
    const randomIndex = Math.floor(Math.random() * lessons.length);
    setCurrentLessonIndex(randomIndex);
    // Reset game state và setup lại từ mới
    setCurrentWordIndex(0);
    setGameScore(0); // Reset local game score
    setAttempts(0);
    setGameCompleted(false);
    setGameStarted(true);
    setStartTime(Date.now());
    setGameTime(0);
    // Setup từ đầu tiên của bài học mới
    const newLesson = lessons[randomIndex];
    const firstWord = newLesson.words[0];
    const letters = firstWord.vietnamese.split('');
    const tiles: LetterTile[] = letters.map((letter, index) => ({
      id: `0-${index}`,
      letter: letter,
      isPlaced: false,
      correctPosition: index,
      currentPosition: -1
    }));
    const shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);
    setLetterTiles(shuffledTiles);
    setUserAnswer(new Array(letters.length).fill(''));
    setIsCorrect(null);
    setShowHint(false);
  };

  // --- Render UI ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnswerSlotStyle = (index: number, letter: string) => {
    let baseStyle = "w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-200";
    if (letter) {
      if (isCorrect === true) {
        baseStyle += " bg-green-100 border-green-400 text-green-700";
      } else if (isCorrect === false) {
        baseStyle += " bg-red-100 border-red-400 text-red-700";
      } else {
        baseStyle += " bg-blue-100 border-blue-400 text-blue-700";
      }
    } else {
      baseStyle += " hover:border-gray-400 hover:bg-gray-50";
    }
    return baseStyle;
  };

  const getLetterTileStyle = (tile: LetterTile) => {
    let baseStyle = "w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-200 shadow-md";
    if (tile.isPlaced) {
      baseStyle += " bg-gray-200 text-gray-400 cursor-not-allowed opacity-50";
    } else {
      baseStyle += " bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700 transform hover:scale-105";
    }
    return baseStyle;
  };

  const getCardStyle = (card: Card) => {
    let baseStyle = "relative w-full h-24 rounded-xl cursor-pointer transition-all duration-500 transform-gpu";
    if (card.isMatched) {
      baseStyle += " bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg scale-105";
    } else if (card.isFlipped) {
      baseStyle += card.type === 'vietnamese' 
        ? " bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg"
        : " bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg";
    } else {
      baseStyle += " bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 shadow-md hover:shadow-lg";
    }
    return baseStyle;
  };

  // --- UI chọn bài học ---
  if (!gameStarted && !gameCompleted) {
    const onMenuClick = (menuKey: string) => {
      if (setGameState) {
        handleMenuClick(menuKey, setShowMenu, setGameState);
      }
    };
    
    return (
      <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
        {!headerIsFullscreen && (
          <Header
            title="🧩 Ghép chữ tiếng Việt"
            showMenu={showMenu}
            onMenuToggle={() => setShowMenu(show => !show)}
          />
        )}
        {!headerIsFullscreen && (
          <Menu
            showMenu={showMenu}
            onMenuClick={onMenuClick}
            onMenuToggle={() => setShowMenu(show => !show)}
          />
        )}
        <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${showMenu && !isFullscreen ? 'pl-44' : ''}`}
          style={{willChange: 'transform', height: isFullscreen ? '100vh' : 'calc(100vh - 56px - 32px)', marginTop: isFullscreen ? 0 : '56px'}}>
          {isFullscreen && setIsFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              title="Thoát toàn màn hình"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 16v4h-4M4 16v4h4M20 8V4h-4" /></svg>
            </button>
          )}
          <div className="grid grid-cols-3 gap-6 max-w-6xl w-full p-6 sm:p-8">
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.title}
                className={`group bg-white rounded-3xl p-6 sm:p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100 ${idx === currentLessonIndex ? 'ring-4 ring-purple-400' : ''}`}
                onClick={() => setCurrentLessonIndex(idx)}
              >
                <div className="text-7xl mb-4 text-center group-hover:animate-bounce-y">
                  {lesson.icon}
                </div>
                <h3 className="text-2xl sm:text-2xl font-bold text-gray-800 text-center mb-1">{lesson.title}</h3>
                <p className="text-gray-600 text-center text-sm">{lesson.words.length} từ vựng</p>
              </button>
            ))}
          </div>
        </main>
        <Footer score={score} />
      </div>
    );
  }

  // --- UI chế độ puzzle (ghép chữ) ---
  if (mode === 'puzzle') {
    const onMenuClick = (menuKey: string) => {
      if (setGameState) {
        handleMenuClick(menuKey, setShowMenu, setGameState);
      }
    };
    
    return (
      <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
        <Header
          title={`🧩 Xếp chữ - ${sampleLesson.title}`}
          showMenu={showMenu}
          onMenuToggle={() => setShowMenu(show => !show)}
        />
        {!headerIsFullscreen && (
          <Menu
            showMenu={showMenu}
            onMenuClick={onMenuClick}
            onMenuToggle={() => setShowMenu(show => !show)}
          />
        )}

        {/* Main content */}
        <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full flex-1 min-h-0 ${showMenu && !headerIsFullscreen ? 'pl-44' : ''} ${headerIsFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
          style={{willChange: 'transform', height: headerIsFullscreen ? '100vh' : 'calc(100vh - 56px - 32px)', marginTop: headerIsFullscreen ? 0 : '56px'}}>
          {/* Đã loại bỏ nút Minimize riêng lẻ, Header sẽ quản lý */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 w-full max-w-4xl">
            {/* Game Stats */}
            {gameStarted && (
              <div className="flex justify-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-700">{formatTime(gameTime)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-700">{attempts} lần thử</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-700">{gameScore} điểm</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <span className="font-semibold text-gray-700">
                    {currentWordIndex + 1}/{sampleLesson.words.length}
                  </span>
                </div>
                <button
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
                  onClick={selectRandomLesson}
                  title="Chọn bài học ngẫu nhiên"
                >
                  <ShuffleIcon className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-700">Random</span>
                </button>
              </div>
            )}

            {/* Game Board */}
            {gameCompleted ? (
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
                  <div className="text-6xl mb-6">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Chúc mừng!</h2>
                  <p className="text-gray-600 mb-6">
                    Bạn đã hoàn thành game trong {formatTime(gameTime)} với {gameScore} điểm!
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={initializeGame}
                      className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <RotateCcw className="w-5 h-5 inline mr-2" />
                      Chơi Lại
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Current Word Display */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {currentWord.english}
                    </div>
                    {showHint && (
                      <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                        <span className="text-yellow-800 font-semibold">
                          Gợi ý: {currentWord.vietnamese}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Answer Slots */}
                  <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    {userAnswer.map((letter, index) => (
                      <div
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        className={getAnswerSlotStyle(index, letter)}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className="text-center mb-6">
                      {isCorrect ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="w-8 h-8" />
                          <span className="text-2xl font-bold">Chính xác! 🎉</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-red-600">
                          <XCircle className="w-8 h-8" />
                          <span className="text-2xl font-bold">Thử lại! 💪</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Letter Tiles */}
                  <div className="flex justify-center gap-2 flex-wrap">
                    {letterTiles.map((tile) => (
                      <div
                        key={tile.id}
                        onClick={() => handleLetterClick(tile.id)}
                        className={getLetterTileStyle(tile)}
                      >
                        {tile.letter}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 mt-8">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors duration-200 shadow-lg"
                    >
                      💡 Gợi ý
                    </button>
                    <button
                      onClick={skipWord}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-200 shadow-lg"
                    >
                      ⏭️ Bỏ qua
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer score={score} />
      </div>
    );
  }

  // --- UI chế độ card (lật thẻ) ---
  if (mode === 'card') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {sampleLesson.icon} {sampleLesson.title}
            </h1>
            <p className="text-lg text-gray-600">Match Vietnamese words with their English translations!</p>
          </div>

          {/* Game Stats */}
          {cardGameStarted && (
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-700">{formatTime(cardGameTime)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-700">{cardAttempts} attempts</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                <Trophy className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">{matchedPairs.length}/{sampleLesson.words.length} pairs</span>
              </div>
            </div>
          )}

          {/* Game Board */}
          {!cardGameStarted && !cardGameCompleted ? (
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
                <div className="text-6xl mb-6">{sampleLesson.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to play?</h2>
                <p className="text-gray-600 mb-8">
                  Flip cards to match Vietnamese words with their English translations. 
                  Try to complete all pairs in the shortest time with fewest attempts!
                </p>
                <button
                  onClick={initializeCardGame}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Shuffle className="w-6 h-6 inline mr-2" />
                  Start Game
                </button>
              </div>
            </div>
          ) : cardGameCompleted ? (
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
                <p className="text-gray-600 mb-6">
                  You completed the game in {formatTime(cardGameTime)} with {cardAttempts} attempts!
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={initializeCardGame}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5 inline mr-2" />
                    Play Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={getCardStyle(card)}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    {card.isFlipped || card.isMatched ? (
                      <div className="text-center">
                        <div className="text-2xl mb-1">{card.originalWord.image}</div>
                        <div className="text-sm font-semibold leading-tight">
                          {card.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-4xl text-gray-400">❓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default WordPuzzleGame;
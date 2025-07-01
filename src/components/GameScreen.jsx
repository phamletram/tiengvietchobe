// components/DragDropMatchGame.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, RefreshCcw, Clock, Lightbulb, Trophy, Star, Volume2, VolumeX, RotateCcw, Target, CheckCircle, XCircle, Shuffle } from 'lucide-react';
import { lessons } from '../data/lessons.js';
import HeaderBar from './HeaderBar.jsx';
import Confetti from 'react-confetti';

function MemoryCard({ card, isFlipped, isMatched, onClick, disabled }) {
  const getCardContent = () => {
    return (
      <div className="text-center">
        <div className="text-lg font-bold text-blue-700">{card.content}</div>
      </div>
    );
  };

  const getCardStyle = () => {
    if (isMatched) return 'bg-green-100 border-green-400';
    if (isFlipped) return 'bg-white border-blue-400';
    return 'bg-red-500 border-red-600';
  };

  return (
    <div
      onClick={() => !disabled && !isFlipped && !isMatched && onClick(card)}
      className={`
        w-20 h-24 rounded-lg border-2 cursor-pointer transition-all duration-300
        flex items-center justify-center text-white font-bold
        hover:scale-105 active:scale-95
        ${getCardStyle()}
        ${disabled || isFlipped || isMatched ? 'cursor-default' : 'cursor-pointer'}
      `}
    >
      {isFlipped || isMatched ? (
        getCardContent()
      ) : (
        <div className="text-white text-2xl">❓</div>
      )}
    </div>
  );
}

const GameScreen = ({ setGameState, score, setScore }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameScore, setGameScore] = useState(0); // Local game score
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const prevIsGameComplete = useRef(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const audioCtxRef = useRef(null);

  // Khởi tạo AudioContext duy nhất
  if (!audioCtxRef.current && typeof window !== 'undefined') {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }

  const playSound = useCallback((type) => {
    if (!soundEnabled || !audioCtxRef.current) return;

    const audioContext = audioCtxRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'correct':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        break;
      case 'incorrect':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        break;
      case 'flip':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.type = 'square';
        break;
    }

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }, [soundEnabled]);

  // Initialize game with current lesson
  const initializeGame = useCallback(() => {
    const currentLesson = lessons[currentLessonIndex];
    const lessonWords = currentLesson.words.slice(0, 6); // Take first 6 words for 12 cards (6 pairs)
    
    // Create pairs of cards with same Vietnamese word
    const cardPairs = lessonWords.map((word, index) => [
      {
        id: `card-${index}-1`,
        type: 'vietnamese',
        content: word.vietnamese,
        pairId: index,
        wordId: index
      },
      {
        id: `card-${index}-2`,
        type: 'vietnamese',
        content: word.vietnamese,
        pairId: index,
        wordId: index
      }
    ]).flat();
    
    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setDisabled(false);
    setMoves(0);
    setGameScore(0); // Reset local game score
    setTimeLeft(120);
    setIsTimerRunning(true);
    setShowHint(false);
  }, [currentLessonIndex]);

  // Change lesson
  const changeLesson = () => {
    const nextIndex = (currentLessonIndex + 1) % lessons.length;
    setCurrentLessonIndex(nextIndex);
  };

  // Change lesson randomly
  const changeLessonRandom = () => {
    const randomIndex = Math.floor(Math.random() * lessons.length);
    setCurrentLessonIndex(randomIndex);
  };

  // Handle card click
  const handleCardClick = (clickedCard) => {
    if (!hasPlayed) setHasPlayed(true);
    if (disabled || flippedCards.length >= 2 || flippedCards.find(card => card.id === clickedCard.id)) {
      return;
    }

    playSound('flip');
    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setDisabled(true);
      setMoves(prev => prev + 1);

      const [firstCard, secondCard] = newFlippedCards;
      
      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setMatchedPairs(prev => [...prev, firstCard.pairId]);
        const pointsEarned = 10;
        setGameScore(prev => prev + pointsEarned);
        setScore(score + pointsEarned); // Update global score
        setStreak(prev => prev + 1);
        setBestScore(prev => Math.max(prev, gameScore + pointsEarned));
        playSound('correct');
        setFlippedCards([]);
        setDisabled(false);
      } else {
        // No match
        setStreak(0);
        playSound('incorrect');
        setTimeout(() => {
          setFlippedCards([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeLeft]);

  // Initialize game when lesson changes
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Check if game is complete
  const isGameComplete = matchedPairs.length === cards.length / 2;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const totalPairs = cards.length / 2;
    const percentage = (gameScore / totalPairs) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = () => {
    const totalPairs = cards.length / 2;
    const percentage = (gameScore / totalPairs) * 100;
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    return '😔';
  };

  // Hiệu ứng âm thanh khi hoàn thành
  const playFinishSound = () => {
    if (!audioCtxRef.current) return;
    const audioContext = audioCtxRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
    oscillator.start(audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(2000, audioContext.currentTime + 0.7);
    oscillator.stop(audioContext.currentTime + 0.7);
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  };

  // Hiển thị popup khi hoàn thành game thực sự
  useEffect(() => {
    if (isGameComplete && prevIsGameComplete.current === false && hasPlayed) {
      setShowScorePopup(true);
      playFinishSound();
      setTimeout(() => setShowScorePopup(false), 6000);
    }
    prevIsGameComplete.current = isGameComplete;
  }, [isGameComplete, hasPlayed]);

  // Reset flag khi đổi bài hoặc chơi lại
  useEffect(() => {
    setHasPlayed(false);
  }, [currentLessonIndex]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 font-inter">
      <HeaderBar
        title="Tìm cặp từ giống nhau"
        score={gameScore}
        onHomeClick={() => setGameState ? setGameState('menu') : undefined}
        homeIcon={Home}
      />

      <div className="flex-1 p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Game Stats */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200 px-6 py-3 rounded-2xl shadow-md min-w-[120px]">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-700 text-lg">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-100 to-green-200 px-6 py-3 rounded-2xl shadow-md min-w-[120px]">
              <Trophy className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-gray-700 text-lg">{gameScore} điểm</span>
            </div>
            <button
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-100 to-pink-200 px-6 py-3 rounded-2xl shadow-md min-w-[120px] hover:from-orange-200 hover:to-pink-300 transition-colors duration-200"
              onClick={changeLessonRandom}
              title="Chọn bài học ngẫu nhiên"
            >
              <Shuffle className="w-6 h-6 text-orange-600" />
              <span className="font-semibold text-gray-700 text-lg">Bài khác</span>
            </button>
          </div>

          
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative">
          {/* Nút Chơi lại - góc trái trên */}
          <button
            onClick={initializeGame}
            className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Chơi lại
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {lessons[currentLessonIndex]?.icon} {lessons[currentLessonIndex]?.title}
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-3 max-w-md">
              {cards.map((card) => {
                const isFlipped = flippedCards.find(c => c.id === card.id);
                const isMatched = matchedPairs.includes(card.pairId);
                
                return (
                  <MemoryCard
                    key={card.id}
                    card={card}
                    isFlipped={!!isFlipped}
                    isMatched={isMatched}
                    onClick={handleCardClick}
                    disabled={disabled}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Toast điểm số khi hoàn thành + Confetti */}
      {showScorePopup && (
        <>
          <Confetti numberOfPieces={180} recycle={false} className="pointer-events-none z-50" run={true} width={window.innerWidth} height={window.innerHeight} />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-transparent flex flex-col items-center animate-fade-in-up">
              <div className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                Hoàn thành!
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                Điểm: {gameScore}/{cards.length / 2}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameScreen;

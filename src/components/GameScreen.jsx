// components/DragDropMatchGame.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, RefreshCcw, Clock, Lightbulb, Trophy, Star, Volume2, VolumeX, RotateCcw, Target, CheckCircle, XCircle } from 'lucide-react';
import { lessons } from '../data/lessons.js';
import HeaderBar from './HeaderBar.jsx';

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

  // Handle card click
  const handleCardClick = (clickedCard) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 font-inter">
      <HeaderBar
        title="Trò chơi ghép từ"
        score={gameScore}
        onHomeClick={() => setGameState ? setGameState('menu') : undefined}
        homeIcon={Home}
      />

      <div className="flex-1 p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Game Stats */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-700">{gameScore} điểm</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-gray-700">{moves} lần thử</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-700">{streak} chuỗi thắng</span>
            </div>
          </div>

          {/* Game Board */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lật thẻ tìm cặp từ giống nhau</h2>
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

          {/* Feedback */}
          {isGameComplete && (
            <div className="text-center mt-8">
              <div className={`text-2xl font-bold ${getScoreColor()}`}>
                {getScoreEmoji()} Hoàn thành! Điểm: {gameScore}/{cards.length / 2}
              </div>
              <div className="text-sm text-gray-600">
                <div>Số lượt: {moves} | Thời gian: {formatTime(120 - timeLeft)}</div>
                <div>Chuỗi thắng: {streak}</div>
              </div>
              <div className="flex space-x-3 justify-center mt-4">
                <button
                  onClick={initializeGame}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200 text-sm"
                >
                  Chơi lại
                </button>
                <button
                  onClick={changeLesson}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors duration-200 text-sm"
                >
                  Bài khác
                </button>
                <button
                  onClick={() => setGameState('menu')}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-200 text-sm"
                >
                  Về menu
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={initializeGame}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Chơi Lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;

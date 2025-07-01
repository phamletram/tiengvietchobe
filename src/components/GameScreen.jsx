// components/DragDropMatchGame.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, RefreshCcw, Clock, Lightbulb, Trophy, Star, Volume2, VolumeX } from 'lucide-react';
import { lessons } from '../data/lessons.js';

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

const GameScreen = ({ setGameState }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
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
    setScore(0);
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
        setScore(prev => prev + 1);
        setStreak(prev => prev + 1);
        setBestScore(prev => Math.max(prev, score + 1));
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
    const percentage = (score / totalPairs) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = () => {
    const totalPairs = cards.length / 2;
    const percentage = (score / totalPairs) * 100;
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    return '😔';
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setGameState('menu')} 
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <Home className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🃏 Game Lật Chữ 🃏
            </h2>
            <p className="text-xs text-gray-500">{lessons[currentLessonIndex]?.title}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-600" />}
            </button>
            <button 
              onClick={changeLesson}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              <RefreshCcw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-600">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="bg-green-50 p-2 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1">
              <Trophy className="w-3 h-3 text-green-600" />
              <span className="text-xs font-semibold text-green-600">
                {score}
              </span>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-2 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-600">
                {moves}
              </span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-2 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1">
              <Lightbulb className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600">
                {streak}
              </span>
            </div>
          </div>
        </div>


        {/* Memory Cards Grid */}
        <div className="flex-1 flex items-center justify-center">
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

        {/* Bottom Action Area */}
        <div className="mt-4 text-center">
          {isGameComplete ? (
            <div className="space-y-3">
              <div className={`text-2xl font-bold ${getScoreColor()}`}>
                {getScoreEmoji()} Hoàn thành! Điểm: {score}/{cards.length / 2}
              </div>
              
              <div className="text-sm text-gray-600">
                <div>Số lượt: {moves} | Thời gian: {formatTime(120 - timeLeft)}</div>
                <div>Chuỗi thắng: {streak}</div>
              </div>
              
              <div className="flex space-x-3 justify-center">
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
          ) : timeLeft === 0 ? (
            <div className="space-y-3">
              <div className="text-xl font-bold text-red-600">
                ⏰ Hết thời gian!
              </div>
              <div className="text-sm text-gray-600">
                Điểm: {score}/{cards.length / 2} | Số lượt: {moves}
              </div>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={initializeGame}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200 text-sm"
                >
                  Chơi lại
                </button>
                <button
                  onClick={() => setGameState('menu')}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-200 text-sm"
                >
                  Về menu
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Tìm {cards.length / 2} cặp để hoàn thành!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;

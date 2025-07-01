import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Trophy, Clock, Target } from 'lucide-react';

interface Word {
  vietnamese: string;
  english: string;
  pronunciation: string;
  image: string;
}

interface Lesson {
  title: string;
  icon: string;
  words: Word[];
}

interface Card {
  id: string;
  content: string;
  type: 'vietnamese' | 'english';
  isFlipped: boolean;
  isMatched: boolean;
  originalWord: Word;
}

const WordGame: React.FC = () => {
  const sampleLesson: Lesson = {
    title: "Làm quen – Chào hỏi",
    icon: "🤝",
    words: [
      { vietnamese: "Xin chào", english: "Hello", pronunciation: "Xin chào", image: "👋" },
      { vietnamese: "Tạm biệt", english: "Bye Bye", pronunciation: "Tạm biệt", image: "👋" },
      { vietnamese: "Cảm ơn", english: "Thank you", pronunciation: "Cảm ơn", image: "🙇" },
      { vietnamese: "Xin lỗi", english: "Sorry", pronunciation: "Xin lỗi", image: "😔" },
      { vietnamese: "Em tên là", english: "My name is", pronunciation: "Em tên là", image: "👤" }
    ]
  };

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);

  // Initialize game
  const initializeGame = () => {
    const gameCards: Card[] = [];
    
    sampleLesson.words.forEach((word, index) => {
      // Vietnamese card
      gameCards.push({
        id: `vn-${index}`,
        content: word.vietnamese,
        type: 'vietnamese',
        isFlipped: false,
        isMatched: false,
        originalWord: word
      });
      
      // English card
      gameCards.push({
        id: `en-${index}`,
        content: word.english,
        type: 'english',
        isFlipped: false,
        isMatched: false,
        originalWord: word
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setAttempts(0);
    setGameCompleted(false);
    setGameStarted(true);
    setStartTime(Date.now());
    setGameTime(0);
  };

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId)) return;
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      
      // Check for match after a short delay
      setTimeout(() => {
        checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  // Check if two flipped cards match
  const checkForMatch = (flippedCardIds: string[]) => {
    const [firstCardId, secondCardId] = flippedCardIds;
    const firstCard = cards.find(card => card.id === firstCardId);
    const secondCard = cards.find(card => card.id === secondCardId);

    if (firstCard && secondCard) {
      const isMatch = firstCard.originalWord.vietnamese === secondCard.originalWord.vietnamese &&
                     firstCard.type !== secondCard.type;

      if (isMatch) {
        // Cards match
        setMatchedPairs(prev => [...prev, firstCard.originalWord.vietnamese]);
        setCards(prevCards => 
          prevCards.map(card => 
            (card.id === firstCardId || card.id === secondCardId) 
              ? { ...card, isMatched: true }
              : card
          )
        );
      } else {
        // Cards don't match - flip them back
        setCards(prevCards => 
          prevCards.map(card => 
            (card.id === firstCardId || card.id === secondCardId) 
              ? { ...card, isFlipped: false }
              : card
          )
        );
      }
    }

    setFlippedCards([]);
  };

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted && startTime) {
      interval = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted, startTime]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length === sampleLesson.words.length && gameStarted) {
      setGameCompleted(true);
      setGameStarted(false);
    }
  }, [matchedPairs.length, sampleLesson.words.length, gameStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        {gameStarted && (
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">{formatTime(gameTime)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-700">{attempts} attempts</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-700">{matchedPairs.length}/{sampleLesson.words.length} pairs</span>
            </div>
          </div>
        )}

        {/* Game Board */}
        {!gameStarted && !gameCompleted ? (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
              <div className="text-6xl mb-6">{sampleLesson.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to play?</h2>
              <p className="text-gray-600 mb-8">
                Flip cards to match Vietnamese words with their English translations. 
                Try to complete all pairs in the shortest time with fewest attempts!
              </p>
              <button
                onClick={initializeGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Shuffle className="w-6 h-6 inline mr-2" />
                Start Game
              </button>
            </div>
          </div>
        ) : gameCompleted ? (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
              <p className="text-gray-600 mb-6">
                You completed the game in {formatTime(gameTime)} with {attempts} attempts!
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={initializeGame}
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
                      {card.type === 'vietnamese' && (
                        <div className="text-xs opacity-90 mt-1">
                          {card.originalWord.pronunciation}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-4xl text-gray-400">❓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Control Buttons */}
        {gameStarted && (
          <div className="text-center">
            <button
              onClick={initializeGame}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Restart Game
            </button>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default WordGame;
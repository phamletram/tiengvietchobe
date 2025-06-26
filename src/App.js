import React, { useState, useEffect } from 'react';
import { Volume2, Star, ArrowLeft, ArrowRight, Home, Trophy, Heart } from 'lucide-react';
import PageCounter from './components/PageCounter';

const VietnameseLearningApp = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('menu'); // menu, lesson, quiz, complete
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  
  
  // Lesson data for the learning app
  const lessons = [
    {
      title: "Làm quen – Chào hỏi",
      icon: "🤝",
      words: [
        { vietnamese: "Xin chào", english: "Hello", pronunciation: "Xin chào", image: "👋" },
        { vietnamese: "Tạm biệt", english: "Bye Bye", pronunciation: "Tạm biệt", image: "👋" },
        { vietnamese: "Cảm ơn", english: "Thank you", pronunciation: "Cảm ơn", image: "🙇" },
        { vietnamese: "Xin lỗi", english: "Sorry", pronunciation: "Xin lỗi", image: "🙁" },
        { vietnamese: "Em tên là", english: "My name is", pronunciation: "Em tên là", image: "🙂" }
      ]
    },
    {
      title: "Gia đình",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { vietnamese: "Mẹ", english: "Mother",  image: "👩" },
        { vietnamese: "Bố", english: "Father",  image: "👨" },
        { vietnamese: "Ông", english: "Grandpa",  image: "👴" },
        { vietnamese: "Bà", english: "Grandma",  image: "👵" },
        { vietnamese: "Anh", english: "Brother",  image: "👦" },
        { vietnamese: "Chị", english: "Sister",  image: "👧" },
        { vietnamese: "Con", english: "Child", image: "👶" },
      ]
    },
    {
      title: "Màu sắc",
      icon: "🌈",
      words: [
        { vietnamese: "Đỏ", english: "Red",  image: "🔴" },
        { vietnamese: "Xanh dương", english: "Blue", image: "🔵" },
        { vietnamese: "Vàng", english: "Yellow",image: "🟡" },
        { vietnamese: "Xanh lá", english: "Green", image: "🟢" },
        { vietnamese: "Tím", english: "Purple",  image: "🟣" },
        { vietnamese: "Đen", english: "Black",  image: "⚫" },
        { vietnamese: "Trắng", english: "White",  image: "⚪" },
        { vietnamese: "Hồng", english: "Pink",  image: "🌸" },
        { vietnamese: "Nâu", english: "Brown",  image: "🟤" },
        { vietnamese: "Xám", english: "Gray", image: "🩶" },
        { vietnamese: "Vàng chanh", english: "Lemon Yellow",  image: "🍋" },
        { vietnamese: "Cam", english: "Orange",  image: "🟠" }
      ]
    },
    {
      title: "Động vật",
      icon: "🐶",
      words: [
        { vietnamese: "Chó", english: "Dog",  image: "🐕" },
        { vietnamese: "Mèo", english: "Cat",  image: "🐱" },
        { vietnamese: "Gà", english: "Chicken",  image: "🐔" },
        { vietnamese: "Vịt", english: "Duck",  image: "🦆" },
        { vietnamese: "Cá", english: "Fish",  image: "🐟" },
        { vietnamese: "Bò", english: "Cow",  image: "🐄" },
        { vietnamese: "Ngựa", english: "Horse",  image: "🐎" },
        { vietnamese: "Cừu", english: "Sheep",  image: "🐑" },
        { vietnamese: "Lợn", english: "Pig",  image: "🐖" },
        { vietnamese: "Thỏ", english: "Rabbit",  image: "🐇" },
        { vietnamese: "Khỉ", english: "Monkey",  image: "🐒" },
        { vietnamese: "Sư tử", english: "Lion",  image: "🦁" },
        { vietnamese: "Hổ", english: "Tiger",  image: "🐅" },
        { vietnamese: "Gấu", english: "Bear",  image: "🐻" },
        { vietnamese: "Rắn", english: "Snake",  image: "🐍" }
      ]
    },
    {
      title: "Số đếm",
      icon: "🔢",
      words: [
        { vietnamese: "Một", english: "One",  image: "1️⃣" },
        { vietnamese: "Hai", english: "Two",  image: "2️⃣" },
        { vietnamese: "Ba", english: "Three",  image: "3️⃣" },
        { vietnamese: "Bốn", english: "Four",  image: "4️⃣" },
        { vietnamese: "Năm", english: "Five",  image: "5️⃣" },
        { vietnamese: "Sáu", english: "Six",  image: "6️⃣" },
        { vietnamese: "Bảy", english: "Seven",  image: "7️⃣" },
        { vietnamese: "Tám", english: "Eight",  image: "8️⃣" },
        { vietnamese: "Chín", english: "Nine",  image: "9️⃣" },
        { vietnamese: "Mười", english: "Ten",  image: "🔟" }
      ]
    },
    {
      title: "Bộ phận cơ thể",
      icon: "🦵",
      words: [
        { vietnamese: "Đầu", english: "Head",  image: "🧑" },
        { vietnamese: "Mắt", english: "Eye",  image: "👁️" },
        { vietnamese: "Mũi", english: "Nose",  image: "👃" },
        { vietnamese: "Miệng", english: "Mouth",  image: "👄" },
        { vietnamese: "Tai", english: "Ear",  image: "👂" },
        { vietnamese: "Tay", english: "Hand",  image: "✋" },
        { vietnamese: "Chân", english: "Leg",  image: "🦵" },
        { vietnamese: "Bàn chân", english: "Foot",  image: "🦶" },
        { vietnamese: "Cánh tay", english: "Arm",  image: "💪" },
        { vietnamese: "Bàn tay", english: "Hand",  image: "✋" },
        { vietnamese: "Ngón tay", english: "Finger",  image: "🫵" }
      ]
    },
    {
      title: "Đồ vật trong nhà",
      icon: "🏠",
      words: [
        { vietnamese: "Ghế", english: "Chair",  image: "🪑" },
        { vietnamese: "Cái quạt", english: "Fan",  image: "🌀" },
        { vietnamese: "Bàn", english: "Table",  image: "🛋️" },
        { vietnamese: "Giường", english: "Bed",  image: "🛏️" },
        { vietnamese: "Tủ lạnh", english: "Refrigerator",  image: "🧊" },
        { vietnamese: "Bếp", english: "Kitchen",  image: "🍳" },
        { vietnamese: "Lò vi sóng", english: "Microwave",  image: "📡" },
        { vietnamese: "Tivi", english: "Television",  image: "📺" },
        { vietnamese: "Điện thoại", english: "Phone",  image: "📱" },
        { vietnamese: "Máy tính", english: "Computer",  image: "💻" },
        { vietnamese: "Đèn", english: "Light",  image: "💡" },
        { vietnamese: "Cửa", english: "Door",  image: "🚪" }, 
        { vietnamese: "Cửa sổ", english: "Window",  image: "🪟" },
        { vietnamese: "Tranh ảnh", english: "Picture",  image: "🖼️" }
      ]
    },
    {
      title: "Cảm xúc",
      icon: "😊",
      words: [
        { vietnamese: "Vui", english: "Happy",  image: "😊"},
        { vietnamese: "Buồn", english: "Sad",  image: "😢" },
        { vietnamese: "Giận", english: "Angry",  image: "😠" },
        { vietnamese: "Sợ hãi", english: "Scared",  image: "😨" },
        { vietnamese: "Ngạc nhiên", english: "Surprised",  image: "😲" },
        { vietnamese: "Thích thú", english: "Excited",  image: "🤩" },
        { vietnamese: "Chán nản", english: "Bored",  image: "😒" }
      ]
    },
    {
      title: "Thời tiết",
      icon: "☀️",
      words: [
        { vietnamese: "Nắng", english: "Sunny",  image: "☀️" },
        { vietnamese: "Mưa", english: "Rainy",  image: "🌧️" },
        { vietnamese: "Gió", english: "Windy",  image: "🌬️" },
        { vietnamese: "Mây", english: "Cloudy",  image: "☁️" },
        { vietnamese: "Sương mù", english: "Foggy",  image: "🌫️" },
        { vietnamese: "Tuyết", english: "Snowy",  image: "❄️" },
        { vietnamese: "Nóng", english: "Hot",  image: "🔥"},
      ]
    },
    {
      title: "Rau củ và trái cây",
      icon: "🥦",
      words: [
        { vietnamese: "Cà rốt", english: "Carrot",  image: "🥕" },
        { vietnamese: "Khoai tây", english: "Potato",  image: "🥔" },
        { vietnamese: "Cà chua", english: "Tomato",  image: "🍅" },
        { vietnamese: "Hành tây", english: "Onion",  image: "🧅"},
        { vietnamese: "Bắp cải", english: "Cabbage",  image: "🥬" },
        { vietnamese: "Rau diếp", english: "Lettuce",  image: "🥗" },
        { vietnamese: "Dưa hấu", english: "Watermelon",  image: "🍉" },
        { vietnamese: "Chuối", english: "Banana",  image: "🍌" },
        { vietnamese: "Táo", english: "Apple",  image: "🍎" },
        { vietnamese: "Cam", english: "Orange",  image: "🍊" },
        { vietnamese: "Nho", english: "Grapes",  image: "🍇" },
        { vietnamese: "Dứa", english: "Pineapple",  image: "🍍" },
        { vietnamese: "Xoài", english: "Mango",  image: "🥭" },
        { vietnamese: "Quýt", english: "Tangerine",  image: "🍊"}
      ]
    },
    {
      title: "Phương tiện giao thông",
      icon: "🚗",
      words: [
        { vietnamese: "Xe đạp", english: "Bicycle",  image: "🚲" },
        { vietnamese: "Xe máy", english: "Motorbike",  image: "🏍️" },
        { vietnamese: "Ô tô", english: "Car",  image: "🚗" },
        { vietnamese: "Xe buýt", english: "Bus",  image: "🚌" },
        { vietnamese: "Tàu hỏa", english: "Train",  image: "🚆" },
        { vietnamese: "Máy bay", english: "Airplane",  image: "✈️" },
        { vietnamese: "Tàu thủy", english: "Boat",  image: "⛵" },
        { vietnamese: "Xe tải", english: "Truck",  image: "🚚" },
        { vietnamese: "Xe cứu hỏa", english: "Fire truck",  image: "🚒" },
        { vietnamese: "Xe cảnh sát", english: "Police car",  image: "🚓" },
        { vietnamese: "Xe taxi", english: "Taxi",  image: "🚕" },
        { vietnamese: "Xe lửa", english: "Train",  image: "🚂" },
        { vietnamese: "Xe điện", english: "Tram",  image: "🚋" },
      ]
    },
    {
      title: "Hình khối",
      icon: "🔷",
      words: [
        { vietnamese: "Hình vuông", english: "Square",  image: "🔲" },
        { vietnamese: "Hình tròn", english: "Circle",  image: "🔵" },
        { vietnamese: "Hình tam giác", english: "Triangle",  image: "🔺" },
        { vietnamese: "Hình chữ nhật", english: "Rectangle",  image: "🟥" },
        { vietnamese: "Hình thoi", english: "Diamond",  image: "🔸" },
        { vietnamese: "Hình trái tim", english: "Heart",  image: "❤️" },
        { vietnamese: "Hình sao", english: "Star",  image: "⭐" },
      ]
    }
  ];

  // Function to play sound (Vietnamese pronunciation)
  const playSound = (text) => {
    window.responsiveVoice.speak(text, 'Vietnamese Female', { rate: 1 });
  };

  // Function to generate quiz options, ensuring the correct answer is included
  const generateQuizOptions = (correctWord) => {
    const lesson = lessons[currentLesson];
    // Filter out the correct word to pick other random options
    const otherWords = lesson.words.filter(w => w.vietnamese !== correctWord.vietnamese);
    // Shuffle and pick 2 random incorrect options
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    const options = [correctWord, ...shuffled.slice(0, 2)];
    // Shuffle all options to randomize their display order
    return options.sort(() => 0.5 - Math.random());
  };

  // Handler for quiz answer selection
  const handleQuizAnswer = (selectedWord) => {
    const correctWord = lessons[currentLesson].words[currentWord];
    setSelectedAnswer(selectedWord); // Set selected answer for immediate visual feedback
    setShowResult(true); // Show result message

    if (selectedWord.vietnamese === correctWord.vietnamese) {
      setScore(score + 10); // Increase score if correct
      playSound("Đúng rồi!"); // Play correct sound
    } else {
      setLives(lives - 1); // Decrease lives if incorrect
      playSound("Sai rồi, thử lại nhé!"); // Play incorrect sound
    }

    // After a delay, reset for the next word or end quiz
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentWord < lessons[currentLesson].words.length - 1) {
        setCurrentWord(currentWord + 1); // Move to next word
      } else {
        setGameState('complete'); // Quiz finished
      }
    }, 2000); // 2-second delay for result display
  };

  // Resets the game state to default (menu)
  const resetGame = () => {
    setCurrentWord(0);
    setScore(0);
    setLives(3);
    setGameState('menu');
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // --- UI Components for different game states ---

  // Menu Screen: Displays available lessons
  const MenuScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 font-inter">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
          Học Tiếng Việt <span className="text-opacity-90 text-yellow-200">🇻🇳</span>
        </h1>
        <p className="text-xl md:text-2xl text-white drop-shadow-md opacity-90">Vui học cùng bé!</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl w-full">
        {lessons.map((lesson, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentLesson(index);
              setGameState('lesson');
            }}
            className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
          >
            <div className="text-7xl mb-4 text-center group-hover:animate-bounce-y">{lesson.icon}</div>
            <h3 className="text-2xl sm:text-2xl font-bold text-gray-800 text-center mb-1">{lesson.title}</h3>
            <p className="text-gray-600 text-center text-sm">{lesson.words.length} từ vựng</p>
          </button>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center space-x-6 text-white">
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
            <Trophy className="w-6 h-6 mr-2 text-yellow-300" />
            <span className="text-xl font-semibold">Điểm: {score}</span>
          </div>
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
            <Heart className="w-6 h-6 mr-2 text-red-300 animate-pulse" />
           
            
          </div>
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
          <PageCounter />
           
            
          </div>
          
        </div>
      </div>
    </div>
  );

  // Lesson Screen: Displays words and allows navigating through them
  const LessonScreen = () => {
    const word = lessons[currentLesson].words[currentWord];
    
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 font-inter">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-black bg-opacity-20 shadow-lg text-white">
          <button
            onClick={() => setGameState('menu')}
            className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 mb-3 sm:mb-0 hover:bg-opacity-30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white active:scale-95"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="font-semibold">Trang chủ</span>
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-center my-3 sm:my-0">{lessons[currentLesson].title}</h2>
          <div className="flex items-center space-x-4 bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-1 text-yellow-300" />
              <span className="font-semibold">{score}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-1 text-red-300" />
              <span className="font-semibold">{lives}</span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-lg w-full text-center transform transition-transform duration-300 ease-in-out hover:scale-[1.01]">
            <div className="text-8xl mb-6">{word.image}</div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">{word.vietnamese}</h3>
            <p className="text-xl md:text-2xl text-gray-500 mb-6">{word.english}</p>
            
            <button
              onClick={() => playSound(word.vietnamese)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 md:p-5 mb-8 transition-all transform hover:scale-110 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
              aria-label="Play pronunciation"
            >
              <Volume2 className="w-8 h-8 md:w-9 md:h-9" />
            </button>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentWord(Math.max(0, currentWord - 1))}
                disabled={currentWord === 0}
                className="flex items-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-5 py-3 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-95 text-gray-700 font-semibold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Trước
              </button>
              
              <span className="text-gray-600 text-lg font-medium">
                {currentWord + 1} / {lessons[currentLesson].words.length}
              </span>
              
              {currentWord < lessons[currentLesson].words.length - 1 ? (
                <button
                  onClick={() => setCurrentWord(currentWord + 1)}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-3 transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 font-semibold"
                >
                  Tiếp
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentWord(0); // Reset word index for quiz
                    setGameState('quiz');
                  }}
                  className="flex items-center bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-3 transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-95 font-semibold"
                >
                  Kiểm tra
                  <Star className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Quiz Screen: Presents a multiple-choice question
  const QuizScreen = () => {
    const word = lessons[currentLesson].words[currentWord];
    const options = generateQuizOptions(word);
    
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 font-inter">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-black bg-opacity-20 shadow-lg text-white">
          <button
            onClick={() => setGameState('lesson')}
            className="flex items-center bg-white bg-opacity-20 rounded-full px-5 py-2 mb-3 sm:mb-0 hover:bg-opacity-30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-semibold">Học lại</span>
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-center my-3 sm:my-0">Kiểm tra - {lessons[currentLesson].title}</h2>
          <div className="flex items-center space-x-4 bg-white bg-opacity-20 rounded-full px-5 py-2 shadow-md">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-1 text-yellow-300" />
              <span className="font-semibold">{score}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-1 text-red-300" />
              <span className="font-semibold">{lives}</span>
            </div>
          </div>
        </div>

        {/* Main Quiz Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-2xl w-full text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 leading-snug">
              Từ nào có nghĩa là "<span className="text-blue-600">{word.english}</span>"?
            </h3>
            
            <div className="text-7xl md:text-8xl mb-10 animate-fade-in">{word.image}</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleQuizAnswer(option)}
                  disabled={showResult}
                  className={`
                    p-4 sm:p-5 rounded-2xl text-2xl font-bold transition-all transform shadow-md
                    ${
                      showResult
                        ? option.vietnamese === word.vietnamese
                          ? 'bg-green-500 text-white animate-pop'
                          : selectedAnswer?.vietnamese === option.vietnamese
                          ? 'bg-red-500 text-white animate-shake'
                          : 'bg-gray-200 text-gray-600 opacity-60'
                        : 'bg-blue-100 hover:bg-blue-200 text-gray-800 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95'
                    }
                  `}
                >
                  {option.vietnamese}
                </button>
              ))}
            </div>
            
            {showResult && (
              <div className={`text-2xl font-bold p-4 rounded-2xl animate-fade-in-up ${
                selectedAnswer?.vietnamese === word.vietnamese
                  ? 'bg-green-100 text-green-800 shadow-inner'
                  : 'bg-red-100 text-red-800 shadow-inner'
              }`}>
                {selectedAnswer?.vietnamese === word.vietnamese ? '🎉 Đúng rồi!' : `😢 Sai rồi! Từ đúng là "${word.vietnamese}".`}
              </div>
            )}
            
            <div className="mt-8 text-gray-600 text-lg">
              Câu {currentWord + 1} / {lessons[currentLesson].words.length}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Complete Screen: Shown after a lesson is completed
  const CompleteScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 font-inter">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-lg w-full text-center transform transition-transform duration-300 ease-in-out hover:scale-[1.01]">
        <div className="text-8xl mb-6 animate-spin-slow">🏆</div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Hoàn thành!</h2>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Bạn đã hoàn thành bài học "<span className="text-indigo-600 font-semibold">{lessons[currentLesson].title}</span>"
        </p>
        
        <div className="bg-yellow-100 rounded-2xl p-6 mb-8 border-2 border-yellow-200 shadow-inner">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-9 h-9 text-yellow-500 mr-3 animate-pulse" />
            <span className="text-4xl font-extrabold text-yellow-700">{score}</span>
          </div>
          <p className="text-gray-700 text-lg font-medium">Điểm số của bạn</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              setCurrentWord(0);
              setGameState('lesson');
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
          >
            Học lại
          </button>
          
          <button
            onClick={resetGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-3 text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
          >
            Chọn bài khác
          </button>
        </div>
      </div>
    </div>
  );

  // Game Over Screen: Shown when lives run out
  if (lives <= 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 font-inter">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-lg w-full text-center transform transition-transform duration-300 ease-in-out hover:scale-[1.01]">
          <div className="text-8xl mb-6 animate-bounce">😢</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Hết mạng rồi!</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">Đừng lo, hãy thử lại nhé!</p>
          
          <button
            onClick={resetGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 text-xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
          >
            Chơi lại
          </button>
        </div>
      </div>
    );
  }

  // Main render logic based on gameState
  switch (gameState) {
    case 'menu':
      return <MenuScreen />;
    case 'lesson':
      return <LessonScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'complete':
      return <CompleteScreen />;
    default:
      return <MenuScreen />;
  }
};

export default VietnameseLearningApp;
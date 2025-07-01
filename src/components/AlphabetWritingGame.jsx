import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Home, RotateCcw } from 'lucide-react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import HeaderBar from './HeaderBar.jsx';
import PropTypes from 'prop-types';

const vietnameseAlphabet = [
  'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'
];
const vietnameseAlphabetLower = vietnameseAlphabet.map(l => l.toLowerCase());

const CANVAS_SIZE = 128; // Kích thước chuẩn để so sánh pixel

const AlphabetWritingGame = ({ setGameState }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUpper, setIsUpper] = useState(true); // true: in hoa, false: thường
  const canvasRef = useRef();
  const sampleCanvasRef = useRef(); // canvas ẩn để render chữ mẫu

  const currentLetter = isUpper ? vietnameseAlphabet[currentIndex] : vietnameseAlphabetLower[currentIndex];

  const handleClear = () => {
    canvasRef.current.clearCanvas();
  };

  // Hàm render chữ mẫu lên canvas ẩn
  const drawSampleLetter = (letter) => {
    const canvas = sampleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.font = '400 112px "Baloo 2", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#222';
    ctx.fillText(letter, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
  };

  // Vẽ lại chữ mẫu mỗi khi currentLetter đổi
  React.useEffect(() => {
    drawSampleLetter(currentLetter);
  }, [currentLetter]);

  const nextLetter = () => {
    setCurrentIndex((prev) => (prev < vietnameseAlphabet.length - 1 ? prev + 1 : prev));
    handleClear();
  };
  const prevLetter = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    handleClear();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 font-inter">
      <HeaderBar
        title={
          <div className="flex items-center gap-2">
            <span>✍️ Tập viết chữ cái</span>
            <button
              onClick={() => setIsUpper(u => !u)}
              className={
                `ml-2 flex items-center px-2 py-1 rounded-full border-2 border-blue-500 bg-white shadow-sm transition-all duration-200 focus:outline-none hover:bg-blue-50 active:scale-95`
              }
              style={{ minWidth: 56 }}
              title={isUpper ? 'Chuyển sang viết chữ thường' : 'Chuyển sang viết chữ hoa'}
            >
              <span className={`transition-all duration-200 mx-1 ${isUpper ? 'text-blue-600 text-xl font-extrabold' : 'text-blue-400 text-base font-semibold opacity-70'}`}>A</span>
              <span className="mx-0.5 text-blue-300 font-bold select-none">|</span>
              <span className={`transition-all duration-200 mx-1 ${!isUpper ? 'text-blue-600 text-xl font-extrabold' : 'text-blue-400 text-base font-semibold opacity-70'}`}>a</span>
            </button>
          </div>
        }
        score={0}
        onHomeClick={() => setGameState ? setGameState('menu') : undefined}
        homeIcon={Home}
      />
      <div className="flex-1 p-6 sm:p-8">
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 mb-6">
            <div className="flex flex-col items-start justify-start min-w-[80px] md:min-w-[120px] mb-4 md:mb-0">
              <div className="text-7xl md:text-9xl font-extrabold text-blue-600 select-none" style={{ WebkitTextStroke: '2px #b3b3b3', opacity: 0.3 }}>
                {currentLetter}
              </div>
            </div>
            <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-2 md:p-4 relative flex items-center justify-center w-full md:w-[420px] h-[220px] md:h-[420px]">
              <ReactSketchCanvas
                ref={canvasRef}
                width="100%"
                height={window.innerWidth < 768 ? "200px" : "400px"}
                strokeWidth={6}
                strokeColor="#222"
                backgroundColor="transparent"
                style={{ borderRadius: 20, border: '2px solid #e0e0e0', background: 'rgba(255,255,255,0.7)', width: '100%', height: window.innerWidth < 768 ? 200 : 400 }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="font-normal text-blue-600 text-[22vw] md:text-[18rem] lg:text-[22rem]" style={{ fontFamily: '"Baloo 2", Arial, sans-serif', WebkitTextStroke: '1px #b3b3b3', opacity: 0.15 }}>
                  {currentLetter}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
            <button
              onClick={prevLetter}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Trước
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-500 transition-colors duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              Xóa
            </button>
            <button
              onClick={nextLetter}
              disabled={currentIndex === vietnameseAlphabet.length - 1}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Sau
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Canvas ẩn để render chữ mẫu */}
      <canvas ref={sampleCanvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} style={{ display: 'none' }} />
    </div>
  );
};

AlphabetWritingGame.propTypes = {
  setGameState: PropTypes.func,
};

export default AlphabetWritingGame; 
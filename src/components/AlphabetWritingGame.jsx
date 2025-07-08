import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { handleMenuClick } from '../utils/menuUtils.js';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import PropTypes from 'prop-types';
import { useFullscreen } from './Header.jsx';

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
  const { showMenu, setShowMenu } = useResponsiveMenu();
  const { isFullscreen } = useFullscreen() || {};

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

  const onMenuClick = (menuKey) => {
    if (setGameState) {
      handleMenuClick(menuKey, setShowMenu, setGameState);
    }
  };

  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      {!isFullscreen && (
        <Header
          title={<div className="flex items-center gap-2"><span>✍️ Tập viết chữ cái</span>
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
            </button></div>}
          showMenu={showMenu}
          onMenuToggle={() => setShowMenu(show => !show)}
        />
      )}
      {!isFullscreen && (
        <Menu
          showMenu={showMenu}
          onMenuClick={onMenuClick}
        />
      )}
      <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full flex-1 min-h-0 ${showMenu && !isFullscreen ? 'pl-44' : ''} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
        style={{willChange: 'transform', height: isFullscreen ? '100vh' : 'calc(100vh - 56px - 32px)', marginTop: isFullscreen ? 0 : '56px'}}>
        <div className="max-w-4xl mx-auto w-full p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
            <div
              className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-2 md:p-4 relative flex items-center justify-center mx-auto w-full"
              style={{
                height: Math.min(
                  window.innerWidth >= 1280 ? 480 :
                  window.innerWidth >= 1024 ? 380 :
                  window.innerWidth >= 768 ? 380 : 160,
                  480
                ),
                maxHeight: 480
              }}
            >
              <ReactSketchCanvas
                ref={canvasRef}
                width="100%"
                height={Math.min(
                  window.innerWidth >= 1280 ? 480 :
                  window.innerWidth >= 1024 ? 380 :
                  window.innerWidth >= 768 ? 380 : 160,
                  480
                )}
                strokeWidth={6}
                strokeColor="#222"
                backgroundColor="transparent"
                style={{ borderRadius: 20, border: '2px solid #e0e0e0', background: 'rgba(255,255,255,0.7)', width: '100%', height: '100%', maxHeight: 480 }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="font-normal text-blue-600 text-[22vw] md:text-[18rem] lg:text-[22rem]" style={{ fontFamily: '"Baloo 2", Arial, sans-serif', WebkitTextStroke: '1px #b3b3b3', opacity: 0.15 }}>
                  {currentLetter}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-nowrap justify-center gap-1 md:gap-4 mb-6 overflow-x-auto md:overflow-visible relative z-40">
            <button
              onClick={prevLetter}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 md:gap-2 bg-blue-500 text-white px-2 py-1 md:px-6 md:py-3 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              Trước
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 md:gap-2 bg-gray-400 text-white px-2 py-1 md:px-6 md:py-3 rounded-xl font-semibold hover:bg-gray-500 transition-colors duration-200 text-xs md:text-base"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              Xóa
            </button>
            <button
              onClick={nextLetter}
              disabled={currentIndex === vietnameseAlphabet.length - 1}
              className="flex items-center gap-1 md:gap-2 bg-blue-500 text-white px-2 py-1 md:px-6 md:py-3 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs md:text-base"
            >
              Sau
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
        <Footer score={0} />
      </main>
      {/* Canvas ẩn để render chữ mẫu */}
      <canvas ref={sampleCanvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} style={{ display: 'none' }} />
    </div>
  );
};

AlphabetWritingGame.propTypes = {
  setGameState: PropTypes.func,
  isFullscreen: PropTypes.bool,
  setIsFullscreen: PropTypes.func,
};

export default AlphabetWritingGame; 
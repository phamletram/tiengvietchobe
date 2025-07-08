import React, { useState } from 'react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';
import PropTypes from 'prop-types';

const VOWELS = [
  'A', 'Ă', 'Â', 'E', 'Ê', 'I', 'O', 'Ô', 'Ơ', 'U', 'Ư', 'Y'
];
const CONSONANTS = [
  'B', 'C', 'D', 'Đ', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'X'
];

const items = [
  {
    key: 'vowel',
    label: 'Nguyên âm',
    icon: '🅰️',
    desc: 'Các nguyên âm trong tiếng Việt:',
    letters: VOWELS,
  },
  {
    key: 'consonant',
    label: 'Phụ âm',
    icon: '🅱️',
    desc: 'Các phụ âm trong tiếng Việt:',
    letters: CONSONANTS,
  },
];

const VowelConsonantScreen = ({ score, playSound, setGameState }) => {
  const { showMenu, setShowMenu } = useResponsiveMenu(true);
  const { isFullscreen } = useFullscreen() || {};
  const [isUpper, setIsUpper] = useState(true);

  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header
        title="Nguyên âm – Phụ âm"
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(show => !show)}
      />
      {!isFullscreen && (
        <Menu
          showMenu={showMenu}
          onMenuClick={setGameState}
        />
      )}
      <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full overflow-y-auto ${showMenu && !isFullscreen ? 'pl-44' : ''} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
        style={{willChange: 'transform', height: isFullscreen ? '100vh' : 'calc(100vh - 56px - 32px)', marginTop: isFullscreen ? 0 : '56px'}}>
        <div className="relative max-w-3xl w-full p-4 md:p-8 bg-white rounded-2xl shadow-2xl mx-auto mt-8">
          <button
            onClick={() => setIsUpper(u => !u)}
            className="absolute top-2 left-2 flex items-center px-3 py-1 md:px-3 md:py-1 rounded-full border-2 border-blue-300 bg-white shadow-sm transition-all duration-200 focus:outline-none hover:bg-blue-50 active:scale-95 text-blue-600 font-bold text-base md:text-lg"
            style={{ minWidth: 48, zIndex: 30 }}
            title={isUpper ? 'Chuyển sang chữ thường' : 'Chuyển sang chữ hoa'}
          >
            <span className={`mx-1 ${isUpper ? 'text-blue-600 text-lg md:text-xl font-extrabold' : 'text-blue-400 text-base md:text-lg font-semibold opacity-70'}`}>A</span>
            <span className="mx-0.5 text-blue-300 font-bold select-none text-base md:text-lg">|</span>
            <span className={`mx-1 ${!isUpper ? 'text-blue-600 text-lg md:text-xl font-extrabold' : 'text-blue-400 text-base md:text-lg font-semibold opacity-70'}`}>a</span>
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Line ở giữa */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 opacity-60 z-10" style={{transform: 'translateX(-50%)'}}></div>
            {items.map((item) => (
              <div key={item.key} className="group flex flex-col items-center z-20">
                {/* icon đã bị bỏ theo yêu cầu */}
                <h3 className="text-2xl md:text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider drop-shadow-lg" style={{fontFamily:'Baloo 2, Arial, sans-serif'}}>{item.label}</h3>
                <p className="text-gray-600 text-center text-sm mb-2">{item.desc}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {item.letters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={e => {
                        if (playSound) playSound(isUpper ? ch : ch.toLowerCase());
                        e.currentTarget.classList.add('animate-bounce');
                        setTimeout(() => e.currentTarget.classList.remove('animate-bounce'), 500);
                      }}
                      className="inline-block bg-blue-100 text-blue-700 font-bold rounded-lg px-3 py-1 text-lg shadow-sm mb-1 hover:bg-blue-200 active:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      style={{ transition: 'background 0.2s, transform 0.2s' }}
                    >
                      {isUpper ? ch : ch.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer score={score} />
    </div>
  );
};

VowelConsonantScreen.propTypes = {
  score: PropTypes.number,
  playSound: PropTypes.func,
  setGameState: PropTypes.func,
};

export default VowelConsonantScreen; 
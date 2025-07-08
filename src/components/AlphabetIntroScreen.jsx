import React from 'react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';
import PropTypes from 'prop-types';

const alphabetItems = [
  {
    key: 'alphabet',
    label: 'Làm quen chữ cái',
    icon: '🔤',
    desc: 'Nhận diện và học chữ cái tiếng Việt',
  },
  {
    key: 'writing',
    label: 'Tập viết chữ cái',
    icon: '✍️',
    desc: 'Luyện viết chữ cái tiếng Việt',
  },
  {
    key: 'vowel-consonant',
    label: 'Nguyên âm – Phụ âm',
    icon: '🔡',
    desc: 'Nguyên âm và phụ âm tiếng Việt',
  },
  {
    key: 'sort-vowel-consonant',
    label: 'Phân loại nguyên âm – phụ âm',
    icon: '🧩',
    desc: 'Kéo thả chữ cái vào đúng nhóm',
  },
];

const AlphabetIntroScreen = ({ setGameState, score }) => {
  const { showMenu, setShowMenu } = useResponsiveMenu(true);
  const { isFullscreen } = useFullscreen() || {};

  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header
        title="Làm quen chữ cái"
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(show => !show)}
      />
      {!isFullscreen && (
        <Menu
          showMenu={showMenu}
          onMenuClick={(key) => setGameState && setGameState(key)}
        />
      )}
      <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full overflow-y-auto ${showMenu && !isFullscreen ? 'pl-44' : ''} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
        style={{willChange: 'transform', height: isFullscreen ? '100vh' : 'calc(100vh - 56px - 32px)', marginTop: isFullscreen ? 0 : '56px'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl w-full p-8">
          {alphabetItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setGameState && setGameState(item.key)}
              className="group bg-white rounded-2xl p-6 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
            >
              <div className="text-5xl mb-4 text-center group-hover:animate-bounce-y">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">{item.label}</h3>
              <p className="text-gray-600 text-center text-sm">{item.desc}</p>
            </button>
          ))}
        </div>
      </main>
      <Footer score={score} />
    </div>
  );
};

AlphabetIntroScreen.propTypes = {
  setGameState: PropTypes.func,
  score: PropTypes.number,
};

export default AlphabetIntroScreen; 
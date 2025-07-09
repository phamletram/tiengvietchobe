import React from 'react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const AlphabetIntroScreen = ({ setGameState, score }) => {
  const { t } = useTranslation();
  const { showMenu, setShowMenu } = useResponsiveMenu(true);
  const { isFullscreen } = useFullscreen() || {};

  const alphabetItems = [
    {
      key: 'alphabet',
      label: t('alphabet_intro.title'),
      icon: '🔤',
      desc: t('alphabet_intro.desc'),
    },
    {
      key: 'writing',
      label: t('alphabet_intro.writing'),
      icon: '✍️',
      desc: t('alphabet_intro.writing_desc'),
    },
    {
      key: 'vowel-consonant',
      label: t('alphabet_intro.vowel_consonant'),
      icon: '🔡',
      desc: t('alphabet_intro.vowel_consonant_desc'),
    },
    {
      key: 'sort-vowel-consonant',
      label: t('alphabet_intro.sort'),
      icon: '🧩',
      desc: t('alphabet_intro.sort_desc'),
    },
  ];

  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header
        title={t('alphabet_intro.title')}
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
        <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-full w-full p-2 sm:p-4 md:p-8">
          {alphabetItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setGameState && setGameState(item.key)}
              className="group bg-white rounded-2xl p-2 sm:p-4 md:p-6 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-100"
              style={{ minWidth: 0 }}
            >
              <div className="text-2xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 text-center group-hover:animate-bounce-y">{item.icon}</div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 text-center mb-1">{item.label}</h3>
              
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
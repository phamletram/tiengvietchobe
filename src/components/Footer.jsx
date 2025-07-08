import React from 'react';
import { Trophy } from 'lucide-react';
import PageCounter from './PageCounter.jsx';
import PropTypes from 'prop-types';
import { useFullscreen } from './Header.jsx';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'vi', label: 'vi' },
  { code: 'en', label: 'en' },
  { code: 'ja', label: 'jp' },
];

const Footer = ({ score }) => {
  const { isFullscreen } = useFullscreen() || {};
  const { i18n } = useTranslation();
  if (isFullscreen) return null;
  return (
    <footer className="w-full flex items-center justify-between gap-4 py-1 z-20 fixed bottom-0 left-0 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 shadow-md px-2 sm:px-4">
      <div className='absolute left-0 top-0 w-full h-[2px] pointer-events-none'>
        <div className='w-full h-full rounded-full' style={{background: 'linear-gradient(90deg, #c084fc 0%, #fbcfe8 50%, #a21caf 100%)', opacity: 0.7}}></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-nowrap overflow-hidden">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-nowrap">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6" style={{color: '#fff', minWidth: '1.25rem'}} />
          <span className="text-base sm:text-xl font-semibold text-white truncate max-w-[120px] sm:max-w-none" style={{fontFamily:'Baloo 2, Arial, sans-serif'}}>Điểm: {score}</span>
        </div>
        <div className="flex items-center text-white min-w-0">
          <PageCounter />
        </div>
      </div>
      <div className="flex items-center gap-0 min-w-[90px] justify-end select-none">
        {LANGS.map((lang, idx) => (
          <button
            key={lang.code}
            className={`px-1 text-xs font-bold transition focus:outline-none border-none bg-transparent rounded-none ${i18n.language === lang.code ? 'text-white' : 'text-white/60'} ${idx !== LANGS.length-1 ? '' : ''}`}
            style={{borderRadius:0, border:'none', background:'none', outline:'none'}}
            onClick={() => {
              i18n.changeLanguage(lang.code);
              localStorage.setItem('lng', lang.code);
            }}
            aria-label={lang.label}
          >
            {lang.label}
          </button>
        )).reduce((prev, curr, idx) => prev === null ? [curr] : [...prev, <span key={'sep'+idx} className="text-white/40 px-0.5">|</span>, curr], null)}
      </div>
    </footer>
  );
};

Footer.propTypes = {
  score: PropTypes.number,
};

export default Footer; 
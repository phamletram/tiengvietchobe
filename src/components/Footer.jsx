import React from 'react';
import { Trophy } from 'lucide-react';
import PageCounter from './PageCounter.jsx';
import PropTypes from 'prop-types';
import { useFullscreen } from './Header.jsx';

const Footer = ({ score }) => {
  const { isFullscreen } = useFullscreen() || {};
  if (isFullscreen) return null;
  return (
    <footer className="w-full flex items-center justify-center gap-6 py-1 z-20 fixed bottom-0 left-0 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 shadow-md">
      <div className='absolute left-0 top-0 w-full h-[2px] pointer-events-none'>
        <div className='w-full h-full rounded-full' style={{background: 'linear-gradient(90deg, #c084fc 0%, #fbcfe8 50%, #a21caf 100%)', opacity: 0.7}}></div>
      </div>
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6" style={{color: '#fff'}} />
        <span className="text-xl font-semibold text-white" style={{fontFamily:'Baloo 2, Arial, sans-serif'}}>Điểm: {score}</span>
      </div>
      
      <div className="flex items-center text-white">
        <PageCounter />
      </div>
    </footer>
  );
};

Footer.propTypes = {
  score: PropTypes.number,
};

export default Footer; 
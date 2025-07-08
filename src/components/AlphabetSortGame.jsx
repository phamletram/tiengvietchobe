import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Footer from './Footer.jsx';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu.js';
import { useFullscreen } from './Header.jsx';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';

const VOWELS = ['A', 'Ă', 'Â', 'E', 'Ê', 'I', 'O', 'Ô', 'Ơ', 'U', 'Ư', 'Y'];
const CONSONANTS = ['B', 'C', 'D', 'Đ', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'X'];
const ALL_LETTERS = [...VOWELS, ...CONSONANTS];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const AlphabetSortGame = ({ score, setScore, setGameState }) => {
  const { t } = useTranslation();
  const { showMenu, setShowMenu } = useResponsiveMenu(true);
  const { isFullscreen } = useFullscreen() || {};
  const [letters, setLetters] = useState(
    shuffle(ALL_LETTERS).map(l => ({ letter: l, box: null, status: null }))
  );
  const [feedback, setFeedback] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const allSorted = letters.every(l => l.box !== null);
    const allCorrect = letters.every(l => l.status === 'correct');
    if (letters.length === 29 && allSorted && allCorrect) {
      setShowCongrats(true);
      playClap();
    } else {
      setShowCongrats(false);
    }
  }, [letters]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) {
      setActiveId(null);
      return;
    }
    const box = over.id;
    const letterObj = letters.find(l => l.letter === active.id);
    if (!letterObj || letterObj.box !== null) {
      setActiveId(null);
      return;
    }
    const isVowel = VOWELS.includes(letterObj.letter);
    const correct = (box === 'vowel' && isVowel) || (box === 'consonant' && !isVowel);
    setLetters(letters => letters.map(l =>
      l.letter === letterObj.letter ? { ...l, box, status: correct ? 'correct' : 'wrong' } : l
    ));
    setFeedback(correct ? 'Đúng rồi!' : 'Sai rồi!');
    if (correct) {
      playDingSound();
      if (setScore) setScore(score + 5);
    } else playBuzzSound();
    setTimeout(() => setFeedback(''), 1200);
    setActiveId(null);
  };

  const handleReset = () => {
    setLetters(shuffle(ALL_LETTERS).map(l => ({ letter: l, box: null, status: null })));
    setFeedback('');
    setActiveId(null);
    setShowCongrats(false);
  };

  const handleBackToList = (letter) => {
    setLetters(letters => letters.map(l =>
      l.letter === letter ? { ...l, box: null, status: null } : l
    ));
  };

  const playDingSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 700;
    g.gain.value = 0.18;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.15);
    o.onended = () => ctx.close();
  };
  const playBuzzSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = 180;
    g.gain.value = 0.18;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.18);
    o.onended = () => ctx.close();
  };

  const playClap = () => {
    const audio = new window.Audio('/public/sounds/applause.mp3');
    audio.play();
  };

  return (
    <div className="h-screen flex flex-col font-inter relative overflow-hidden" style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)'}}>
      <Header
        title={t('sort_game.title')}
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(show => !show)}
      />
      {!isFullscreen && (
        <Menu
          showMenu={showMenu}
          onMenuClick={setGameState}
        />
      )}
      <main className={`transition-all duration-300 flex flex-col items-center justify-start w-full ${showMenu && !isFullscreen ? 'pl-44' : ''} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} overflow-y-auto md:overflow-y-visible`}
        style={{willChange: 'transform', height: isFullscreen ? '100vh' : 'calc(100vh - 56px - 32px)', marginTop: isFullscreen ? 0 : '56px', touchAction: 'none'}}>
        {showCongrats && (
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={400} recycle={false} />
        )}
        <div className="max-w-4xl w-full mx-auto mt-8">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
              <DropBox
                id="vowel"
                label={t('sort_game.vowel')}
                letters={letters.filter(l => l.box === 'vowel')}
                onBack={handleBackToList}
              />
              <DropBox
                id="consonant"
                label={t('sort_game.consonant')}
                letters={letters.filter(l => l.box === 'consonant')}
                onBack={handleBackToList}
              />
            </div>
            {/* Các chữ cái chưa phân loại */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {letters.filter(l => l.box === null).map((l) => (
                <DraggableLetter key={l.letter} letterObj={l} activeId={activeId} />
              ))}
            </div>
            <DragOverlay>
              {activeId ? (
                <DraggableLetter letterObj={{ letter: activeId }} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
          {/* Feedback */}
          {(feedback || showCongrats) && (
            <div className={`mt-6 text-2xl font-bold text-center ${feedback === t('sort_game.correct') || showCongrats ? 'text-green-600' : 'text-red-500'}`}>
              {showCongrats ? t('sort_game.all_correct') : feedback === 'Đúng rồi!' ? t('sort_game.correct') : feedback === 'Sai rồi!' ? t('sort_game.wrong') : feedback}
            </div>
          )}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {t('sort_game.reset')}
            </button>
          </div>
        </div>
      </main>
      <Footer score={score} />
    </div>
  );
};

function DropBox({ id, label, letters, onBack }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[370px] min-h-[210px] md:min-w-[180px] md:min-h-[120px] bg-white rounded-2xl shadow-lg p-4 border-2 border-blue-200 flex flex-col items-center justify-start relative transition-all duration-200 ml-2 mr-2 ${isOver ? 'ring-4 ring-blue-400' : ''}`}
    >
      <div className="text-lg font-bold text-blue-700 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2 justify-center min-h-[40px]">
        {letters.map((l) => (
          <button
            key={l.letter}
            onClick={() => onBack && onBack(l.letter)}
            className={`select-none inline-block px-4 py-2 rounded-xl text-2xl font-bold shadow-md border-2 transition-all duration-200
              ${l.status === 'correct' ? 'bg-green-100 border-green-400 text-green-700' : l.status === 'wrong' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-blue-100 border-blue-300 text-blue-700'}
              hover:bg-yellow-100 active:scale-95`}
            style={{ minWidth: 44, minHeight: 44 }}
            type="button"
          >
            {l.letter}
          </button>
        ))}
      </div>
    </div>
  );
}

function DraggableLetter({ letterObj, activeId, isOverlay, disabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: letterObj.letter,
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`select-none cursor-move inline-block px-4 py-2 rounded-xl text-2xl font-bold shadow-md border-2 transition-all duration-200
        ${letterObj.status === 'correct' ? 'bg-green-100 border-green-400 text-green-700' : letterObj.status === 'wrong' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-blue-100 border-blue-300 text-blue-700'}
        ${disabled ? 'opacity-60 cursor-default' : 'hover:bg-blue-200 active:scale-95'}
        ${isDragging || isOverlay ? 'z-50 scale-110' : ''}`}
      style={{ minWidth: 44, minHeight: 44, transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}
    >
      {letterObj.letter}
    </div>
  );
}

export default AlphabetSortGame; 
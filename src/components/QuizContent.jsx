// components/QuizContent.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const QuizContent = ({
  word,
  options,
  currentWord,
  totalWords,
  handleQuizAnswer,
  selectedAnswer,
  showResult,
  lives,
  resetGame
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  let mainWord = word ? word.vietnamese : '';
  
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-2xl w-full text-center relative">
      {word && (
        <>
          <h3 className="font-bold text-gray-800 mb-8 leading-snug text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            {t('quiz.question', { meaning: '' })}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold mx-1 align-middle break-words inline-block text-base sm:text-lg md:text-2xl lg:text-3xl">
              {mainWord}
            </span>
            ?
          </h3>
          <div className="text-7xl md:text-8xl mb-10 animate-fade-in">
            {word.image && word.image.startsWith('/') ? (
              <div className="flex justify-center">
                <img 
                  src={word.image} 
                  alt={mainWord || 'Image'} 
                  className="w-32 h-32 object-cover"
                />
              </div>
            ) : (
              <div className="text-center">
                {word.image}
              </div>
            )}
          </div>
        </>
      )}
      
      {currentWord >= totalWords ? (
        <div className="col-span-2 w-full flex flex-col items-center justify-center py-8">
          <div className="text-green-600 text-xl sm:text-2xl md:text-3xl font-bold mb-4 whitespace-nowrap">{t('quiz.completed', 'Bạn đã hoàn thành quiz!')}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {options.map((option, index) => {
            let optionText = option.vietnamese;
            if (lang === 'en') optionText = option.english;
            if (lang === 'ja') optionText = option.japanese;
            return (
              <button
                key={index}
                onClick={() => !showResult && handleQuizAnswer(option)}
                disabled={showResult}
                className={`
                  p-3 sm:p-4 rounded-2xl text-xs sm:text-sm md:text-base font-bold transition-all transform shadow-md whitespace-nowrap max-w-full overflow-x-auto
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
                style={{minWidth: 0}}
              >
                {optionText}
              </button>
            );
          })}
        </div>
      )}
      
      {showResult && (
        <div className={`text-xs sm:text-sm md:text-base font-bold p-4 rounded-2xl animate-fade-in-up whitespace-nowrap max-w-full ${
          selectedAnswer?.vietnamese === word.vietnamese
            ? 'bg-green-100 text-green-800 shadow-inner'
            : 'bg-red-100 text-red-800 shadow-inner'
        }`}>
          {selectedAnswer?.vietnamese === word.vietnamese 
            ? t('quiz.correct')
            : t('quiz.incorrect', { answer: lang === 'en' ? word.english : lang === 'ja' ? word.japanese : word.vietnamese })}
        </div>
      )}
      
      {lives <= 0 && (
        <div className="mt-8 w-full flex flex-col items-center justify-center">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 truncate whitespace-nowrap max-w-full mt-[-10px]">{t('gameover.title')}</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 truncate whitespace-nowrap max-w-full">{t('gameover.desc')}</p>
          
        </div>
      )}
      {/* Progress and reset button row at the bottom */}
      <div className="flex flex-row items-center justify-center gap-4 w-full mt-2 mb-2">
      {currentWord < totalWords && (
        <span className="text-white bg-blue-500 rounded-2xl py-2 px-6 text-xs sm:text-sm md:text-base font-bold shadow-lg whitespace-nowrap max-w-full">
          {t('quiz.progress', { current: currentWord + 1, total: totalWords })}
        </span>
      )}
        {(lives <= 0 || currentWord >= totalWords) && (
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white rounded-2xl py-2 px-6 text-xs sm:text-sm md:text-base font-bold transition-all transform hover:scale-110 active:scale-95 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 animate-pulse flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a9 9 0 1 1 3.6 3.6l-3.6-3.6zm0 0V15m0 4.5H9" /></svg>
            {t('gameover.retry')}
          </button>
        )}
        
       
      </div>
    </div>
  );
};

QuizContent.propTypes = {
  word: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  currentWord: PropTypes.number.isRequired,
  totalWords: PropTypes.number.isRequired,
  handleQuizAnswer: PropTypes.func.isRequired,
  selectedAnswer: PropTypes.object,
  showResult: PropTypes.bool.isRequired,
  lives: PropTypes.number.isRequired,
  resetGame: PropTypes.func.isRequired,
};

export default QuizContent;
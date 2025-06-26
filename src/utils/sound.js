// utils/sound.js
export const playSound = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  
  export const generateQuizOptions = (correctWord, allWords) => {
    const otherWords = allWords.filter(w => w.vietnamese !== correctWord.vietnamese);
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    const options = [correctWord, ...shuffled.slice(0, 2)];
    return options.sort(() => 0.5 - Math.random());
  };
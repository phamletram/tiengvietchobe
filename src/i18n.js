import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './i18n/vi.json';
import en from './i18n/en.json';
import ja from './i18n/ja.json';

const resources = {
  vi: { translation: vi },
  en: { translation: en },
  ja: { translation: ja },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || 'vi',
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
  });

export default i18n; 
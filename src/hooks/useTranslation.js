import { useLanguage } from '../context/LanguageContext';
import { en } from '../locales/en';
import { uk } from '../locales/uk';

const translations = {
  en,
  uk,
};

export const useTranslation = () => {
  const { language } = useLanguage();
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  return { t, language };
};


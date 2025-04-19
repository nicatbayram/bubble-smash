import React, { createContext, useState, useContext } from 'react';
import translationTR from '../translations/tr';
import translationEN from '../translations/en';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('tr'); // Varsayılan dil Türkçe
  
  const translations = {
    tr: translationTR,
    en: translationEN
  };
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
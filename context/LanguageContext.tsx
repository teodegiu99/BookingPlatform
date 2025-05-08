// // context/LanguageContext.tsx
// 'use client'

// import { createContext, useContext, useState, ReactNode , useEffect} from 'react';
// import { dictionary, TranslationKey } from '../dictionary';

// export type Lang = 'it' | 'en';

// const LangContext = createContext<{
//   lang: Lang;
//   setLang: (lang: Lang) => void;
// }>({ lang: 'it', setLang: () => {} });

// export const LangProvider = ({ children }: { children: ReactNode }) => {
//   const [lang, setLang] = useState<Lang>('it');
//   // dentro LangProvider
// useEffect(() => {
//   const stored = localStorage.getItem('lang') as Lang;
//   if (stored) setLang(stored);
// }, []);

// useEffect(() => {
//   localStorage.setItem('lang', lang);
// }, [lang]);


//   return (
//     <LangContext.Provider value={{ lang, setLang }}>
//       {children}
//     </LangContext.Provider>
//   );
// };

// export const useLang = () => useContext(LangContext);
// context/LanguageContext.tsx
// context/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'it' | 'en';

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({
  lang: 'it',
  setLang: () => {},
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored === 'en' || stored === 'it') {
      setLangState(stored);
    } else {
      setLangState('it');
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  // ⚠️ Fino a quando lang è null, non renderizzare nulla
  if (lang === null) return null;

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);

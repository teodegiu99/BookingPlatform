// context/LanguageContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode , useEffect} from 'react';
import { dictionary, TranslationKey } from '../dictionary';

export type Lang = 'it' | 'en';

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({ lang: 'it', setLang: () => {} });

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('it');
  // dentro LangProvider
useEffect(() => {
  const stored = localStorage.getItem('lang') as Lang;
  if (stored) setLang(stored);
}, []);

useEffect(() => {
  localStorage.setItem('lang', lang);
}, [lang]);


  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);



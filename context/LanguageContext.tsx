'use client'

import React, { createContext, useContext, useState } from 'react';

type Lang = 'it' | 'en';

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({ lang: 'it', setLang: () => {} });

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('it');

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);

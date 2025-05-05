// components/ui/langSwitch.tsx
'use client'
import { useLang } from "@/context/LanguageContext";
import { useState } from "react";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  return (
    <select value={lang} onChange={(e) => setLang(e.target.value as 'it' | 'en')} className="p-1 bg-neutral">
      <option value="it" className="p-2">🇮🇹</option>
      <option value="en">🇬🇧</option>
    </select>
  );
};

export default LanguageSwitcher;

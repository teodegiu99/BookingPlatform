// components/ui/langSwitch.tsx
'use client'
import { useLang } from "@/context/LanguageContext";

const LanguageSwitcher = () => {
  const { lang, setLang} = useLang();
  return (
    <div>
      <select value={lang} onChange={(e) => setLang(e.target.value as 'it' | 'en')}>
        <option value="it">🇮🇹</option>
        <option value="en">🇬🇧</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;

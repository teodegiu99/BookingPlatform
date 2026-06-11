// components/ui/langSwitch.tsx
'use client'
import { useLang } from "@/context/LanguageContext";

const LanguageSwitcher = ({ isMobile }: { isMobile?: boolean }) => {
  const { lang, setLang} = useLang();
  
  if (isMobile) {
    return (
      <button 
        onClick={() => setLang(lang === 'it' ? 'en' : 'it')} 
        className="text-lg font-medium text-gray-800"
      >
        Lingua: {lang === 'it' ? 'IT' : 'EN'}
      </button>
    );
  }

  return (
    <div>
      <select value={lang} onChange={(e) => setLang(e.target.value as 'it' | 'en')} className="bg-neutral">
        <option value="it">🇮🇹</option>
        <option value="en">🇬🇧</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;

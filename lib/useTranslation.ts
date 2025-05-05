'use client'

import { useLang } from "../context/LanguageContext";
import { dictionary, TranslationKey } from '../dictionary';

export function useTranslation() {
  const { lang } = useLang();

  const t = (key: TranslationKey) => dictionary[lang][key] ?? key;

  return { t };
}
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TR } from '../utils/translations';

type LangCode = 'en' | 'hi' | 'gu';

interface LangContextValue {
  lang: LangCode;
  setLang: (value: LangCode) => void;
  showLangModal: boolean;
  setShowLangModal: (value: boolean) => void;
  t: (key: string) => string;
}

const LangCtx = createContext<LangContextValue | null>(null);

export const useLang = () => useContext(LangCtx)!;

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en');
  const [showLangModal, setShowLangModal] = useState(true);
  const t = (k: string) => TR[k]?.[lang] || TR[k]?.en || k;

  return (
    <LangCtx.Provider value={{ lang, setLang, showLangModal, setShowLangModal, t }}>
      {children}
    </LangCtx.Provider>
  );
}

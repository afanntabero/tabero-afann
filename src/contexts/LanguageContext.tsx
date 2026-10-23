import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Language, type Translation } from '@/lib/i18n';

interface LanguageContextValue {
  lang: Language;
  t: Translation;
  toggleLang: () => void;
  setLang: (l: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('tabero-lang') as Language | null;
    return stored === 'fr' || stored === 'en' ? stored : 'en';
  });
  useEffect(() => { localStorage.setItem('tabero-lang', lang); document.documentElement.lang = lang; }, [lang]);
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'fr' : 'en'));
  return <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

import React, { createContext, useContext, useState } from "react";
import translations from "../pages/Translations";
import type { SupportedLang } from "../pages/Home";

const LANG_STORAGE_KEY = "typinggenie_lang";

const LanguageContext = createContext<{
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: typeof translations["en"];
}>({
  lang: "en",
  setLang: () => {},
  t: translations["en"],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<SupportedLang>(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return (stored && Object.keys(translations).includes(stored)) ? (stored as SupportedLang) : "en";
  });

  const changeLang = (newLang: SupportedLang) => {
    setLang(newLang);
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translate, type Language } from "@/lib/i18n";

const LANGUAGE_COOKIE_KEY = "oc_lang";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "openclaw-crm.language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");

  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (stored === "en" || stored === "zh") {
        setLanguageState(stored);
        document.cookie = `${LANGUAGE_COOKIE_KEY}=${stored}; Path=/; Max-Age=31536000; SameSite=Lax`;
        return;
      }

      // Fallback to cookie
      const cookieValue = document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${LANGUAGE_COOKIE_KEY}=`))
        ?.split("=")[1];
      if (cookieValue === "en" || cookieValue === "zh") {
        setLanguageState(cookieValue);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
      document.cookie = `${LANGUAGE_COOKIE_KEY}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: (key: string) => translate(language, key),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}


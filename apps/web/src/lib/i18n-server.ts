import { cookies } from "next/headers";
import { translate, type Language } from "@/lib/i18n";

export const LANGUAGE_COOKIE_KEY = "oc_lang";

export function getRequestLanguage(): Language {
  const value = cookies().get(LANGUAGE_COOKIE_KEY)?.value;
  return value === "en" ? "en" : "zh";
}

export function tServer(key: string): string {
  return translate(getRequestLanguage(), key);
}


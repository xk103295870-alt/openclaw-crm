import { cookies } from "next/headers";
import {
  translate,
  type Language,
  type TranslationParams,
} from "@/lib/i18n";

export const LANGUAGE_COOKIE_KEY = "oc_lang";

export async function getRequestLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;
  return value === "en" ? "en" : "zh";
}

export async function tServer(
  key: string,
  params?: TranslationParams
): Promise<string> {
  const language = await getRequestLanguage();
  return translate(language, key, params);
}


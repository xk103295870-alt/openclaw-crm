"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function LandingLanguageToggle() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const nextLanguage = language === "zh" ? "en" : "zh";

  return (
    <button
      type="button"
      onClick={() => {
        setLanguage(nextLanguage);
        router.refresh();
      }}
      title={language === "zh" ? t("language.toggleToEn") : t("language.toggleToZh")}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] text-muted-foreground/70 transition-all hover:text-foreground hover:bg-foreground/[0.05]"
    >
      <Languages className="h-[14px] w-[14px]" />
      <span className="font-medium">{language === "zh" ? "EN" : "中"}</span>
    </button>
  );
}


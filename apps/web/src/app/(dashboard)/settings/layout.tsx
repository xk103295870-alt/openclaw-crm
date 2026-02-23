"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, Users, Box, KeyRound, Bot, Puzzle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const settingsNav = [
  { href: "/settings", labelKey: "settings.nav.general", icon: Settings, exact: true },
  { href: "/settings/members", labelKey: "settings.nav.members", icon: Users, exact: false },
  { href: "/settings/objects", labelKey: "settings.nav.objects", icon: Box, exact: false },
  { href: "/settings/api-keys", labelKey: "settings.nav.apiKeys", icon: KeyRound, exact: false },
  { href: "/settings/ai", labelKey: "settings.nav.aiAgent", icon: Bot, exact: false },
  { href: "/settings/openclaw", labelKey: "settings.nav.openclaw", icon: Puzzle, exact: false },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="flex h-full">
      {/* Settings sidebar */}
      <nav className="w-52 border-r border-border p-4 space-y-1">
        <h2 className="text-lg font-semibold mb-4">{t("nav.settings")}</h2>
        {settingsNav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}

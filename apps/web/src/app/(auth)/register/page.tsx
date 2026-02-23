"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/components/language-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError(t("auth.register.passwordTooShort"));
      setLoading(false);
      return;
    }

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || t("auth.register.registrationFailed"));
        return;
      }

      // Create workspace for the new user
      const wsName =
        workspaceName.trim() ||
        t("auth.register.workspaceNameFromName", { name: name || "My" });
      const wsRes = await fetch("/api/v1/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wsName }),
      });

      if (!wsRes.ok) {
        // User was created but workspace creation failed — send to workspace selection
        router.push("/select-workspace");
        return;
      }

      // Cookie is set by the POST /api/v1/workspaces response, redirect to home
      trackEvent("signup_completed");
      router.push("/home");
    } catch {
      setError(t("auth.register.genericError"));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "flex h-10 w-full rounded-xl border border-foreground/8 dark:border-white/[0.06] bg-background/60 dark:bg-white/[0.04] px-4 text-[14px] text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-foreground/20 dark:focus:border-white/15 focus:ring-0";

  return (
    <div className="rounded-2xl border border-foreground/[0.06] dark:border-white/[0.06] bg-foreground/[0.015] dark:bg-white/[0.02] px-8 py-8">
      <div className="text-center mb-6">
        <h1 className="text-title-4">{t("auth.register.title")}</h1>
        <p className="text-body-sm text-muted-foreground/70 mt-1.5">
          {t("auth.register.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-destructive/10 px-4 py-2.5 text-[13px] text-destructive">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-label text-muted-foreground">
            {t("auth.register.name")}
          </label>
          <input
            id="name"
            type="text"
            placeholder={t("auth.register.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-label text-muted-foreground">
            {t("auth.register.email")}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-label text-muted-foreground"
          >
            {t("auth.register.password")}
          </label>
          <input
            id="password"
            type="password"
            placeholder={t("auth.register.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="workspace-name"
            className="text-label text-muted-foreground"
          >
            {t("auth.register.workspaceName")}
          </label>
          <input
            id="workspace-name"
            type="text"
            placeholder={
              name
                ? t("auth.register.workspaceNameFromName", { name })
                : t("auth.register.workspaceNamePlaceholderFallback")
            }
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className={inputClass}
          />
          <p className="text-caption">{t("auth.register.workspaceNameHint")}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-foreground py-2.5 text-[13px] font-medium text-background shadow-[0_1px_4px_rgba(0,0,0,0.1),0_0px_1px_rgba(0,0,0,0.06)] transition-all hover:opacity-80 hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("auth.register.submitting") : t("auth.register.submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground/60">
        {t("auth.register.haveAccount")}{" "}
        <Link
          href="/login"
          className="text-foreground transition-colors hover:underline"
        >
          {t("auth.register.signIn")}
        </Link>
      </p>
    </div>
  );
}

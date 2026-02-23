"use client";

import { useState, useEffect } from "react";
import type { Language } from "@/lib/i18n";

interface TerminalLine {
  text: string;
  type: "prompt" | "status" | "result" | "summary" | "action";
}

function getExamples(language: Language): { prompt: string; lines: TerminalLine[] }[] {
  if (language === "zh") {
    return [
      {
        prompt: "把昨天会议里的联系人添加到 CRM",
        lines: [
          { text: "在你的会议记录中找到了 3 个联系人。", type: "status" },
          { text: "正在 OpenClaw CRM 中创建记录...", type: "status" },
          { text: "", type: "status" },
          { text: "done  Sarah Chen，Meridian Health Group", type: "result" },
          { text: "done  Alex Dumont，Sterling & Co", type: "result" },
          { text: "done  Omar Hassan，Sterling & Co", type: "result" },
          { text: "", type: "status" },
          { text: "3 个都已添加。要我创建跟进任务吗？", type: "action" },
        ],
      },
      {
        prompt: "查看本月即将成交的商机",
        lines: [
          { text: "正在查询 OpenClaw CRM...", type: "status" },
          { text: "", type: "status" },
          { text: "2 月 28 日前有 3 个商机：", type: "summary" },
          { text: "  Northwind（$89k，谈判中）", type: "result" },
          { text: "  Horizon Enterprise（$156k，谈判中）", type: "result" },
          { text: "  Atlas Rebrand（$67.5k，已赢单）", type: "result" },
          { text: "", type: "status" },
          { text: "总管道价值：$312.5k", type: "summary" },
        ],
      },
      {
        prompt: "给 Sterling 商机添加今天电话沟通的备注",
        lines: [
          {
            text: "已添加备注到 Sterling & Co（$156k，谈判中）：",
            type: "status",
          },
          {
            text: "“与 Alex Dumont 通话，讨论了 Q2 上线时间。",
            type: "result",
          },
          {
            text: " 他们需要在 3 月 5 日前收到提案。”",
            type: "result",
          },
          { text: "", type: "status" },
          {
            text: "完成。要我为提案截止日创建任务吗？",
            type: "action",
          },
        ],
      },
    ];
  }

  return [
    {
      prompt: "add the people from yesterday's meeting to the CRM",
      lines: [
        { text: "Found 3 contacts in your meeting notes.", type: "status" },
        { text: "Creating records in OpenClaw CRM...", type: "status" },
        { text: "", type: "status" },
        { text: "done  Sarah Chen, Meridian Health Group", type: "result" },
        { text: "done  Alex Dumont, Sterling & Co", type: "result" },
        { text: "done  Omar Hassan, Sterling & Co", type: "result" },
        { text: "", type: "status" },
        { text: "All 3 added. Want me to create follow-up tasks?", type: "action" },
      ],
    },
    {
      prompt: "show me all deals closing this month",
      lines: [
        { text: "Querying OpenClaw CRM...", type: "status" },
        { text: "", type: "status" },
        { text: "3 deals closing before Feb 28:", type: "summary" },
        { text: "  Northwind ($89k, Negotiation)", type: "result" },
        { text: "  Horizon Enterprise ($156k, Negotiation)", type: "result" },
        { text: "  Atlas Rebrand ($67.5k, Won)", type: "result" },
        { text: "", type: "status" },
        { text: "Total pipeline: $312.5k", type: "summary" },
      ],
    },
    {
      prompt: "add a note to the Sterling deal about today's call",
      lines: [
        {
          text: "Added note to Sterling & Co ($156k, Negotiation):",
          type: "status",
        },
        {
          text: '"Call with Alex Dumont, discussed timeline for Q2 rollout.',
          type: "result",
        },
        {
          text: ' They need a proposal by March 5."',
          type: "result",
        },
        { text: "", type: "status" },
        {
          text: "Done. Want me to create a task for the proposal deadline?",
          type: "action",
        },
      ],
    },
  ];
}

export function TerminalDemo({ language }: { language: Language }) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [promptVisible, setPromptVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const examples = getExamples(language);

  const example = examples[exampleIndex];

  useEffect(() => {
    // Phase 1: Show prompt
    setPromptVisible(false);
    setVisibleLines(0);
    setFading(false);

    const promptTimer = setTimeout(() => {
      setPromptVisible(true);
    }, 300);

    // Phase 2: Show response lines one by one
    const lineTimers: ReturnType<typeof setTimeout>[] = [];
    const baseDelay = 1200; // after prompt appears

    example.lines.forEach((_, i) => {
      const timer = setTimeout(
        () => {
          setVisibleLines(i + 1);
        },
        baseDelay + (i + 1) * 200
      );
      lineTimers.push(timer);
    });

    // Phase 3: Hold, then fade and advance
    const holdTime = baseDelay + (example.lines.length + 1) * 200 + 2500;
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, holdTime);

    const advanceTimer = setTimeout(() => {
      setExampleIndex((i) => (i + 1) % examples.length);
    }, holdTime + 600);

    return () => {
      clearTimeout(promptTimer);
      lineTimers.forEach(clearTimeout);
      clearTimeout(fadeTimer);
      clearTimeout(advanceTimer);
    };
  }, [exampleIndex, example.lines.length]);

  return (
    <div
      className="w-full font-mono text-[13px] leading-[1.7] sm:text-[14px] transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1 }}
    >
      {/* User command */}
      <div
        className="transition-opacity duration-300"
        style={{ opacity: promptVisible ? 1 : 0 }}
      >
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-indigo-400/70">
          {language === "zh" ? "你" : "you"}
        </div>
        <div className="pl-3 border-l-2 border-white/10">
          <span className="text-white font-medium">
            {example.prompt}
          </span>
        </div>
      </div>

      {/* Bot response */}
      <div className="mt-5 space-y-0">
        <div
          className="mb-2 text-[11px] font-medium uppercase tracking-widest text-emerald-400/70 transition-all duration-300"
          style={{
            opacity: visibleLines > 0 ? 1 : 0,
            transform: visibleLines > 0 ? "translateY(0)" : "translateY(4px)",
          }}
        >
          {language === "zh" ? "OpenClaw 助手" : "OpenClaw Bot"}
        </div>
        <div className="pl-3 border-l-2 border-white/[0.06] space-y-0">
        {example.lines.map((line, i) => (
          <div
            key={`${exampleIndex}-${i}`}
            className="transition-all duration-300"
            style={{
              opacity: i < visibleLines ? 1 : 0,
              transform:
                i < visibleLines ? "translateY(0)" : "translateY(4px)",
            }}
          >
            {line.text === "" ? (
              <div className="h-2" />
            ) : line.type === "result" && line.text.startsWith("done") ? (
              <div>
                <span className="text-emerald-400">{"done"}</span>
                <span className="text-white/60">
                  {line.text.slice(4)}
                </span>
              </div>
            ) : line.type === "result" ? (
              <div className="text-white/60">
                {line.text}
              </div>
            ) : line.type === "summary" ? (
              <div className="text-white/80 font-medium">
                {line.text}
              </div>
            ) : line.type === "action" ? (
              <div className="text-white/70">
                {line.text}
              </div>
            ) : (
              <div className="text-white/50">
                {line.text}
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

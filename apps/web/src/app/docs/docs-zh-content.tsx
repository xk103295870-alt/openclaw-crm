import Link from "next/link";
import {
  Users,
  TrendingUp,
  CheckSquare,
  StickyNote,
  List,
  Bot,
  SlidersHorizontal,
  Keyboard,
  Code2,
  Rocket,
  Settings,
  ArrowRight,
  Search,
  Upload,
  Blocks,
  Server,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";

const tocGroupsZh = [
  {
    label: "快速开始",
    sections: [
      { id: "what-is-openclaw", label: "什么是 OpenClaw CRM", icon: Rocket },
      { id: "creating-account", label: "创建账号", icon: Users },
      { id: "essential-setup", label: "基础设置", icon: Zap },
    ],
  },
  {
    label: "连接你的代理",
    sections: [
      { id: "openclaw-bot", label: "OpenClaw Bot 集成", icon: Bot },
    ],
  },
  {
    label: "功能说明",
    sections: [
      { id: "people-companies", label: "联系人与公司", icon: Users },
      { id: "deals-pipeline", label: "商机与销售管道", icon: TrendingUp },
      { id: "ai-chat", label: "AI 对话", icon: Bot },
      { id: "tasks", label: "任务", icon: CheckSquare },
      { id: "notes", label: "笔记", icon: StickyNote },
      { id: "lists", label: "列表", icon: List },
      { id: "import-export", label: "导入与导出", icon: Upload },
      { id: "views-filters", label: "视图与筛选", icon: SlidersHorizontal },
      { id: "search", label: "搜索", icon: Search },
      { id: "custom-objects", label: "自定义对象", icon: Blocks },
    ],
  },
  {
    label: "管理",
    sections: [
      { id: "settings", label: "设置", icon: Settings },
      { id: "keyboard-shortcuts", label: "快捷键", icon: Keyboard },
    ],
  },
  {
    label: "开发者",
    sections: [
      { id: "api-integrations", label: "API 与集成", icon: Code2 },
      { id: "self-hosting", label: "自托管部署", icon: Server },
    ],
  },
];

export function DocsZhContent() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border/10 nav-glass">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-[-0.015em] text-foreground transition-opacity hover:opacity-70"
            >
              OpenClaw{" "}
              <span className="font-normal text-muted-foreground/60">CRM</span>
            </Link>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              文档
            </span>
          </div>
          <div className="flex items-center gap-1">
            <a
              href="https://github.com/giorgosn/openclaw-crm"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-muted-foreground/50 transition-all hover:text-foreground hover:bg-foreground/[0.05]"
            >
              <GitHubLogoIcon className="h-[18px] w-[18px]" />
            </a>
            <LandingLanguageToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-full px-4 py-1.5 text-[13px] text-muted-foreground transition-all hover:text-foreground hover:bg-foreground/[0.04]"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-foreground/12 px-3.5 sm:px-4 py-1.5 text-[13px] font-medium text-foreground transition-all hover:border-foreground/25 hover:bg-foreground/[0.03]"
            >
              开始使用
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 sm:px-6 py-10">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-20">
            {tocGroupsZh.map((group) => (
              <div key={group.label} className="mb-5">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/40">
                  {group.label}
                </p>
                <nav className="space-y-0.5">
                  {group.sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground transition-all hover:bg-foreground/[0.04] hover:text-foreground"
                    >
                      <s.icon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-14">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              返回首页
            </Link>
            <h1 className="text-4xl font-medium tracking-[-0.03em] leading-tight sm:text-5xl">
              文档中心
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              这里包含从账号开通、数据导入到团队协作和 API 集成的完整说明。
              如果你是第一次使用 OpenClaw CRM，建议从“快速开始”依次阅读。
            </p>
          </div>

          <GroupDivider label="快速开始" />

          <Section id="what-is-openclaw" icon={Rocket} title="什么是 OpenClaw CRM？">
            <P>
              OpenClaw CRM 用来统一管理联系人、公司、商机、任务和笔记。
              你可以像聊天一样查询和更新数据，不需要学习复杂查询语法。
            </P>
            <P>
              产品支持两种使用方式：托管版（开箱即用）和自托管版（完全掌控数据与部署）。
              功能上两者一致，差别只在于部署与运维方式。
            </P>
            <Ul>
              <li>
                <Strong>托管版</Strong>：直接{" "}
                <a
                  href="/register"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  注册
                </a>
                ，几分钟内即可开始使用。
              </li>
              <li>
                <Strong>自托管版</Strong>：在你自己的服务器部署，数据完全留在你的基础设施内。
              </li>
            </Ul>
          </Section>

          <Section id="creating-account" icon={Users} title="创建账号">
            <H3>注册流程</H3>
            <Ol>
              <li>点击首页右上角“开始使用”。</li>
              <li>填写姓名、邮箱和密码（至少 8 位）。</li>
              <li>创建工作区名称（可留空自动生成）。</li>
              <li>完成后会进入 Home 页面。</li>
            </Ol>
            <H3>默认对象</H3>
            <P>新工作区会自动创建 3 个标准对象：People、Companies、Deals。</P>
            <Ul>
              <li><Strong>People</Strong>：联系人信息与归属关系。</li>
              <li><Strong>Companies</Strong>：公司资料、网站域名、标签等。</li>
              <li><Strong>Deals</Strong>：商机金额、阶段、预计成交时间等。</li>
            </Ul>
          </Section>

          <Section id="essential-setup" icon={Zap} title="基础设置">
            <P>建议在导入正式数据前先完成以下 4 件事：</P>
            <Ol>
              <li>熟悉侧边栏与命令面板（Ctrl/Cmd + K）。</li>
              <li>在“设置 &gt; AI”中配置 OpenRouter API Key 和模型。</li>
              <li>先导入一批历史数据（CSV）验证字段映射是否正确。</li>
              <li>在“设置 &gt; 成员”邀请团队同事并分配角色。</li>
            </Ol>
          </Section>

          <GroupDivider label="连接你的代理" />

          <Section id="openclaw-bot" icon={Bot} title="OpenClaw Bot 集成">
            <P>
              OpenClaw CRM 原生支持 OpenClaw Bot。你可以在“设置 &gt; OpenClaw”
              页面生成技能文件和配置片段，让代理直接执行 CRM 操作。
            </P>
            <Ol>
              <li>先到“设置 &gt; API Keys”创建密钥。</li>
              <li>再到“设置 &gt; OpenClaw”生成并复制配置。</li>
              <li>把配置放到你的 `openclaw.json` 或 `moltbot.json`。</li>
              <li>重启代理后即可通过自然语言访问 CRM。</li>
            </Ol>
          </Section>

          <GroupDivider label="功能说明" />

          <Section id="people-companies" icon={Users} title="联系人与公司">
            <P>
              People 和 Companies 是 CRM 的核心数据。你可以通过表格视图快速编辑，
              也可以进入详情页查看关联记录、活动轨迹、笔记和任务。
            </P>
          </Section>

          <Section id="deals-pipeline" icon={TrendingUp} title="商机与销售管道">
            <P>
              Deals 支持看板视图和表格视图。看板支持拖拽更新阶段，
              适合跟踪从线索到赢单/丢单的完整进展。
            </P>
          </Section>

          <Section id="ai-chat" icon={Bot} title="AI 对话">
            <P>
              AI Chat 可以查询记录、创建任务、写备注和更新字段。
              涉及写操作时会先请求确认，避免误操作。
            </P>
          </Section>

          <Section id="tasks" icon={CheckSquare} title="任务">
            <P>
              任务支持截止日期、负责人和关联记录。你可以在任务页集中管理，
              也可以在记录详情页查看该记录相关的任务列表。
            </P>
          </Section>

          <Section id="notes" icon={StickyNote} title="笔记">
            <P>
              内置富文本编辑器，支持自动保存。笔记可以关联到具体记录，
              方便沉淀沟通上下文与会议纪要。
            </P>
          </Section>

          <Section id="lists" icon={List} title="列表">
            <P>
              Lists 适合做专题集合（例如“本周重点跟进客户”）。列表支持自定义属性，
              并可从对象记录中快速添加条目。
            </P>
          </Section>

          <Section id="import-export" icon={Upload} title="导入与导出">
            <P>
              CSV 导入支持字段映射和类型转换，每次最多 1,000 行。
              如果有错误，会返回具体行号，便于修正后再次导入。
            </P>
            <P>你也可以按对象导出记录用于备份或数据迁移。</P>
          </Section>

          <Section id="views-filters" icon={SlidersHorizontal} title="视图与筛选">
            <P>
              支持组合筛选（AND/OR）和多字段排序。常见条件可保存到视图中，
              方便团队复用统一口径的数据看板。
            </P>
          </Section>

          <Section id="search" icon={Search} title="搜索">
            <P>
              全局搜索可跨对象查找记录。使用命令面板（Ctrl/Cmd + K）
              可以更快地跳转页面、定位记录和执行操作。
            </P>
          </Section>

          <Section id="custom-objects" icon={Blocks} title="自定义对象">
            <P>
              除标准对象外，你可以创建自定义对象（例如合同、项目、渠道等），
              并定义字段类型、是否必填、可选项与状态流转。
            </P>
          </Section>

          <GroupDivider label="管理" />

          <Section id="settings" icon={Settings} title="设置">
            <P>设置页包含以下模块：</P>
            <Ul>
              <li><Strong>General</Strong>：工作区基础信息。</li>
              <li><Strong>Members</Strong>：成员邀请、角色管理。</li>
              <li><Strong>Objects</Strong>：对象和字段配置。</li>
              <li><Strong>API Keys</Strong>：生成/吊销 API 密钥。</li>
              <li><Strong>AI</Strong>：模型与 API Key 配置。</li>
              <li><Strong>OpenClaw</Strong>：代理集成配置生成。</li>
            </Ul>
          </Section>

          <Section id="keyboard-shortcuts" icon={Keyboard} title="快捷键">
            <P>常用快捷键如下：</P>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-6 font-medium">按键</th>
                    <th className="pb-2 font-medium">功能</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <ShortcutRow keys="Ctrl/Cmd + K" action="打开命令面板" />
                  <ShortcutRow keys="/" action="聚焦搜索输入" />
                  <ShortcutRow keys="Esc" action="关闭弹窗/取消编辑" />
                  <ShortcutRow keys="Enter" action="确认创建或提交" />
                </tbody>
              </table>
            </div>
          </Section>

          <GroupDivider label="开发者" />

          <Section id="api-integrations" icon={Code2} title="API 与集成">
            <P>
              OpenClaw CRM 提供 REST API，可用于与内部系统、自动化流程和 AI 代理联动。
              所有接口位于 <Code>/api/v1</Code> 下，使用 Bearer Token 鉴权。
            </P>
            <H3>常用接口</H3>
            <Ul>
              <li><Code>GET /api/v1/objects</Code>：列出对象。</li>
              <li><Code>GET /api/v1/objects/:slug/records</Code>：查询记录。</li>
              <li><Code>POST /api/v1/objects/:slug/records</Code>：创建记录。</li>
              <li><Code>POST /api/v1/objects/:slug/records/query</Code>：筛选/排序查询。</li>
              <li><Code>POST /api/v1/objects/:slug/records/import</Code>：批量导入。</li>
              <li><Code>GET /api/v1/search</Code>：全局搜索。</li>
            </Ul>
            <P>
              API 文档入口：{" "}
              <a
                href="/llms-api.txt"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                /llms-api.txt
              </a>
              、{" "}
              <a
                href="/llms-full.txt"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                /llms-full.txt
              </a>
              、{" "}
              <a
                href="/openapi.json"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                /openapi.json
              </a>
              。
            </P>
          </Section>

          <Section id="self-hosting" icon={Server} title="自托管部署">
            <P>
              你可以将 OpenClaw CRM 部署到自己的服务器。推荐使用 Docker + PostgreSQL 16，
              并通过反向代理处理 HTTPS。
            </P>
            <H3>环境要求</H3>
            <Ul>
              <li>Node.js 20+</li>
              <li>pnpm 9+</li>
              <li>PostgreSQL 16+（或 Docker）</li>
            </Ul>
            <H3>快速部署（开发环境）</H3>
            <Ol>
              <li>
                克隆仓库：<Code>git clone https://github.com/giorgosn/openclaw-crm.git</Code>
              </li>
              <li>
                安装依赖：<Code>cd openclaw-crm &amp;&amp; pnpm install</Code>
              </li>
              <li>
                配置环境变量：<Code>cp .env.example .env</Code>
              </li>
              <li>
                启动数据库：<Code>docker compose up db -d</Code>
              </li>
              <li>
                推送表结构：<Code>pnpm db:push</Code>
              </li>
              <li>
                初始化数据：<Code>pnpm db:seed</Code>
              </li>
              <li>
                启动项目：<Code>pnpm dev</Code>
              </li>
            </Ol>
          </Section>

          <div className="mt-16 rounded-2xl border border-foreground/[0.06] dark:border-white/[0.06] bg-foreground/[0.015] dark:bg-white/[0.02] p-8 text-center">
            <h2 className="text-xl font-medium tracking-[-0.02em]">准备好开始了吗？</h2>
            <p className="mt-2 text-[14px] text-muted-foreground">
              <a
                href="/register"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                创建你的账号
              </a>{" "}
              ，几分钟内搭建好第一个工作区。
            </p>
            <Link
              href="/register"
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[13px] font-medium text-background transition-all hover:opacity-80"
            >
              开始使用
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </main>
      </div>

      <footer className="mt-12 border-t border-border/15">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6">
          <span className="text-[12px] text-muted-foreground/60">OpenClaw CRM</span>
          <div className="flex items-center gap-5">
            <Link
              href="/blog"
              className="text-[12px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              博客
            </Link>
            <Link
              href="/compare"
              className="text-[12px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              对比
            </Link>
            <a
              href="https://github.com/giorgosn/openclaw-crm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              GitHub
            </a>
            <span className="text-[12px] text-muted-foreground/60">MIT 许可</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GroupDivider({ label }: { label: string }) {
  return (
    <div className="mb-10 mt-4 flex items-center gap-4">
      <div className="h-px flex-1 bg-foreground/[0.06] dark:bg-white/[0.06]" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/40">
        {label}
      </span>
      <div className="h-px flex-1 bg-foreground/[0.06] dark:bg-white/[0.06]" />
    </div>
  );
}

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <div className="mb-5 flex items-center gap-3">
        <div className="inline-flex rounded-xl border border-foreground/[0.06] dark:border-white/[0.06] bg-foreground/[0.015] dark:bg-white/[0.02] p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-medium tracking-[-0.02em]">{title}</h2>
      </div>
      <div className="space-y-4 pl-0 sm:pl-[3.25rem]">{children}</div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[15px] font-semibold text-foreground">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] leading-[1.7] text-muted-foreground">{children}</p>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}

function Ol({ children }: { children: React.ReactNode }) {
  return (
    <ol className="list-decimal space-y-1.5 pl-5 text-[14px] leading-[1.7] text-muted-foreground marker:text-muted-foreground/40">
      {children}
    </ol>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-[1.7] text-muted-foreground marker:text-muted-foreground/40">
      {children}
    </ul>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-foreground/[0.04] dark:bg-white/[0.06] px-1.5 py-0.5 text-[12px] font-mono text-foreground">
      {children}
    </code>
  );
}

function ShortcutRow({ keys, action }: { keys: string; action: string }) {
  return (
    <tr>
      <td className="py-2 pr-6">
        <kbd className="rounded-md border border-foreground/[0.08] dark:border-white/[0.08] bg-foreground/[0.03] dark:bg-white/[0.04] px-2 py-0.5 text-[12px] font-mono text-foreground">
          {keys}
        </kbd>
      </td>
      <td className="py-2 text-muted-foreground">{action}</td>
    </tr>
  );
}


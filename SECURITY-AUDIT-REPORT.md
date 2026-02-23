# OpenClaw CRM 代码安全审查报告

**审查日期**: 2026-02-23  
**仓库**: github.com/giorgosn/openclaw-crm  
**范围**: 认证/授权、API 安全、输入校验、注入、XSS、敏感信息、配置与依赖

---

## 一、执行摘要

| 等级 | 数量 | 说明 |
|------|------|------|
| 高 | 1 | 需尽快修复 |
| 中 | 3 | 建议短期内修复 |
| 低 / 建议 | 5 | 加固与最佳实践 |

**整体结论**：项目在鉴权、API 鉴权、workspace 隔离和 SQL 参数化方面做得较好；主要问题集中在 **前端 XSS**、**BETTER_AUTH_SECRET 未强制校验**、**query-builder 中 sql.raw 使用** 以及 **API Key 的 scope 未实际校验**。建议优先修复高/中等级项，并逐步落实低等级建议。

---

## 二、高等级问题

### 1. 聊天消息渲染存在 XSS（dangerouslySetInnerHTML 未消毒）

**位置**: `apps/web/src/components/chat/message-list.tsx` 第 317–322 行

**问题**: `InlineMarkdown` 中把用户/模型返回的文本用简单正则替换为 `<strong>` / `<code>` 后，直接通过 `dangerouslySetInnerHTML` 渲染。若内容中包含 HTML（如 `**<img src=x onerror=alert(1)>**`），会触发 XSS。

```tsx
const formatted = line
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/`([^`]+)`/g, '<code ...>$1</code>');
return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
```

**建议**:
- 使用成熟的 Markdown 渲染库（如 `react-markdown`），并仅开启需要的组件、禁用危险标签；或
- 在生成 `formatted` 后使用 HTML 消毒库（如 `DOMPurify`）对 `formatted` 做消毒再写入 `dangerouslySetInnerHTML`。

---

## 三、中等级问题

### 2. BETTER_AUTH_SECRET 未在启动时强制校验

**位置**: `apps/web/src/lib/auth.ts` 第 8 行

**问题**: `secret: process.env.BETTER_AUTH_SECRET` 未检查是否存在。若部署时漏配，Better Auth 可能使用弱默认或行为不可预期，导致会话/令牌安全性下降。

**建议**:
- 在应用启动或 auth 初始化时校验：若 `!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length < 32`，则抛出错误或拒绝启动。
- 在文档和 `.env.example` 中明确说明生产环境必须设置且长度建议 ≥32 字符。

### 3. query-builder 中 number_value 的 IN 使用 sql.raw

**位置**: `apps/web/src/lib/query-builder.ts` 第 147–154 行

**问题**: `in` 运算符对 `number_value` 使用 `sql.raw(vals)`，其中 `vals = arr.map((v) => \`${Number(v)}\`).join(",")`。当前传入值为数字时风险较低，但用 `sql.raw` 拼接用户相关数据违反“所有用户输入均参数化”的原则，存在潜在注入或边界情况风险。

```ts
const vals = arr.map((v) => `${Number(v)}`).join(",");
comparison = sql`rv.${sql.raw(colName)}::text IN (${sql.raw(vals)})`;
```

**建议**: 改为使用 Drizzle 参数化占位符构造 IN 列表，例如用 `sql.join(arr.map((v) => sql`${Number(v)}`), sql`, `)` 或等价方式，避免任何用户相关数据进入 `sql.raw`。

### 4. API Key 的 scopes 未在鉴权时校验

**位置**: `apps/web/src/lib/api-utils.ts` 中 `getApiKeyAuthContext`；`apps/web/src/services/api-keys.ts` 创建/存储了 scopes

**问题**: API Key 创建时可传入 `scopes` 并持久化，但 `getApiKeyAuthContext` 仅校验 key 有效性与过期时间，未根据请求路径或操作类型检查 scope。实际效果是所有有效 API Key 都拥有当前用户的全部 workspace 权限。

**建议**:
- 若产品设计上需要“只读 key”或“有限操作 key”，应在 `getApiKeyAuthContext` 中解析并返回 scope 信息，并在各 API 路由或统一中间件中根据 scope 限制可调用的接口或操作（如仅允许 GET、或仅允许特定对象类型）。
- 若当前版本不打算实现细粒度 scope，建议在文档中明确说明“API Key 等同于该用户在 workspace 内的全部权限”，避免误用。

---

## 四、低等级与改进建议

### 5. 公开 API 文档与 LLM 文档未做访问控制

**位置**: `apps/web/src/middleware.ts` 第 27–28 行

**问题**: `/openapi.json`、`/llms.txt`、`/llms-api.txt`、`/llms-full.txt` 等对未认证用户开放。会暴露接口结构和字段信息，便于攻击者枚举接口与参数。

**建议**: 若仅希望给已登录用户或内部 Agent 使用，可改为要求登录或 Bearer 后再返回；若必须公开，应在文档中说明并确保不包含敏感示例（如真实 key、内部 ID）。

### 6. active-workspace-id Cookie 未设 httpOnly

**位置**: `apps/web/src/app/api/v1/workspaces/switch/route.ts` 第 49–54 行

**问题**: `active-workspace-id` 设置时 `httpOnly: false`，若存在 XSS，攻击者可读取该 cookie 并用于推断当前 workspace，或配合其他接口进行越权尝试。

**建议**: 若前端不需要通过 JS 读取该 cookie（仅服务端用其解析 workspace），可设为 `httpOnly: true`，以减少 XSS 时的信息泄露面。

### 7. 博客/对比页的 HTML 内容未消毒

**位置**:  
- `apps/web/src/app/compare/[slug]/page.tsx` 第 182 行  
- `apps/web/src/app/blog/[slug]/page.tsx` 第 188 行  

**问题**: `page.content` / `post.content` 通过 `dangerouslySetInnerHTML` 渲染。若内容来自可编辑的 CMS 或不可信来源，可能包含恶意脚本。

**建议**: 若内容来源不完全受控，应在服务端或渲染前使用 HTML 消毒库处理；若来自静态 Markdown 且由构建管道统一渲染，需确保管道本身不引入未消毒的 HTML。

### 8. JsonLd 组件潜在 XSS（当 data 含用户可控字符串时）

**位置**: `apps/web/src/components/json-ld.tsx` 第 5 行

**问题**: `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}` 若 `data` 中任意字段含字符串 `</script>`，可能提前闭合 script 标签并注入脚本。当前调用处（如 page.tsx、blog、compare）多为服务端构造的 schema，风险较低，但组件本身是通用组件，一旦被传入用户可控对象即存在 XSS。

**建议**: 对 `JSON.stringify(data)` 的结果做一次转义，将 `<` 替换为 `\u003c`（或使用专门的安全 JSON-in-script 序列化），再写入 `__html`；或仅在确定 `data` 完全由服务端可控且无用户输入时使用该组件。

### 9. 无内置速率限制

**位置**: 全局 API 与登录入口

**问题**: SECURITY.md 已说明当前无内置速率限制，依赖反向代理。对登录、注册、AI 对话、导入等接口，缺少限速会放大暴力破解、滥用和 DoS 风险。

**建议**: 在关键路由（如 `/api/auth/*`、`/api/v1/chat/completions`、`/api/v1/objects/.../records/import`）增加速率限制（如按 IP 或按 userId），或继续在文档中明确要求在生产环境通过 Nginx/Caddy 等配置限速并给出示例。

---

## 五、已做较好的方面

- **认证与会话**: Better Auth + Drizzle，会话与 workspace 成员关系校验清晰；API Key 使用 SHA-256 哈希存储，未存储明文。
- **Workspace 隔离**: 所有数据访问均带 `ctx.workspaceId`，切换 workspace 时服务端校验成员关系后再写 cookie，未发现越权访问。
- **API 鉴权**: 各 `/api/v1/*` 路由均调用 `getAuthContext(req)`，未发现未鉴权即可访问的敏感接口。
- **属性类型校验**: 创建属性时对 `type` 使用 `ATTRIBUTE_TYPES.includes(type)` 校验，避免非法 type 进入 query-builder 的列名映射。
- **SQL 使用**: 搜索与主要查询使用 Drizzle 参数化；query-builder 中列名来自 `ATTRIBUTE_TYPE_COLUMN_MAP[attr.type]`（类型固定），仅 `number_value` 的 IN 使用 `sql.raw`，已在上文建议改为参数化。
- **CSV 解析**: 使用内存中的解析与行数上限（如 1000 行），未发现路径遍历或未校验的文件写入。
- **安全文档**: SECURITY.md 对自托管、HTTPS、密钥、备份、速率限制等有清晰说明。

---

## 六、修复优先级建议

| 优先级 | 项 | 建议动作 |
|--------|----|----------|
| P0 | 聊天消息 XSS (#1) | 引入消毒或安全 Markdown 渲染，去掉未消毒的 dangerouslySetInnerHTML |
| P1 | BETTER_AUTH_SECRET 校验 (#2) | 启动时强制校验并写清文档 |
| P1 | query-builder sql.raw (#3) | IN 列表改为参数化 |
| P2 | API Key scopes (#4) | 实现 scope 校验或明确文档说明 |
| P2 | active-workspace-id httpOnly (#6) | 若无需前端读 cookie 则设为 true |
| P3 | 公开文档访问 (#5)、博客/compare HTML (#7)、JsonLd (#8)、速率限制 (#9) | 按需加固与文档说明 |

---

## 七、依赖与环境

- 未在本次审查中执行 `pnpm audit`（环境限制）。建议在 CI 或本地定期执行 `pnpm audit`，并关注 Dependabot 安全更新。
- 生产环境务必：
  - 设置足够强的 `BETTER_AUTH_SECRET`（≥32 字符随机）。
  - 使用 HTTPS 并配置 `TRUSTED_ORIGINS`。
  - 数据库连接使用 SSL（如 `?sslmode=require`）。
  - 对敏感接口做反向代理层或应用层速率限制。

---

*本报告基于对仓库的静态代码审查，未进行渗透测试或动态运行。部署与运维环境可能引入额外风险，建议结合自身威胁模型再做一次评估。*

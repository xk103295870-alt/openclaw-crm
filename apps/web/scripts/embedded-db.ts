import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";

const databaseDir = path.join(
  process.env.LOCALAPPDATA ?? process.cwd(),
  "openclaw-crm-embedded-postgres"
);
const port = Number(process.env.EMBEDDED_PG_PORT ?? 5432);
const user = process.env.EMBEDDED_PG_USER ?? "postgres";
const password = process.env.EMBEDDED_PG_PASSWORD ?? "postgres";
const database = process.env.EMBEDDED_PG_DATABASE ?? "openclaw";

const pg = new EmbeddedPostgres({
  databaseDir,
  port,
  user,
  password,
  persistent: true,
  initdbFlags: ["--encoding=UTF8", "--locale=C", "--debug"],
  onLog: (message) => console.log(String(message)),
  onError: (messageOrError) => console.error(String(messageOrError)),
});

async function shutdown() {
  try {
    await pg.stop();
  } catch {
    // ignore
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function main() {
  await pg.initialise();
  await pg.start();

  try {
    await pg.createDatabase(database);
  } catch {
    // Database may already exist
  }

  // Keep process alive while postgres runs
  const url = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@localhost:${port}/${database}`;
  // eslint-disable-next-line no-console
  console.log(`[embedded-postgres] running on ${url}`);
  // eslint-disable-next-line no-console
  console.log(`[embedded-postgres] data dir: ${databaseDir}`);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  await new Promise<void>(() => {});
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[embedded-postgres] failed to start", err);
  // eslint-disable-next-line no-console
  console.error("[embedded-postgres] typeof err:", typeof err);
  // eslint-disable-next-line no-console
  console.error("[embedded-postgres] err as json:", (() => { try { return JSON.stringify(err); } catch { return null; } })());
  process.exit(1);
});


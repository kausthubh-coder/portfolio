// Screenshot every built route and fail on anything a visitor would notice.
//
//   bun run shots                  build, then shoot every route
//   bun run shots -- --no-build    reuse dist/
//   bun run shots -- --only /projects/kriyan/ --only /
//   bun run shots -- --keep        leave the preview server running and print its URL
//
// Each route is shot at 1280x800 and 390x844, in light and dark. Shots and a
// report.json land in .artifacts/shots/<run>/. Exit code 1 means a page logged a
// console error, threw, requested something that 404'd, or scrolled sideways.
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { join, relative, sep } from "node:path";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const only = args.flatMap((arg, i) => (arg === "--only" ? [args[i + 1]] : []));

const root = process.cwd();
const dist = join(root, "dist");
const run = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const out = join(root, ".artifacts", "shots", run);

const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
];
const schemes = ["light", "dark"];

if (!flag("--no-build")) {
  const build = spawnSync("bun run build", { stdio: "inherit", shell: true });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

const routesIn = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return routesIn(path);
    if (name === "index.html") return ["/" + relative(dist, dir).split(sep).filter(Boolean).map((p) => p + "/").join("")];
    if (name === "404.html") return ["/404.html"];
    return [];
  });
const routes = (only.length ? only : routesIn(dist)).sort();

const freePort = () =>
  new Promise((resolve) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const preview = spawn(`bunx astro preview --host 127.0.0.1 --port ${port}`, {
  stdio: "ignore",
  shell: true,
});
let keepPreview = false;
const stopPreview = () => {
  if (keepPreview || preview.exitCode !== null) return;
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(preview.pid), "/T", "/F"], { stdio: "ignore" });
  else preview.kill();
};
// Runs on success, on a thrown error and on Ctrl+C, so no run strands a server.
process.on("exit", stopPreview);
process.on("SIGINT", () => process.exit(130));

for (let i = 0; ; i++) {
  try {
    if ((await fetch(base)).ok) break;
  } catch {}
  if (i > 100) throw new Error(`preview never answered on ${base}`);
  await new Promise((r) => setTimeout(r, 150));
}

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const report = [];

for (const viewport of viewports) {
  for (const colorScheme of schemes) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.isMobile ?? false,
      hasTouch: viewport.hasTouch ?? false,
      colorScheme,
    });
    // Skip the one-time intro and roll call so every shot shows the settled page.
    await context.addInitScript(() => {
      sessionStorage.setItem("kausthubh:intro:v5", "1");
      sessionStorage.setItem("kausthubh:stack:rollcall", "1");
    });

    for (const route of routes) {
      const page = await context.newPage();
      const problems = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
      });
      page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
      page.on("response", (response) => {
        const url = response.url();
        if (response.status() >= 400 && url.startsWith(base) && !url.endsWith("/404.html") && route !== "/404.html")
          problems.push(`${response.status()}: ${url.slice(base.length)}`);
      });

      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 0) problems.push(`horizontal overflow: ${overflow}px`);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);

      const slug = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/[/.]/g, "-");
      const file = `${slug}.${viewport.name}.${colorScheme}.png`;
      await page.screenshot({ path: join(out, file), fullPage: true });
      report.push({ route, viewport: viewport.name, colorScheme, height, file, problems });
      await page.close();
    }
    await context.close();
  }
}

await browser.close();
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));

const failed = report.filter((entry) => entry.problems.length);
for (const entry of report) {
  const mark = entry.problems.length ? "FAIL" : "ok  ";
  console.log(`${mark} ${entry.route.padEnd(24)} ${entry.viewport.padEnd(7)} ${entry.colorScheme.padEnd(5)} ${String(entry.height).padStart(5)}px`);
  for (const problem of entry.problems) console.log(`     ${problem}`);
}
console.log(`\nshots: ${relative(root, out)}`);

if (flag("--keep")) {
  keepPreview = true;
  console.log(`preview still running at ${base} (pid ${preview.pid}); stop it with: taskkill /pid ${preview.pid} /T /F`);
}
process.exit(failed.length ? 1 : 0);

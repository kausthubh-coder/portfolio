// Makes any checkout of this repo (the main one or a worktree) ready to work in, safely rerunnable:
// installs dependencies when bun.lock changed, gives the checkout its own dev port, and links
// .claude/skills to .agents/skills. Ends with the doctor.
//
//   bun run setup     fix what's missing, then run the doctor
//   bun run doctor    check only; prints the command that fixes each failure
//
// The site is static: no backend, no database, no secrets. The main checkout has no env files,
// so nothing is copied; .env.local only holds PORT.

import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { ROOT, DEFAULT_PORT, readPort } from "./port.mjs";

const doctorOnly = process.argv.includes("--doctor");
const git = (...args) => execFileSync("git", ["-C", ROOT, ...args], { encoding: "utf8" }).trim();
const norm = (p) => (process.platform === "win32" ? path.resolve(p).toLowerCase() : path.resolve(p));
const same = (a, b) => norm(a) === norm(b);

const MAIN = path.dirname(path.resolve(ROOT, git("rev-parse", "--git-common-dir")));
const isMain = same(MAIN, ROOT);

// The install records the hash of the lockfile it installed from, so setup only reinstalls
// when bun.lock changed.
const STAMP = path.join(ROOT, "node_modules", ".setup-stamp");
const lockHash = () => createHash("sha1").update(fs.readFileSync(path.join(ROOT, "bun.lock"))).digest("hex");
const installed = () => {
  try { return fs.readFileSync(STAMP, "utf8").trim() === lockHash(); } catch { return false; }
};

// Ports other checkouts of this repo have claimed, by path, whether or not they're running.
function otherPorts() {
  const claimed = new Map();
  for (const line of git("worktree", "list", "--porcelain").split("\n")) {
    if (!line.startsWith("worktree ")) continue;
    const dir = line.slice("worktree ".length);
    const port = readPort(dir);
    if (port && !same(dir, ROOT)) claimed.set(port, dir);
  }
  return claimed;
}

// Astro's dev server binds localhost, which is ::1 or 127.0.0.1 depending on the machine, so a
// port is free only when nothing answers on either.
const answers = (port, host) =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host });
    socket.setTimeout(300);
    socket.once("connect", () => { socket.destroy(); resolve(true); });
    socket.once("timeout", () => { socket.destroy(); resolve(false); });
    socket.once("error", () => resolve(false));
  });
const isFree = async (port) => !(await answers(port, "127.0.0.1")) && !(await answers(port, "::1"));

// The main checkout keeps Astro's usual 4321. Worktrees get 4400-5199 from a hash of their path,
// stepping past ports another checkout claimed or something else is using.
async function pickPort() {
  if (isMain) return DEFAULT_PORT;
  const claimed = otherPorts();
  const start = createHash("sha1").update(norm(ROOT)).digest().readUInt32BE(0) % 800;
  for (let i = 0; i < 800; i++) {
    const port = 4400 + ((start + i) % 800);
    if (!claimed.has(port) && (await isFree(port))) return port;
  }
  throw new Error("No free port between 4400 and 5199.");
}

function writePort(port) {
  const file = path.join(ROOT, ".env.local");
  const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const next = /^PORT=.*$/m.test(text) ? text.replace(/^PORT=.*$/m, `PORT=${port}`) : `${text}${text && !text.endsWith("\n") ? "\n" : ""}PORT=${port}\n`;
  fs.writeFileSync(file, next);
}

const SKILLS = path.join(ROOT, ".agents", "skills");
const SKILLS_LINK = path.join(ROOT, ".claude", "skills");
const skillsLinked = () => {
  try { return same(fs.realpathSync(SKILLS_LINK), fs.realpathSync(SKILLS)); } catch { return false; }
};

// Tools the checks need but setup can't install.
const has = (command, args) => spawnSync(command, args, { stdio: "ignore", shell: process.platform === "win32" }).status === 0;
// browser.mjs imports playwright-core, which isn't there until setup installs it.
const findBrowser = async () => (await import("./browser.mjs")).findBrowser();

async function setup() {
  if (!installed()) {
    console.log("> bun install --frozen-lockfile");
    const result = spawnSync("bun install --frozen-lockfile", { cwd: ROOT, stdio: "inherit", shell: true });
    if (result.status !== 0) throw new Error("bun install failed");
    fs.writeFileSync(STAMP, lockHash());
  }

  const port = readPort();
  const claimedBy = port && otherPorts().get(port);
  if (!port || claimedBy || (isMain && port !== DEFAULT_PORT)) {
    const picked = await pickPort();
    writePort(picked);
    console.log(`> PORT=${picked} written to .env.local${claimedBy ? ` (${port} belongs to ${claimedBy})` : ""}`);
  }

  if (!skillsLinked()) {
    fs.mkdirSync(path.dirname(SKILLS_LINK), { recursive: true });
    // Replace a stale link, but never delete a real folder (or recurse through a junction).
    const existing = fs.lstatSync(SKILLS_LINK, { throwIfNoEntry: false });
    if (existing && !existing.isSymbolicLink()) throw new Error(".claude/skills is a real folder; move its skills to .agents/skills and delete it");
    if (existing) try { fs.unlinkSync(SKILLS_LINK); } catch { fs.rmdirSync(SKILLS_LINK); }
    fs.symlinkSync(process.platform === "win32" ? SKILLS : path.join("..", ".agents", "skills"), SKILLS_LINK, "junction");
    console.log("> linked .claude/skills to .agents/skills");
  }
}

async function doctor() {
  const failures = [];
  const report = (ok, name, detail, fix) => {
    console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}${ok || !fix ? "" : `   fix: ${fix}`}`);
    if (!ok) failures.push(name);
  };

  report(installed(), "deps", installed() ? "match bun.lock" : "missing or older than bun.lock", "bun run setup");

  const port = readPort();
  const claimedBy = port && otherPorts().get(port);
  if (!port) report(false, "port", "no PORT in .env.local", "bun run setup");
  else if (claimedBy) report(false, "port", `${port} is also claimed by ${claimedBy}`, "bun run setup");
  else report(true, "port", `${port} (${(await isFree(port)) ? "free" : "in use, by this checkout's dev server if you started one"})`);

  report(skillsLinked(), "skills link", skillsLinked() ? ".claude/skills -> .agents/skills" : ".claude/skills is missing or points elsewhere", "bun run setup");
  report(true, "backend", "none (static site, nothing shared between checkouts)");
  report(true, "env", "nothing to copy; .env.local only holds PORT");

  const browser = installed() ? await findBrowser() : null;
  report(Boolean(browser), "browser", browser ? `${browser.name} (bun run shots drives it)` : "none; bun run shots and bun run peeks need Google Chrome or Playwright's Chromium", "install Google Chrome, or node node_modules/playwright-core/cli.js install chromium");
  report(true, "ffmpeg", has("ffmpeg", ["-version"]) ? "found (bun run peeks)" : "not on PATH; only bun run peeks needs it");

  let behind = "unknown (no origin/main)";
  try { behind = `${git("rev-list", "--count", "HEAD..origin/main")} commits behind origin/main as of the last fetch`; } catch {}
  report(true, "git", `${isMain ? "main checkout" : "worktree"} on ${git("branch", "--show-current") || "detached HEAD"}, ${behind}`);

  const summary = failures.length
    ? `portfolio NOT ready: ${failures.join(", ")} failing. Run bun run setup.`
    : `portfolio ready: http://localhost:${port} · ${isMain ? "main checkout" : "worktree"} · deps ok · no backend · ${behind.split(" as of")[0]}`;
  console.log(`\n${summary}`);
  return failures.length ? 1 : 0;
}

try {
  if (!doctorOnly) await setup();
  process.exit(await doctor());
} catch (error) {
  console.error(`setup failed: ${error.message}`);
  process.exit(1);
}

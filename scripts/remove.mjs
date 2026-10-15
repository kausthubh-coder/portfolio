// Removes a worktree of this repo and everything git leaves behind on Windows.
//
//   bun run remove -- <worktree path>              only if its branch is merged into origin/main
//   bun run remove -- <worktree path> --unmerged   when I said to drop the work
//
// It stops that checkout's own dev, preview and render processes (by PID, with their children),
// deletes the .claude/skills junction without following it, removes the worktree, deletes the
// leftover folder, and deletes the local branch. It never touches the main checkout, the checkout
// it's run from, or a worktree with uncommitted changes. The remote branch is ship-portfolio's job.

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./port.mjs";

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith("--"));
const allowUnmerged = args.includes("--unmerged");
const git = (...a) => execFileSync("git", ["-C", ROOT, ...a], { encoding: "utf8" }).trim();
const norm = (p) => (process.platform === "win32" ? path.resolve(p).toLowerCase() : path.resolve(p));
const inside = (child, parent) => norm(child) === norm(parent) || norm(child).startsWith(norm(parent) + path.sep);
const fail = (message) => {
  console.error(`remove: ${message}`);
  process.exit(1);
};

if (!target) fail("give the worktree path: bun run remove -- <path>");
const dir = path.resolve(target);
const MAIN = path.dirname(path.resolve(ROOT, git("rev-parse", "--git-common-dir")));

const worktrees = [];
let current = null;
for (const line of git("worktree", "list", "--porcelain").split("\n")) {
  if (line.startsWith("worktree ")) worktrees.push((current = { dir: line.slice(9), branch: null }));
  else if (line.startsWith("branch ") && current) current.branch = line.slice(7).replace("refs/heads/", "");
}
const tree = worktrees.find((w) => norm(w.dir) === norm(dir));
if (!tree) fail(`${dir} is not a worktree of this repo (see git worktree list)`);
if (norm(dir) === norm(MAIN)) fail("that's the main checkout; it's never removed");
if (inside(process.cwd(), dir)) fail("can't remove the checkout you're running in; run this from another checkout");

const dirty = execFileSync("git", ["-C", dir, "status", "--porcelain"], { encoding: "utf8" }).trim();
if (dirty) fail(`${dir} has uncommitted changes:\n${dirty}`);

// Merged means the branch tip is on origin/main, or its PR was merged.
if (tree.branch && !allowUnmerged) {
  spawnSync("git", ["-C", ROOT, "fetch", "origin", "--quiet"], { stdio: "ignore" });
  const onMain = spawnSync("git", ["-C", ROOT, "merge-base", "--is-ancestor", tree.branch, "origin/main"]).status === 0;
  const pr = spawnSync("gh", ["pr", "list", "--head", tree.branch, "--state", "merged", "--json", "number", "-q", ".[0].number"], { cwd: ROOT, encoding: "utf8" });
  const merged = onMain || Boolean(pr.stdout?.trim());
  if (!merged) fail(`${tree.branch} isn't merged into origin/main. Pass --unmerged only if I said to drop it.`);
}

// Stop this checkout's own processes: node, bun, Chrome, ffmpeg or esbuild running from its
// node_modules, scripts or .artifacts (astro dev or preview, shots, peeks, the Chrome they drive).
// Matching programs and folders, not the bare path, leaves agent threads and shells in it alone.
if (process.platform === "win32") {
  const needles = ["node_modules", "scripts", ".artifacts"].map((sub) => path.join(dir, sub).toLowerCase().replaceAll("'", "''"));
  const filter = needles.map((n) => `$_.CommandLine.ToLower().Contains('${n}')`).join(" -or ");
  const names = "@('node.exe','bun.exe','chrome.exe','ffmpeg.exe','esbuild.exe')";
  const ps = `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and ${names} -contains $_.Name.ToLower() -and (${filter}) } | ForEach-Object { $_.ProcessId }`;
  const pids = execFileSync("powershell", ["-NoProfile", "-Command", ps], { encoding: "utf8" }).split(/\s+/).filter(Boolean);
  for (const pid of pids) {
    if (Number(pid) === process.pid) continue;
    spawnSync("taskkill", ["/T", "/F", "/PID", pid], { stdio: "ignore" });
    console.log(`> stopped process tree ${pid}`);
  }
}

// Delete the junction itself. rmdir on a junction removes the link, never what it points at.
const link = path.join(dir, ".claude", "skills");
if (fs.lstatSync(link, { throwIfNoEntry: false })?.isSymbolicLink()) {
  fs.rmdirSync(link);
  console.log("> removed the .claude/skills junction");
}

const removed = spawnSync("git", ["-C", ROOT, "worktree", "remove", dir], { encoding: "utf8" });
if (removed.status !== 0 && fs.existsSync(path.join(dir, ".git"))) fail(`git worktree remove failed: ${removed.stderr.trim()}`);
// git leaves ignored files (node_modules, dist, .artifacts) behind on Windows.
if (fs.existsSync(dir)) {
  if (process.platform === "win32") spawnSync("cmd", ["/c", "rmdir", "/s", "/q", dir], { stdio: "inherit" });
  else fs.rmSync(dir, { recursive: true, force: true });
}
spawnSync("git", ["-C", ROOT, "worktree", "prune"]);
if (fs.existsSync(dir)) fail(`${dir} is still there; a process may still hold a file in it`);
console.log(`> removed ${dir}`);

if (tree.branch) {
  const deleted = spawnSync("git", ["-C", ROOT, "branch", "-D", tree.branch], { encoding: "utf8" });
  console.log(deleted.status === 0 ? `> deleted local branch ${tree.branch}` : `> kept local branch ${tree.branch}: ${deleted.stderr.trim()}`);
}

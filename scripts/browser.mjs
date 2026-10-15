// The browser that shots, og and peeks drive. Google Chrome when it's installed (my Windows
// machine), so nothing gets downloaded there. Otherwise Playwright's Chromium: the build this
// playwright-core wants if it's installed, else the one a cloud VM ships under
// PLAYWRIGHT_BROWSERS_PATH (an older build, which these scripts work with).
//
//   import { launchBrowser } from "./browser.mjs";
//   const browser = await launchBrowser({ args: [...] });

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const CHROME = [
  path.join(process.env.PROGRAMFILES ?? "", "Google", "Chrome", "Application", "chrome.exe"),
  path.join(process.env["PROGRAMFILES(X86)"] ?? "", "Google", "Chrome", "Application", "chrome.exe"),
  path.join(process.env.LOCALAPPDATA ?? "", "Google", "Chrome", "Application", "chrome.exe"),
  "/Applications/Google Chrome.app",
  "/usr/bin/google-chrome",
];

// { channel } or { executablePath } for chromium.launch, plus a name for the doctor; null when there's none.
export function findBrowser() {
  if (CHROME.some((file) => path.isAbsolute(file) && fs.existsSync(file))) return { name: "Google Chrome", launch: { channel: "chrome" } };
  let bundled = "";
  try { bundled = chromium.executablePath(); } catch {} // throws on hosts Playwright doesn't support
  if (bundled && fs.existsSync(bundled)) return { name: `Playwright's Chromium (${bundled})`, launch: {} };
  const shipped = path.join(process.env.PLAYWRIGHT_BROWSERS_PATH ?? "", "chromium");
  if (process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync(shipped))
    return { name: `the VM's Chromium (${fs.realpathSync(shipped)})`, launch: { executablePath: shipped } };
  return null;
}

export async function launchBrowser(options = {}) {
  const browser = findBrowser();
  if (!browser) throw new Error("no browser: install Google Chrome, or run node node_modules/playwright-core/cli.js install chromium");
  return chromium.launch({ ...options, ...browser.launch });
}

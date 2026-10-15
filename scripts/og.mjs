// Renders public/og.png, the 1200x630 image link previews show. Run it after a
// project logo changes: `bun run og`.
import { readFileSync } from "node:fs";
import { launchBrowser } from "./browser.mjs";

const root = process.cwd();
const b64 = (path) => readFileSync(root + path).toString("base64");
const logos = ["studi", "kriyan", "critly", "likh", "krida", "amy"].map((slug) =>
  b64(`/src/content/projects/${slug}/logo.png`),
);

const html = `<html><head><style>
@font-face{font-family:Sora;src:url(data:font/woff2;base64,${b64("/public/fonts/sora-latin-variable.woff2")}) format("woff2");font-weight:300 800}
body{margin:0;width:1200px;height:630px;background:#fdfdfd;color:#1c1c1c;font-family:Sora;display:grid;align-content:center;padding:0 96px;box-sizing:border-box}
.row{display:flex;align-items:center;gap:24px}.row img{width:112px;height:112px;border-radius:22px}
h1{font-size:88px;font-weight:720;letter-spacing:-0.025em;margin:0}
p{font-size:36px;margin:40px 0 0;max-width:24ch;line-height:1.3}
.logos{display:flex;gap:14px;margin-top:56px}.logos img{width:56px;height:56px;border-radius:13px;filter:grayscale(1)}
</style></head><body><div class="row"><img src="data:image/webp;base64,${b64("/public/logo.webp")}"><h1>Kausthubh.N</h1></div>
<p>just tryna take care of myself, retire my parents, and build cool shit.</p>
<div class="logos">${logos.map((logo) => `<img src="data:image/png;base64,${logo}">`).join("")}</div></body></html>`;

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${root}/public/og.png` });
await browser.close();
console.log("wrote public/og.png");

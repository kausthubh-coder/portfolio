// Renders the peek clips: the short loops that play when you hover a project on
// home, and lead each project page.
//
//   bun run peeks              render every storyboard in stories.js
//   bun run peeks -- kriyan    render one
//
// Each storyboard is drawn in Chrome, seeked frame by frame (so every run is
// identical), and encoded by ffmpeg to public/peeks/<slug>.mp4 (H.264 plays everywhere), plus a
// <slug>.webp poster. Frames are kept in .artifacts/peeks/ for inspection.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const root = process.cwd();
const fps = 30;
const out = join(root, "public", "peeks");
const stageUrl = pathToFileURL(join(root, "scripts", "peeks", "stage.html")).href;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", args: ["--allow-file-access-from-files"] });
const probe = await browser.newPage();
await probe.goto(stageUrl);
const all = await probe.evaluate(() => Object.keys(window.stories));
await probe.close();
const slugs = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));

for (const slug of slugs.length ? slugs : all) {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.goto(stageUrl);
  const { size, duration } = await page.evaluate((s) => window.build(s), slug);
  await page.setViewportSize({ width: size[0], height: size[1] });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });

  const frames = join(root, ".artifacts", "peeks", slug);
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  // Straight from Chrome: Playwright's own screenshot waits on font loading and
  // can stall mid-clip when a frame shows a glyph the web font doesn't have.
  const cdp = await page.context().newCDPSession(page);
  const count = Math.round((duration / 1000) * fps);
  for (let i = 0; i < count; i++) {
    await page.evaluate((t) => window.renderAt(t), (i * 1000) / fps);
    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "png",
      clip: { x: 0, y: 0, width: size[0], height: size[1], scale: 1 },
    });
    writeFileSync(join(frames, `f-${String(i).padStart(4, "0")}.png`), Buffer.from(data, "base64"));
  }
  await page.close();

  const input = ["-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(frames, "f-%04d.png"), "-an"];
  const encode = (args, file) => {
    const run = spawnSync("ffmpeg", [...input, ...args, join(out, file)], { stdio: "inherit" });
    if (run.status !== 0) throw new Error(`ffmpeg failed on ${file}`);
    return Math.round(statSync(join(out, file)).size / 1024);
  };
  const mp4 = encode(["-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart"], `${slug}.mp4`);
  await sharp(join(frames, "f-0000.png")).webp({ quality: 80 }).toFile(join(out, `${slug}.webp`));
  console.log(`${slug.padEnd(8)} ${size.join("x")}  ${count} frames  mp4 ${mp4} KB`);
}

await browser.close();

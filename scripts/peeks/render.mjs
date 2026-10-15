// Renders the peek clips: the short loops that play when you hover a project on
// home, and lead each project page.
//
//   bun run peeks              render every storyboard in stories.js
//   bun run peeks -- kriyan    render one
//   bun run peeks -- kriyan --stills   a contact sheet every 400 ms, no encode
//
// Each storyboard is drawn in Chrome, seeked frame by frame (so every run is
// identical), and encoded by ffmpeg to public/peeks/<slug>.mp4 (H.264 plays everywhere), plus a
// <slug>.webp poster. Frames are kept in .artifacts/peeks/ for inspection.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { launchBrowser } from "../browser.mjs";
import sharp from "sharp";

const root = process.cwd();
const fps = 60;
const out = join(root, "public", "peeks");
const stageUrl = pathToFileURL(join(root, "scripts", "peeks", "stage.html")).href;
mkdirSync(out, { recursive: true });

const browser = await launchBrowser({ args: ["--allow-file-access-from-files"] });
const probe = await browser.newPage();
await probe.goto(stageUrl);
// Stories are laid out in stage pixels and rendered sharper than that, so a clip
// stays crisp on a 2x screen (1280 wide for 16:10, 720 for a phone).
const scales = await probe.evaluate(() => Object.fromEntries(Object.entries(window.stories).map(([slug, story]) => [slug, story.scale ?? 8 / 7])));
const all = Object.keys(scales);
await probe.close();
const slugs = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
const stills = process.argv.includes("--stills");

for (const slug of slugs.length ? slugs : all) {
  const scale = scales[slug];
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
  const step = stills ? 400 : 1000 / fps;
  const count = Math.round(duration / step);
  for (let i = 0; i < count; i++) {
    await page.evaluate((t) => window.renderAt(t), i * step);
    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "png",
      clip: { x: 0, y: 0, width: size[0], height: size[1], scale },
    });
    writeFileSync(join(frames, `f-${String(i).padStart(4, "0")}.png`), Buffer.from(data, "base64"));
  }
  await page.close();

  if (stills) {
    const cols = 5;
    const tw = 512;
    const th = Math.round((tw * size[1]) / size[0]);
    const tiles = await Promise.all(
      Array.from({ length: count }, (_, i) => sharp(join(frames, `f-${String(i).padStart(4, "0")}.png`)).resize(tw).png().toBuffer()),
    );
    const sheet = join(root, ".artifacts", "peeks", `${slug}-stills.png`);
    await sharp({ create: { width: cols * tw, height: Math.ceil(count / cols) * th, channels: 3, background: "#000" } })
      .composite(tiles.map((input, i) => ({ input, left: (i % cols) * tw, top: Math.floor(i / cols) * th })))
      .png()
      .toFile(sheet);
    console.log(`${slug.padEnd(8)} ${count} stills  ${sheet}`);
    continue;
  }

  const input = ["-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(frames, "f-%04d.png"), "-an"];
  const encode = (args, file) => {
    const run = spawnSync("ffmpeg", [...input, ...args, join(out, file)], { stdio: "inherit" });
    if (run.status !== 0) throw new Error(`ffmpeg failed on ${file}`);
    return Math.round(statSync(join(out, file)).size / 1024);
  };
  const mp4 = encode(["-c:v", "libx264", "-preset", "veryslow", "-tune", "animation", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart"], `${slug}.mp4`);
  await sharp(join(frames, "f-0000.png")).webp({ quality: 80 }).toFile(join(out, `${slug}.webp`));
  console.log(`${slug.padEnd(8)} ${size.map((n) => Math.round(n * scale)).join("x")}  ${count} frames  mp4 ${mp4} KB`);
}

await browser.close();

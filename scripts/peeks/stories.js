// One storyboard per project: a few seconds that show what the product does,
// built from its real screenshots plus a few overlays drawn to match. Times are
// in milliseconds; every clip ends on its first frame so it loops cleanly.
// Positions inside a screenshot are written in that screenshot's own pixels and
// converted with `at`, so they stay right if the shot is drawn at another size.
(() => {
  const img = (slug, file) => `../../src/content/projects/${slug}/${file}`;

  const stories = {
    studi: {
      size: [1120, 700],
      bg: "#eee4cc",
      duration: 7600,
      build(P) {
        const f = 1120 / 1440;
        // The week fills only the top of its screenshot, so start zoomed in on it.
        const z = 1.35;
        const oy = -42;
        P.image(img("studi", "01-week.webp"), {
          w: 1120,
          natural: 1440,
          kfs: [{ t: 0, s: z, y: oy }, { t: 2300, s: z + 0.04, y: oy - 6 }, { t: 2600, o: 0, s: z + 0.08, y: oy - 14 }, { t: 7100, s: z, y: oy }, { t: 7600, o: 1 }],
        });
        // The assignment card lights up as it's picked.
        P.anim(
          P.el("div", {
            style: `width:${z * 187 * f}px;height:${z * 101 * f}px;border-radius:16px;box-shadow:0 0 0 4px #f5c542, 0 10px 30px -6px rgba(0,0,0,.25)`,
          }),
          [{ t: 0, o: 0, x: z * 23 * f, y: oy + z * 387 * f }, { t: 1650, o: 0 }, { t: 1800, o: 1, e: "out" }, { t: 2300, o: 1 }, { t: 2500, o: 0 }],
        );
        P.cursor(
          [{ t: 0, x: 620, y: 640, o: 0 }, { t: 300, o: 1 }, { t: 1500, x: z * 120 * f + 10, y: oy + z * 432 * f + 12 }, { t: 2300 }, { t: 2500, o: 0 }],
          [1700],
        );
        P.image(img("studi", "02-assignment.webp"), {
          w: 1120,
          natural: 1400,
          kfs: [
            { t: 0, o: 0, s: 0.9, x: 56, y: 40 },
            { t: 2150 },
            { t: 2550, o: 1, s: 1, x: 0, y: -30, e: "out" },
            { t: 3300 },
            { t: 4800, s: 1.3, x: 60 - 1.3 * 40 * 0.8, y: 120 - 1.3 * 60 * 0.8 },
            { t: 5250 },
            { t: 5550, o: 0 },
          ],
        });
        P.image(img("studi", "03-school-check.webp"), {
          w: 1120,
          natural: 1400,
          kfs: [{ t: 0, o: 0, y: 150 }, { t: 5300 }, { t: 5700, o: 1, y: 110, e: "out" }, { t: 7100 }, { t: 7500, o: 0 }],
        });
        P.caption("inky checks your classes", 200, 2300);
        P.caption("then does the work on the real school page", 2600, 5300);
        P.caption("and tells you when you're caught up", 5700, 7400);
      },
    },

    kriyan: {
      size: [1120, 700],
      bg: "#141210",
      duration: 7600,
      build(P) {
        const f = 1120 / 1440;
        P.image(img("kriyan", "01-day.webp"), {
          w: 1120,
          natural: 1440,
          kfs: [{ t: 0 }, { t: 3850 }, { t: 4150, o: 0 }, { t: 7100 }, { t: 7600, o: 1 }],
        });
        // Quick-add, typed the way you'd say it, repeat and all.
        const box = P.el("div", {
          style:
            "width:600px;height:68px;border-radius:16px;background:#1d1a17;box-shadow:0 0 0 1px #3d3731,0 24px 60px -12px rgba(0,0,0,.7);color:#f4f1ea;font-size:26px;display:flex;align-items:center;gap:14px;padding:0 24px",
          html: `<span style="color:#8a837a">+</span><span data-text></span><span data-caret style="width:2px;height:30px;background:#f4f1ea"></span>`,
        });
        P.typed(box.querySelector("[data-text]"), "gym every weekday 5pm 1h #life", 800, 50);
        P.fn((t) => {
          box.querySelector("[data-caret]").style.opacity = Math.floor(t / 400) % 2 && t > 2300 ? "0" : "1";
        });
        P.anim(box, [{ t: 0, o: 0, x: 260, y: 56, s: 0.97 }, { t: 500 }, { t: 750, o: 1, y: 70, s: 1, e: "out" }, { t: 2750 }, { t: 2950, o: 0, y: 62 }]);
        const parsed = P.el("div", {
          style: "display:flex;gap:10px;font-size:20px;color:#d8d2c8",
          html: ["every weekday", "17:00", "1h", "life"]
            .map((chip) => `<span style="padding:6px 14px;border-radius:999px;background:#2a2622">${chip}</span>`)
            .join(""),
        });
        P.anim(parsed, [{ t: 0, o: 0, x: 280, y: 160 }, { t: 2300 }, { t: 2500, o: 1, y: 152, e: "out" }, { t: 2750 }, { t: 2950, o: 0 }]);
        // The task lands on today's timeline at 5pm, and comes back every weekday.
        const block = P.el("div", {
          style:
            "border-radius:10px;background:#6fd68b;color:#0f2416;padding:8px 16px;font-size:18px;font-weight:600;overflow:hidden;white-space:nowrap;box-shadow:0 12px 30px -8px rgba(0,0,0,.6)",
          html: `Gym <span style="font-weight:400;opacity:.7">every weekday, 17:00 to 18:00</span>`,
        });
        P.anim(block, [
          { t: 0, o: 0, x: 260, y: 70, w: 600, h: 68 },
          { t: 2750 },
          { t: 2850, o: 1 },
          { t: 3450, x: 492 * f, y: 525 * f, w: 560 * f, h: 50 * f, e: "inOut" },
          { t: 3850 },
          { t: 4150, o: 0 },
        ]);
        // Open a task and pick the days it repeats on.
        P.cursor(
          [{ t: 0, x: 700, y: 640, o: 0 }, { t: 3000, o: 0 }, { t: 3200, o: 1 }, { t: 3700, x: 780 * f, y: 238 * f }, { t: 4000 }, { t: 4200, o: 0 }],
          [3780],
        );
        // Zoom in on the repeat row, keeping the panel's right edge where it is.
        const z = 1.3;
        const fx = 1120;
        const fy = 560 * f;
        P.image(img("kriyan", "02-repeat.webp"), {
          w: 1120,
          natural: 1440,
          kfs: [
            { t: 0, o: 0 },
            { t: 3800 },
            { t: 4100, o: 1, e: "out" },
            { t: 4400 },
            { t: 5150, s: z, x: fx - z * fx, y: fy - z * fy },
            { t: 5500 },
            { t: 5850, o: 0 },
          ],
        });
        const ring = (w, h, kfs) => P.anim(P.el("div", { style: `width:${w}px;height:${h}px;border-radius:12px;box-shadow:0 0 0 3px #f2bd5c` }), kfs);
        const zx = (nx) => fx - z * fx + z * nx * f;
        const zy = (ny) => fy - z * fy + z * ny * f;
        // Mon through Wed, in the zoomed-in frame.
        ring(z * 158 * f, z * 42 * f, [{ t: 0, o: 0, x: zx(1160), y: zy(602) }, { t: 5150 }, { t: 5300, o: 1, e: "out" }, { t: 5600 }, { t: 5800, o: 0 }]);
        // The week, with the overbooked day called out.
        const g = 1120 / 1180;
        P.image(img("kriyan", "03-week.webp"), {
          w: 1120,
          natural: 1180,
          kfs: [{ t: 0, o: 0, y: 20 }, { t: 5550 }, { t: 5950, o: 1, y: 0, e: "out" }, { t: 7100 }, { t: 7500, o: 0 }],
        });
        ring(156 * g, 46 * g, [{ t: 0, o: 0, x: 512 * g, y: 95 * g }, { t: 6150 }, { t: 6350, o: 1, e: "out" }, { t: 7000 }, { t: 7200, o: 0 }]);
        P.caption("type it the way you'd say it, repeats too", 300, 3500);
        P.caption("open a task to pick the days it repeats", 3700, 5650);
        P.caption("and the week tells you when you're overbooked", 5950, 7400);
      },
    },

    critly: {
      size: [1120, 700],
      bg: "#fafafa",
      duration: 7600,
      build(P) {
        const f = 1120 / 1440;
        const dx = 720 * f;
        const dy = 347 * f;
        P.image(img("critly", "01-concept.webp"), {
          w: 1120,
          natural: 1440,
          kfs: [{ t: 0 }, { t: 1900, s: 1.25, x: 560 - 1.25 * dx, y: 300 - 1.25 * dy }, { t: 2200 }, { t: 2500, o: 0 }, { t: 7100, s: 1, x: 0, y: 0 }, { t: 7600, o: 1 }],
        });
        // The demo itself, redrawn: the same timer in proportional and tabular digits.
        const demo = P.el("div", {
          style:
            "width:720px;padding:34px 40px;border-radius:24px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 24px 60px -16px rgba(0,0,0,.25);font-family:'Segoe UI',system-ui,sans-serif;color:#171717",
          html: ["proportional", "tabular"]
            .map(
              // Left-aligned with a marker right after the digits: the
              // proportional marker jitters as the digits change, the tabular one holds.
              (kind) => `<div style="display:grid;grid-template-columns:230px auto;align-items:center;padding:14px 0">
                <span style="font-size:24px;color:#737373;font-family:Sora">${kind}</span>
                <span style="display:flex;align-items:center;gap:8px"><span data-timer style="font-size:84px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:${kind}-nums"></span><span style="width:4px;height:70px;background:#3b82f6;border-radius:2px"></span></span>
              </div>`,
            )
            .join(`<div style="height:1px;background:#ececec"></div>`),
        });
        P.fn((t) => {
          const value = (10 + ((1.11 + Math.floor(t / 110) * 7.37) % 89)).toFixed(2);
          demo.querySelectorAll("[data-timer]").forEach((node) => (node.textContent = value));
        });
        P.anim(demo, [{ t: 0, o: 0, x: 200, y: 150, s: 0.96 }, { t: 2200 }, { t: 2550, o: 1, y: 120, s: 1, e: "out" }, { t: 4400 }, { t: 4700, o: 0, y: 110 }]);
        P.image(img("critly", "02-easings.webp"), {
          w: 1120,
          natural: 1440,
          kfs: [{ t: 0, o: 0 }, { t: 4500 }, { t: 4900, o: 1 }, { t: 7100 }, { t: 7500, o: 0 }],
        });
        const term = P.el("div", {
          style:
            "width:660px;padding:28px 32px;border-radius:18px;background:#161616;color:#e5e5e5;font-size:24px;line-height:1.7;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 30px 70px -16px rgba(0,0,0,.7)",
          html: `<div><span style="color:#737373">$ </span><span data-cmd></span></div><div data-a style="color:#a3e635">✓ critly</div><div data-b style="color:#a3e635">✓ critly-audit</div>`,
        });
        P.typed(term.querySelector("[data-cmd]"), "npx skills add kausthubh-coder/critly", 5100, 32);
        P.fn((t) => {
          term.querySelector("[data-a]").style.opacity = t > 6500 ? "1" : "0";
          term.querySelector("[data-b]").style.opacity = t > 6700 ? "1" : "0";
        });
        P.anim(term, [{ t: 0, o: 0, x: 230, y: 210, s: 0.96 }, { t: 4800 }, { t: 5100, o: 1, y: 190, s: 1, e: "out" }, { t: 7100 }, { t: 7400, o: 0 }]);
        P.caption("every concept has a rule and a demo", 300, 2300);
        P.caption("so you can feel wrong next to right", 2600, 4600);
        P.caption("and skills so your agent builds with them", 5000, 7400);
      },
    },

    likh: {
      size: [1120, 700],
      bg: "linear-gradient(160deg,#f0f0f0,#dadada)",
      duration: 7600,
      build(P) {
        // Any app you're typing in. Likh doesn't care which.
        const win = P.el("div", {
          style:
            "width:800px;height:400px;border-radius:20px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 30px 70px -20px rgba(0,0,0,.3);padding:22px 30px;font-size:24px;color:#171717",
          html: `<div style="display:flex;gap:8px;margin-bottom:26px"><i style="width:13px;height:13px;border-radius:50%;background:#e5e5e5"></i><i style="width:13px;height:13px;border-radius:50%;background:#e5e5e5"></i><i style="width:13px;height:13px;border-radius:50%;background:#e5e5e5"></i></div>
            <div style="color:#737373;font-size:19px">sam</div><div style="margin:4px 0 22px">standup in 5?</div>
            <div style="position:absolute;left:30px;right:30px;bottom:26px;min-height:76px;border-radius:14px;box-shadow:0 0 0 2px #e5e5e5;display:flex;align-items:center;padding:0 22px;white-space:pre">
              <span data-placeholder style="color:#a3a3a3">message #general</span><span data-msg></span><span data-more></span><span data-caret style="width:2px;height:30px;margin-left:2px;background:#171717"></span>
            </div>`,
        });
        P.anim(win, [{ t: 0, x: 160, y: 60 }]);
        const msg = win.querySelector("[data-msg]");
        const more = win.querySelector("[data-more]");
        // Held: the first half lands on let go. Hands-free: the rest lands once it goes quiet.
        P.typed(msg, "running 5 min late,", 2450, 40);
        P.typed(more, " start without me", 5450, 40);
        P.fn((t) => {
          win.querySelector("[data-placeholder]").style.display = msg.textContent ? "none" : "";
          win.querySelector("[data-caret]").style.opacity = Math.floor(t / 450) % 2 ? "0" : "1";
          const fade = t > 7300 ? String(Math.max(0, 1 - (t - 7300) / 250)) : "1";
          msg.style.opacity = fade;
          more.style.opacity = fade;
        });
        // Ctrl + Space: held while you talk, then tapped once for hands-free.
        const keys = P.el("div", {
          style: "display:flex;align-items:center;gap:14px;font-size:24px;color:#404040",
          html: `<span data-key style="width:110px;height:68px;display:grid;place-items:center;border-radius:14px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 5px 0 #c9c9c9">ctrl</span>+<span data-key style="width:190px;height:68px;display:grid;place-items:center;border-radius:14px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.08),0 5px 0 #c9c9c9">space</span>`,
        });
        P.fn((t) => {
          const down = (t > 600 && t < 2300) || (t > 3750 && t < 3920);
          keys.querySelectorAll("[data-key]").forEach((key) => {
            key.style.transform = down ? "translateY(4px)" : "";
            key.style.boxShadow = down ? "0 0 0 1px rgba(0,0,0,.08),0 1px 0 #c9c9c9" : "0 0 0 1px rgba(0,0,0,.08),0 5px 0 #c9c9c9";
            key.style.background = down ? "#f4f4f4" : "#fff";
          });
        });
        P.anim(keys, [{ t: 0, o: 0, x: 60, y: 520 }, { t: 300, o: 1, y: 500, e: "out" }, { t: 4100 }, { t: 4400, o: 0, y: 510 }]);
        // The pill: listening, then counting down the quiet before it stops by itself.
        const bars = Array.from({ length: 7 }, () => `<i style="width:9px;border-radius:5px;background:#f2a07c"></i>`).join("");
        const C = 2 * Math.PI * 17;
        const pill = P.el("div", {
          style:
            "width:230px;height:70px;border-radius:999px;background:#15161c;box-shadow:0 0 0 1px #2c2d36,0 18px 40px -10px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;gap:8px",
          html: `${bars}<span data-count style="position:relative;width:42px;height:42px;margin-left:12px;place-items:center;color:#fafafa;font-size:19px;font-weight:600">
              <svg width="42" height="42" viewBox="0 0 42 42" style="position:absolute;inset:0;transform:rotate(-90deg)"><circle cx="21" cy="21" r="17" fill="none" stroke="#2c2d36" stroke-width="3"/><circle data-arc cx="21" cy="21" r="17" fill="none" stroke="#f2a07c" stroke-width="3" stroke-linecap="round" stroke-dasharray="${C}"/></svg><b data-n style="position:relative;font-weight:600"></b></span>`,
        });
        const count = pill.querySelector("[data-count]");
        P.fn((t) => {
          const talking = (t > 800 && t < 2300) || (t > 4000 && t < 4600);
          pill.querySelectorAll("i").forEach((bar, i) => {
            const wave = Math.abs(Math.sin(t / 110 + i * 1.3) * Math.cos(t / 260 + i));
            bar.style.height = `${10 + 32 * wave * (talking ? 1 : 0.12)}px`;
          });
          // Quiet from 4600: the countdown, sped up for the clip.
          const q = P.clamp((t - 4650) / 750);
          const counting = t > 4600 && t < 5500;
          count.style.display = counting ? "grid" : "none";
          pill.style.width = counting ? "292px" : "230px";
          pill.querySelector("[data-arc]").style.strokeDashoffset = String(C * q);
          pill.querySelector("[data-n]").textContent = String(Math.max(1, 3 - Math.floor(q * 3)));
        });
        P.anim(pill, [
          { t: 0, o: 0, x: 445, y: 530, s: 0.9 },
          { t: 650 },
          { t: 900, o: 1, y: 500, s: 1, e: "out" },
          { t: 2300 },
          { t: 2550, o: 0, y: 510, s: 0.9 },
          { t: 3850, y: 530 },
          { t: 4100, o: 1, y: 500, s: 1, e: "out" },
          { t: 4600 },
          { t: 4601, x: 414 },
          { t: 5400 },
          { t: 5600, o: 0, y: 510, s: 0.9 },
        ]);
        // Or skip the keyboard: a mouse button works too.
        const pw = 780;
        const pf = pw / 1440;
        P.image(img("likh", "settings-general.webp"), {
          w: pw,
          natural: 1440,
          style: "border-radius:22px;box-shadow:0 30px 70px -16px rgba(0,0,0,.55)",
          kfs: [{ t: 0, o: 0, x: 170, y: 46, s: 0.97 }, { t: 5850 }, { t: 6200, o: 1, y: 22, s: 1, e: "out" }, { t: 7100 }, { t: 7400, o: 0 }],
        });
        P.anim(P.el("div", { style: `width:${516 * pf}px;height:${74 * pf}px;border-radius:12px;box-shadow:0 0 0 3px #f2a07c` }), [
          { t: 0, o: 0, x: 170 + 428 * pf, y: 22 + 486 * pf },
          { t: 6400 },
          { t: 6600, o: 1, e: "out" },
          { t: 7000 },
          { t: 7200, o: 0 },
        ]);
        P.caption("hold ctrl + space, talk, and let go", 300, 3500);
        P.caption("or tap once, and it stops when you go quiet", 3700, 5950);
        P.caption("a mouse button works too", 6150, 7400);
      },
    },

    krida: {
      size: [1120, 700],
      bg: "#0c0a08",
      duration: 7600,
      build(P) {
        const f = 1120 / 1280;
        P.image(img("krida", "01-home.webp"), {
          w: 1120,
          natural: 1280,
          kfs: [{ t: 0 }, { t: 2100 }, { t: 2450, o: 0 }, { t: 7100 }, { t: 7600, o: 1 }],
        });
        P.cursor(
          [{ t: 0, x: 600, y: 640, o: 0 }, { t: 300, o: 1 }, { t: 1500, x: 1140 * f, y: 352 * f }, { t: 2100 }, { t: 2300, o: 0 }],
          [1700],
        );
        P.image(img("krida", "02-watch-party.webp"), {
          w: 1120,
          natural: 1280,
          kfs: [{ t: 0, o: 0, s: 0.95, x: 28, y: 35 }, { t: 2000 }, { t: 2450, o: 1, s: 1, x: 0, y: 17, e: "out" }, { t: 5300 }, { t: 5600, o: 0 }],
        });
        const toast = (text, at, until) =>
          P.anim(
            P.el("div", {
              style:
                "display:flex;align-items:center;gap:12px;padding:14px 22px;border-radius:999px;background:#1c1916;color:#f4efe8;font-size:24px;box-shadow:0 0 0 1px #34302b,0 16px 40px -10px rgba(0,0,0,.7);white-space:nowrap",
              html: `<i style="width:12px;height:12px;border-radius:50%;background:#f2bd5c"></i>${text}`,
            }),
            [{ t: 0, o: 0, x: 200, y: 250, s: 0.95 }, { t: at }, { t: at + 250, o: 1, y: 230, s: 1, e: "out" }, { t: until - 200 }, { t: until, o: 0 }],
          );
        toast("friend joined the party", 2900, 4200);
        toast("paused for everyone at 0:02", 4250, 5400);
        P.anim(
          P.el("div", {
            style: "width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.12);display:grid;place-items:center",
            html: `<div style="display:flex;gap:14px"><i style="width:14px;height:46px;border-radius:3px;background:#fff"></i><i style="width:14px;height:46px;border-radius:3px;background:#fff"></i></div>`,
          }),
          [{ t: 0, o: 0, x: 330, y: 300, s: 0.8 }, { t: 4250 }, { t: 4450, o: 1, s: 1, e: "out" }, { t: 5100 }, { t: 5400, o: 0, s: 1.1 }],
        );
        P.image(img("krida", "03-title.webp"), {
          w: 1120,
          natural: 1280,
          kfs: [{ t: 0, o: 0, y: 90 }, { t: 5400 }, { t: 5800, o: 1, y: 70, e: "out" }, { t: 7100 }, { t: 7500, o: 0 }],
        });
        P.anim(
          P.el("div", { style: `width:${172 * f}px;height:${48 * f}px;border-radius:999px;box-shadow:0 0 0 4px #f2bd5c` }),
          [{ t: 0, o: 0, x: 163 * f, y: 70 + 508 * f }, { t: 6200 }, { t: 6400, o: 1, e: "out" }, { t: 7000 }, { t: 7200, o: 0 }],
        );
        P.caption("pick something to watch", 200, 2200);
        P.caption("watch it together, in sync", 2500, 5500);
        P.caption("watch together sits right next to play", 5900, 7400);
      },
    },

    amy: {
      size: [540, 960],
      bg: "#111111",
      duration: 7600,
      build(P) {
        const f = 960 / 915;
        const x0 = (540 - 412 * f) / 2;
        const at = (nx, ny) => [x0 + nx * f, ny * f];
        P.image(img("amy", "01-line.webp"), {
          w: 412 * f,
          natural: 412,
          kfs: [{ t: 0, x: x0 }, { t: 2900 }, { t: 3200, o: 0 }, { t: 7100 }, { t: 7600, o: 1 }],
        });
        // Hide the finished line, then reveal it a letter at a time, like typing.
        const [tx, ty] = at(21, 131);
        const textW = 162 * f;
        const cover = P.el("div", { style: `height:${33 * f}px;background:#111111` });
        const caret = P.el("div", { style: `width:3px;height:${30 * f}px;background:#f2f2f2` });
        P.fn((t) => {
          const chars = Math.max(0, Math.min(14, Math.floor((t - 500) / 80)));
          const p = chars / 14;
          const fade = t > 2850 ? 0 : 1;
          cover.style.opacity = String(fade);
          cover.style.width = `${textW * (1 - p)}px`;
          cover.style.transform = `translate(${tx + textW * p}px, ${ty}px)`;
          caret.style.opacity = String(fade * (Math.floor(t / 420) % 2 ? 0 : 1));
          caret.style.transform = `translate(${tx + textW * p + 2}px, ${ty + 2}px)`;
        });
        const [cx, cy] = at(298, 128);
        P.anim(P.el("div", { style: `width:${95 * f}px;height:${36 * f}px;background:#111111` }), [
          { t: 0, x: cx, y: cy },
          { t: 1750 },
          { t: 2050, o: 0, e: "out" },
          { t: 7500 },
          { t: 7600, o: 1 },
        ]);
        const [bx, by] = at(54, 870);
        P.anim(P.el("div", { style: `width:${74 * f}px;height:${36 * f}px;background:#212023` }), [
          { t: 0, x: bx, y: by },
          { t: 1950 },
          { t: 2200, o: 0, e: "out" },
          { t: 7500 },
          { t: 7600, o: 1 },
        ]);
        const fit = 960 / 2856;
        P.image(img("amy", "02-photo.webp"), {
          w: 1280 * fit,
          natural: 1280,
          kfs: [{ t: 0, o: 0, x: (540 - 1280 * fit) / 2, y: 960 }, { t: 2900, o: 1 }, { t: 3350, y: 0, e: "out" }, { t: 5000 }, { t: 5300, o: 0 }],
        });
        P.image(img("amy", "03-streaks.webp"), {
          w: 1280 * fit,
          natural: 1280,
          kfs: [{ t: 0, o: 0, x: (540 - 1280 * fit) / 2 + 8, y: 14, s: 0.97 }, { t: 5100 }, { t: 5450, o: 1, s: 1, x: (540 - 1280 * fit) / 2, y: 0, e: "out" }, { t: 7100 }, { t: 7500, o: 0 }],
        });
        const low = "bottom:150px;font-size:30px";
        P.caption("type what you ate", 300, 2900, low);
        P.caption("or snap a photo of it", 3300, 5100, low);
        P.caption("and keep the streak going", 5500, 7400, low);
      },
    },
  };

  window.stories = stories;
  window.build = (slug) => {
    const story = stories[slug];
    window.P.size(story.size[0], story.size[1], story.bg);
    story.build(window.P);
    return { size: story.size, duration: story.duration };
  };
})();

// One storyboard per project: a few seconds that show what the product does,
// built from its real screenshots plus a few overlays drawn to match. Times are
// in milliseconds; every clip ends on its first frame so it loops cleanly.
// Positions inside a screenshot are written in that screenshot's own pixels and
// converted with `at`, so they stay right if the shot is drawn at another size.
(() => {
  const img = (slug, file) => `../../src/content/projects/${slug}/${file}`;
  // Real UI states captured for a clip, kept next to the storyboards.
  const shot = (slug, file) => `shots/${slug}/${file}`;
  // Where a camera group goes so the box W screenshot pixels wide around (cx, cy)
  // fills the stage. `f` is stage pixels per screenshot pixel.
  const frame = (f, W, cx, cy, w = 1120, h = 700) => {
    const s = w / (W * f);
    return { s, x: w / 2 - cx * f * s, y: h / 2 - cy * f * s };
  };

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
         
          kfs: [{ t: 0, o: 0, y: 150 }, { t: 5300 }, { t: 5700, o: 1, y: 110, e: "out" }, { t: 7100 }, { t: 7500, o: 0 }],
        });
        P.caption("inky checks your classes", 200, 2300);
        P.caption("then does the work on the real school page", 2600, 5300);
        P.caption("and tells you when you're caught up", 5700, 7400);
      },
    },

    kriyan: {
      size: [1120, 700],
      bg: "#121110",
      duration: 9400,
      build(P) {
        // Positions are in the 2880-wide capture's pixels.
        const f = 1120 / 2880;
        const at = (n) => n * f;
        const cam = (W, cx, cy) => frame(f, W, cx, cy);

        // Quick-add, typed the way you'd say it, and the block lands at 17:00.
        const g1 = P.group([
          { t: 0, o: 1, ...cam(1900, 1250, 560) },
          { t: 2200, ...cam(1800, 1250, 540), e: "soft" },
          { t: 3000, ...cam(1700, 2050, 720) },
          { t: 3700, ...cam(1640, 2080, 730), e: "soft" },
          { t: 4050, o: 0, ...cam(1560, 2100, 740) },
          { t: 8800, o: 0, ...cam(2000, 1250, 580) },
          { t: 9400, o: 1, ...cam(1900, 1250, 560), e: "out" },
        ]);
        const qa = (n) => shot("kriyan", `quickadd-0${n}.webp`);
        P.states(
          [
            { src: qa(1), t: 0 },
            { src: qa(2), t: 700 },
            { src: qa(3), t: 1250 },
            { src: qa(4), t: 1800 },
            { src: qa(5), t: 2650 },
            { src: qa(6), t: 3500 },
            { src: qa(1), t: 8200 },
          ],
          { w: 1120, parent: g1, fade: 140 },
        );

        // Open a task and give it a repeat: Wednesday, then Friday too.
        const g2 = P.group([
          { t: 0, o: 0, ...cam(2050, 2150, 820) },
          { t: 3850 },
          { t: 4250, o: 1, ...cam(1900, 2150, 850), e: "out" },
          { t: 5400 },
          { t: 5750, ...cam(1900, 2150, 1090) },
          { t: 6300, ...cam(1860, 2150, 1100), e: "soft" },
          { t: 6650, o: 0, ...cam(1800, 2150, 1110) },
        ]);
        const rp = (n) => shot("kriyan", `repeat-0${n}.webp`);
        P.states(
          [
            { src: rp(1), t: 0 },
            { src: rp(2), t: 4750 },
            { src: rp(3), t: 5350 },
            { src: rp(4), t: 5950 },
          ],
          { w: 1120, parent: g2, fade: 140 },
        );
        P.cursor(
          [
            { t: 0, x: at(2700), y: at(1300), o: 0 },
            { t: 4200, o: 0 },
            { t: 4350, o: 1 },
            { t: 4650, x: at(2420), y: at(412) },
            { t: 5250, x: at(1983), y: at(864) },
            { t: 5850, x: at(2140), y: at(1431) },
            { t: 6150 },
            { t: 6350, o: 0 },
          ],
          [4700, 5300, 5900],
          { parent: g2, size: 0.75 },
        );

        // Your AI proposes a plan; nothing lands until you accept it.
        const g3 = P.group([
          { t: 0, o: 0, ...cam(2000, 1950, 1300) },
          { t: 6450 },
          { t: 6900, o: 1, ...cam(1850, 1950, 1340), e: "out" },
          { t: 8700, ...cam(1720, 1980, 1385), e: "soft" },
          { t: 9100, o: 0, ...cam(1660, 1990, 1400) },
        ]);
        P.states(
          [
            { src: shot("kriyan", "03-week.webp"), t: 0 },
            { src: shot("kriyan", "05-proposal.webp"), t: 7500 },
          ],
          { w: 1120, parent: g3, fade: 420 },
        );

        P.caption("type it the way you'd say it", 300, 3800);
        P.caption("repeats you can click or type", 4200, 6450);
        P.caption("your AI proposes a plan, you accept it", 6900, 9100);
      },
    },

    critly: {
      size: [1120, 700],
      bg: "#ffffff",
      duration: 9400,
      build(P) {
        const f = 1120 / 2048;
        const at = (n) => n * f;

        // One brief, four directions: click through them on the real demo.
        const one = (W, cx, cy) => frame(f, W, cx, cy);
        const g1 = P.group([
          { t: 0, o: 1, ...one(1360, 1010, 445) },
          { t: 3300, ...one(1300, 1000, 450), e: "soft" },
          { t: 3750, o: 0, ...one(1180, 980, 450) },
          { t: 8800, o: 0, ...one(1440, 1010, 440) },
          { t: 9400, o: 1, ...one(1360, 1010, 445), e: "out" },
        ]);
        const dir = (n) => shot("critly", `direction-0${n}.webp`);
        P.states(
          [
            { src: dir(1), t: 0 },
            { src: dir(2), t: 1100 },
            { src: dir(3), t: 1850 },
            { src: dir(4), t: 2600 },
            { src: dir(1), t: 8000 },
          ],
          { w: 1120, parent: g1, fade: 160 },
        );
        P.cursor(
          [
            { t: 0, x: at(1500), y: at(900), o: 0 },
            { t: 350, o: 1 },
            { t: 1000, x: at(795), y: at(86) },
            { t: 1700, x: at(932), y: at(86) },
            { t: 2450, x: at(1099), y: at(86) },
            { t: 2900 },
            { t: 3200, o: 0 },
          ],
          [1050, 1800, 2550],
          { parent: g1, size: 1 / 1.5 },
        );

        // A weak first screen, then the strong one, for two made-up products.
        const two = (W, cx, cy) => frame(f, W, cx, cy);
        const g2 = P.group([
          { t: 0, o: 0, ...two(1760, 1024, 700) },
          { t: 3350 },
          { t: 3800, o: 1, ...two(1600, 1024, 705), e: "out" },
          { t: 6500, ...two(1560, 1024, 705), e: "soft" },
          { t: 6900, o: 0, ...two(1440, 1024, 705) },
        ]);
        const fs = (n) => shot("critly", `first-screen-0${n}.webp`);
        P.states(
          [
            { src: fs(1), t: 0 },
            { src: fs(2), t: 4500 },
            { src: fs(3), t: 5250 },
            { src: fs(4), t: 6000 },
          ],
          { w: 1120, parent: g2, fade: 200 },
        );
        P.cursor(
          [
            { t: 0, x: at(1400), y: at(1150), o: 0 },
            { t: 3800, o: 0 },
            { t: 4050, o: 1 },
            { t: 4400, x: at(966), y: at(984) },
            { t: 5000 },
            { t: 5300, x: at(820), y: at(984) },
            { t: 5900, x: at(966), y: at(984) },
            { t: 6300 },
            { t: 6550, o: 0 },
          ],
          [4450, 5950],
          { parent: g2, size: 1 / 1.3 },
        );

        // And the check: a slow push into its findings.
        const three = (W, cx, cy) => frame(f, W, cx, cy);
        const g3 = P.group([
          { t: 0, o: 0, ...three(1340, 1024, 800) },
          { t: 6600 },
          { t: 7050, o: 1, ...three(1240, 1000, 810), e: "out" },
          { t: 8700, ...three(1100, 960, 850), e: "soft" },
          { t: 9300, o: 0, ...three(1020, 940, 860) },
        ]);
        P.image(img("critly", "04-check.webp"), { w: 1120, parent: g3 });

        P.caption("one brief, four directions", 300, 3300);
        P.caption("a weak first screen, then a strong one", 3700, 6600);
        P.caption("and a check your agent can't skip", 7000, 9100);
      },
    },

    likh: {
      size: [1120, 700],
      bg: "linear-gradient(160deg,#f2f2f2,#d9d9d9)",
      duration: 9400,
      build(P) {
        // Any app you're typing in. Likh doesn't care which.
        const scene = P.group([
          { t: 0, o: 1 },
          { t: 6200 },
          { t: 6500, o: 0, s: 0.96, x: 22, y: 14, e: "soft" },
          { t: 8900, o: 0, s: 1, x: 0, y: 0 },
          { t: 9400, o: 1, e: "out" },
        ]);
        const win = P.el("div", {
          parent: scene,
          style:
            "width:800px;height:380px;border-radius:22px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 40px 80px -24px rgba(0,0,0,.28);padding:24px 32px;font-size:25px;color:#171717",
          html: `<div style="display:flex;gap:8px;margin-bottom:28px"><i style="width:13px;height:13px;border-radius:50%;background:#e5e5e5"></i><i style="width:13px;height:13px;border-radius:50%;background:#e5e5e5"></i><i style="width:13px;height:13px;border-radius:50%;background:#e5e5e5"></i></div>
            <div style="color:#737373;font-size:19px">sam</div><div style="margin:4px 0 22px">standup in 5?</div>
            <div style="position:absolute;left:32px;right:32px;bottom:28px;min-height:78px;border-radius:14px;box-shadow:0 0 0 2px #e8e8e8;display:flex;align-items:center;padding:0 22px;white-space:pre">
              <span data-placeholder style="color:#a3a3a3">message #general</span><span data-msg></span><span data-more></span><span data-caret style="width:2px;height:30px;margin-left:2px;background:#171717"></span>
            </div>`,
        });
        P.anim(win, [{ t: 0, x: 160, y: 50 }]);
        const msg = win.querySelector("[data-msg]");
        const more = win.querySelector("[data-more]");
        // Held: the words land when you let go. Hands-free: once you go quiet.
        P.typed(msg, "running 5 min late,", 2650, 26);
        P.typed(more, " start without me", 6000, 26);
        P.fn((t) => {
          const reset = t > 8000;
          msg.style.display = more.style.display = reset ? "none" : "";
          win.querySelector("[data-placeholder]").style.display = msg.textContent && !reset ? "none" : "";
          win.querySelector("[data-caret]").style.opacity = Math.floor(t / 450) % 2 ? "0" : "1";
        });
        // Ctrl + Space: held while you talk, then tapped once for hands-free.
        const keys = P.el("div", {
          parent: scene,
          style: "display:flex;align-items:center;gap:14px;font-size:24px;color:#404040",
          html: `<span data-key style="width:110px;height:66px;display:grid;place-items:center;border-radius:14px;background:#fff">ctrl</span>+<span data-key style="width:190px;height:66px;display:grid;place-items:center;border-radius:14px;background:#fff">space</span>`,
        });
        P.fn((t) => {
          const down = (t > 600 && t < 2400) || (t > 3800 && t < 3960);
          keys.querySelectorAll("[data-key]").forEach((key) => {
            key.style.transform = down ? "translateY(4px)" : "";
            key.style.boxShadow = down ? "0 0 0 1px rgba(0,0,0,.08),0 1px 0 #c4c4c4" : "0 0 0 1px rgba(0,0,0,.08),0 5px 0 #c4c4c4";
            key.style.background = down ? "#f2f2f2" : "#fff";
          });
        });
        P.anim(keys, [{ t: 0, o: 0, x: 60, y: 480 }, { t: 250, o: 1, y: 466, e: "out" }, { t: 4300 }, { t: 4600, o: 0, y: 474 }]);
        // The real pill, drawn by likh's own renderer, under the window.
        const pill = (name) => shot("likh", `pill-${name}.webp`);
        const talk = [];
        for (let t = 760; t < 2400; t += 130) talk.push({ src: pill(talk.length % 2 ? "hold-04-listening" : "hold-03-listening"), t });
        P.states(
          [
            { src: pill("hold-01-hidden"), t: 0 },
            { src: pill("hold-02-growing"), t: 640 },
            ...talk,
            { src: pill("hold-05-thinking"), t: 2400 },
            { src: pill("hold-06-done"), t: 2650 },
            { src: pill("hold-07-gone"), t: 2800 },
            { src: pill("hold-02-growing"), t: 3900 },
            { src: pill("free-01-listening"), t: 4000 },
            { src: pill("free-02-quiet"), t: 4700 },
            { src: pill("free-03-quiet"), t: 5000 },
            { src: pill("free-04-quiet"), t: 5300 },
            { src: pill("free-05-quiet"), t: 5600 },
            { src: pill("free-06-thinking"), t: 5800 },
            { src: pill("hold-06-done"), t: 6000 },
            { src: pill("hold-07-gone"), t: 6150 },
          ],
          { w: 1000, fade: 90, parent: P.group([{ t: 0, x: 60, y: 330 }], { parent: scene }) },
        );

        // Or pick your own shortcut, right on the keyboard.
        const f = 820 / 1440;
        const g = P.group([
          { t: 0, o: 0, ...frame(f, 2100, 720, 520) },
          { t: 6350 },
          { t: 6800, o: 1, ...frame(f, 1980, 720, 560), e: "out" },
          { t: 7050 },
          { t: 7650, ...frame(f, 1080, 900, 420) },
          { t: 8800, ...frame(f, 1030, 900, 410), e: "soft" },
          { t: 9200, o: 0 },
        ]);
        const sc = (n) => shot("likh", `shortcut-0${n}.webp`);
        P.states(
          [
            { src: sc(1), t: 0 },
            { src: sc(2), t: 7750 },
            { src: sc(3), t: 8050 },
            { src: sc(4), t: 8250 },
            { src: sc(5), t: 8500 },
          ],
          { w: 820, fade: 140, parent: g, style: "border-radius:18px;box-shadow:0 40px 80px -20px rgba(0,0,0,.5)" },
        );
        P.cursor(
          [
            { t: 0, x: 1000 * f, y: 700 * f, o: 0 },
            { t: 7100, o: 0 },
            { t: 7250, o: 1 },
            { t: 7650, x: 812 * f, y: 302 * f },
            { t: 7850 },
            { t: 8050, o: 0 },
          ],
          [7680],
          { parent: g, size: 0.7 },
        );

        P.caption("hold ctrl + space, talk, let go", 300, 3500);
        P.caption("or tap once, and it stops when you go quiet", 3700, 6300);
        P.caption("pick any shortcut you like", 6800, 9000);
      },
    },

    krida: {
      size: [1120, 700],
      bg: "#000000",
      duration: 9400,
      build(P) {
        // Positions are in the 2880-wide capture's pixels.
        const f = 1120 / 2880;
        const at = (n) => n * f;
        const cam = (W, cx, cy) => frame(f, W, cx, cy);

        // Start a party from a title, and a friend joins.
        const g1 = P.group([
          { t: 0, o: 1, ...cam(2880, 1440, 900) },
          { t: 1650 },
          { t: 2350, ...cam(1700, 2030, 560) },
          { t: 4000, ...cam(1640, 2040, 560), e: "soft" },
          { t: 4350, o: 0, ...cam(1560, 2050, 560) },
          { t: 8800, o: 0, ...cam(3000, 1440, 900) },
          { t: 9400, o: 1, ...cam(2880, 1440, 900), e: "out" },
        ]);
        const party = (n) => shot("krida", `party-0${n}.webp`);
        P.states(
          [
            { src: party(1), t: 0 },
            { src: party(2), t: 800 },
            { src: party(3), t: 1650 },
            { src: party(4), t: 2550 },
            { src: party(5), t: 3100 },
            { src: party(6), t: 3600 },
            { src: party(1), t: 8200 },
          ],
          { w: 1120, parent: g1, fade: 180 },
        );
        P.cursor(
          [
            { t: 0, x: at(1700), y: at(1500), o: 0 },
            { t: 200, o: 1 },
            { t: 680, x: at(1104), y: at(1156) },
            { t: 1400, x: at(1440), y: at(1215) },
            { t: 1600 },
            { t: 1750, o: 0 },
          ],
          [720, 1450],
          { parent: g1 },
        );

        // Point along the timeline and see that moment.
        const g2 = P.group([
          { t: 0, o: 0, ...cam(2500, 1250, 1200) },
          { t: 4150 },
          { t: 4550, o: 1, ...cam(2300, 1180, 1258), e: "out" },
          { t: 5600 },
          { t: 6700, ...cam(2260, 1430, 1265), e: "soft" },
          { t: 6900, ...cam(2240, 1440, 1270), e: "soft" },
          { t: 7250, o: 0 },
        ]);
        const line = (n) => shot("krida", `timeline-0${n}.webp`);
        P.states(
          [
            { src: line(1), t: 0 },
            { src: line(2), t: 4950 },
            { src: line(3), t: 5350 },
            { src: line(4), t: 5850 },
            { src: line(5), t: 6250 },
            { src: line(6), t: 6700 },
          ],
          { w: 1120, parent: g2, fade: 90 },
        );
        P.cursor(
          [
            { t: 0, x: at(600), y: at(1400), o: 0 },
            { t: 4550, o: 0 },
            { t: 4700, o: 1 },
            { t: 4950, x: at(479), y: at(1608) },
            { t: 5350, x: at(703), y: at(1608), e: "soft" },
            { t: 5850, x: at(1233), y: at(1608), e: "soft" },
            { t: 6250, x: at(1652), y: at(1608), e: "soft" },
            { t: 6700, x: at(2225), y: at(1608), e: "soft" },
            { t: 6950 },
            { t: 7150, o: 0 },
          ],
          [],
          { parent: g2, size: 0.85 },
        );

        // And it plays for everyone at once.
        const g3 = P.group([
          { t: 0, o: 0, ...cam(2880, 1440, 900) },
          { t: 7050 },
          { t: 7500, o: 1, ...cam(2700, 1300, 880), e: "out" },
          { t: 9000, ...cam(2450, 1150, 860), e: "soft" },
          { t: 9300, o: 0 },
        ]);
        P.image(shot("krida", "watch-party.webp"), { w: 1120, parent: g3 });

        P.caption("start a party, and a friend joins", 300, 4200);
        P.caption("point at the timeline to see that moment", 4550, 7100);
        P.caption("and it plays for everyone at once", 7500, 9200);
      },
    },

    amy: {
      size: [540, 960],
      scale: 4 / 3,
      bg: "#111111",
      duration: 9200,
      build(P) {
        const f = 540 / 1080;
        const cam = (W, cx, cy) => frame(f, W, cx, cy, 540, 960);
        const at = (n) => n * f;

        // Type a line, press enter, and the calories land next to it.
        const g1 = P.group([
          { t: 0, o: 1, ...cam(1100, 540, 960) },
          { t: 3100, ...cam(1080, 540, 940), e: "soft" },
          { t: 3450, o: 0, ...cam(1040, 540, 920) },
          { t: 8700, o: 0, ...cam(1160, 540, 980) },
          { t: 9200, o: 1, ...cam(1100, 540, 960), e: "out" },
        ]);
        const line = (n) => shot("amy", `line-0${n}.webp`);
        P.states(
          [
            { src: line(1), t: 0 },
            { src: line(2), t: 700 },
            { src: line(3), t: 1350 },
            { src: line(4), t: 2200 },
            { src: line(1), t: 8000 },
          ],
          { w: 540, parent: g1, fade: 120 },
        );

        // Every line opens up into numbers you can still change.
        const g2 = P.group([
          { t: 0, o: 0, ...cam(1180, 540, 1000) },
          { t: 3250 },
          { t: 3650, o: 1, ...cam(1100, 540, 980), e: "out" },
          { t: 6000, ...cam(1080, 540, 1000), e: "soft" },
          { t: 6350, o: 0 },
        ]);
        P.image(shot("amy", "01-today.webp"), { w: 540, parent: g2 });
        P.tap(at(300), at(471), 4350, { parent: g2, size: 100 });
        P.image(shot("amy", "03-line-detail.webp"), {
          w: 540,
         
          parent: g2,
          kfs: [{ t: 0, o: 0, y: 120 }, { t: 4450 }, { t: 4800, o: 1, y: 0, e: "out" }],
        });

        // And the streak keeps you coming back.
        const g3 = P.group([
          { t: 0, o: 0, ...cam(1180, 540, 1060) },
          { t: 6100 },
          { t: 6550, o: 1, ...cam(1100, 540, 1080), e: "out" },
          { t: 8600, ...cam(1080, 540, 1100), e: "soft" },
          { t: 8900, o: 0 },
        ]);
        P.image(shot("amy", "04-streaks.webp"), { w: 540, parent: g3 });

        const low = "bottom:56px;font-size:32px";
        P.caption("type what you ate", 250, 3200, low);
        P.caption("every number stays editable", 3700, 6100, low);
        P.caption("and keep the streak going", 6600, 8700, low);
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

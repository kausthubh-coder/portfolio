// A tiny timeline for the peek clips. Everything is a pure function of time, so
// render.mjs can seek to any millisecond and get the same frame every run.
(() => {
  const stage = document.getElementById("stage");
  const parts = [];

  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = {
    // Arrivals: fast, then a long settle.
    out: (t) => 1 - Math.pow(1 - t, 4),
    // Camera moves: slow in, slow out.
    inOut: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2),
    soft: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    in: (t) => t * t * t,
    linear: (t) => t,
  };
  const mix = (a, b, p) => a + (b - a) * p;

  // Keyframes are [{ t, ...props, e }]. Missing props carry over from the
  // previous keyframe; `e` names the easing used to arrive at that keyframe.
  const filled = (kfs) => {
    const out = [];
    let prev = { x: 0, y: 0, s: 1, o: 1, r: 0 };
    for (const kf of kfs) {
      prev = { ...prev, e: undefined, ...kf };
      out.push(prev);
    }
    return out;
  };
  const track = (kfs, t) => {
    if (t <= kfs[0].t) return kfs[0];
    const last = kfs[kfs.length - 1];
    if (t >= last.t) return last;
    const i = kfs.findIndex((kf) => kf.t > t);
    const a = kfs[i - 1];
    const b = kfs[i];
    const p = (ease[b.e] ?? ease.inOut)(clamp((t - a.t) / (b.t - a.t)));
    const out = { p };
    for (const key of Object.keys(b)) {
      if (key === "t" || key === "e") continue;
      out[key] = typeof b[key] === "number" ? mix(a[key] ?? b[key], b[key], p) : b[key];
    }
    return out;
  };

  const apply = (el, p) => {
    el.style.opacity = String(p.o);
    el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.s}) rotate(${p.r}deg)`;
    if (p.w !== undefined) el.style.width = `${p.w}px`;
    if (p.h !== undefined) el.style.height = `${p.h}px`;
  };

  const el = (tag, { style = "", html = "", cls = "layer", parent = stage } = {}) => {
    const node = document.createElement(tag);
    node.className = cls;
    node.style.cssText = style;
    node.innerHTML = html;
    parent.appendChild(node);
    return node;
  };

  const P = {
    ease,
    mix,
    clamp,
    el,
    size(w, h, bg) {
      stage.style.width = `${w}px`;
      stage.style.height = `${h}px`;
      stage.style.background = bg;
      P.w = w;
      P.h = h;
    },
    // Any element, moved by keyframes.
    anim(node, kfs) {
      const all = filled(kfs);
      parts.push((t) => apply(node, track(all, t)));
      return node;
    },
    // A camera: everything placed inside it moves, scales and fades together.
    group(kfs, { parent = stage, style = "" } = {}) {
      return P.anim(el("div", { parent, style }), kfs);
    },
    // A screenshot drawn `w` wide. Positions inside it are in its natural pixels;
    // multiply by w / natural to get stage pixels.
    image(src, { w, kfs = [{ t: 0 }], style = "", parent = stage }) {
      const node = el("img", { style: `width:${w}px;${style}`, parent });
      node.src = src;
      return P.anim(node, kfs);
    },
    // Real UI states captured at the same size, crossfaded one after another.
    // `steps` is [{ src, t }]; each state fades in over `fade` ms from its t.
    states(steps, { w, fade = 260, parent = stage, style = "" }) {
      const nodes = steps.map(({ src }) => {
        const node = el("img", { style: `width:${w}px;${style}`, parent });
        node.src = src;
        return node;
      });
      parts.push((t) => {
        nodes.forEach((node, i) => {
          const start = steps[i].t;
          const next = steps[i + 1]?.t ?? Infinity;
          // Each state stays fully under the next one while it fades in, so
          // there's no dip in brightness between states.
          let o = i === 0 ? 1 : ease.soft(clamp((t - start) / fade));
          if (t < start && i > 0) o = 0;
          if (t >= next + fade) o = 0;
          node.style.opacity = String(o);
        });
      });
      return nodes;
    },
    // Custom per-frame logic for anything keyframes can't express.
    fn(update) {
      parts.push(update);
    },
    // A text node that types itself out between `at` and `at + text.length * speed`.
    typed(node, text, at, speed) {
      parts.push((t) => {
        const n = Math.max(0, Math.min(text.length, Math.floor((t - at) / speed)));
        node.textContent = text.slice(0, n);
      });
      return node;
    },
    caption(text, at, until, extra = "") {
      const node = el("div", { cls: "caption", html: text, style: extra });
      parts.push((t) => {
        const inP = ease.out(clamp((t - at) / 420));
        const outP = ease.in(clamp((t - (until - 240)) / 240));
        node.style.opacity = String(inP * (1 - outP));
        node.style.transform = `translateX(-50%) translateY(${(1 - inP) * 18 - outP * 6}px)`;
        node.style.filter = `blur(${(1 - inP) * 6 + outP * 4}px)`;
      });
      return node;
    },
    // A finger tap on a phone: a soft dot that presses in and fades out.
    tap(x, y, at, { parent = stage, size = 56 } = {}) {
      const dot = el("div", {
        parent,
        style: `width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;border-radius:50%;background:rgba(255,255,255,.4);box-shadow:0 0 0 2px rgba(255,255,255,.7)`,
      });
      parts.push((t) => {
        const p = clamp((t - at + 120) / 560);
        const press = ease.out(clamp((t - at + 120) / 120));
        dot.style.opacity = String(t < at - 120 ? 0 : press * (1 - ease.in(p)));
        dot.style.transform = `translate(${x}px, ${y}px) scale(${0.7 + 0.25 * press + 0.5 * ease.out(p)})`;
      });
    },
    // A pointer that glides along keyframes on a slight arc and presses on each
    // click time. Put it inside a group to have it ride the camera.
    cursor(kfs, clicks = [], { parent = stage, size = 1 } = {}) {
      const ring = el("div", {
        parent,
        style: `width:${64 * size}px;height:${64 * size}px;margin:${-32 * size}px 0 0 ${-32 * size}px;border-radius:50%;background:rgba(255,255,255,.35);box-shadow:0 0 0 2px rgba(255,255,255,.9),0 0 0 3px rgba(0,0,0,.15)`,
      });
      const node = el("div", {
        parent,
        html: `<svg width="${34 * size}" height="${34 * size}" viewBox="0 0 24 24"><path d="M5 3.2v15.6c0 .5.6.8 1 .4l3.7-3.6 2.4 5.6c.2.4.6.6 1 .4l2-.9c.4-.2.6-.6.4-1l-2.4-5.5h5.2c.5 0 .8-.6.4-1L6 2.8c-.4-.3-1 0-1 .4z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
        style: `margin:${-3 * size}px 0 0 ${-5 * size}px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.3))`,
      });
      const all = filled(kfs);
      parts.push((t) => {
        const p = track(all, t);
        // Bow the path a little, the way a hand moves a mouse.
        const i = all.findIndex((kf) => kf.t > t);
        if (i > 0) {
          const a = all[i - 1];
          const b = all[i];
          const bow = Math.sin(Math.PI * p.p) * 0.12;
          p.x += -(b.y - a.y) * bow;
          p.y += (b.x - a.x) * bow;
        }
        const pressed = clicks.some((c) => t >= c && t < c + 160);
        apply(node, { ...p, s: pressed ? 0.85 : 1 });
        const last = clicks.filter((c) => t >= c).pop();
        const age = last === undefined ? 1 : clamp((t - last) / 520);
        ring.style.opacity = String(last === undefined ? 0 : (1 - age) * p.o);
        ring.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.2 + ease.out(age) * 0.9})`;
      });
    },
  };

  window.P = P;
  window.renderAt = (t) => parts.forEach((part) => part(t));
})();

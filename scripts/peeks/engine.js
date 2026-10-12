// A tiny timeline for the peek clips. Everything is a pure function of time, so
// render.mjs can seek to any millisecond and get the same frame every run.
(() => {
  const stage = document.getElementById("stage");
  const parts = [];

  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = {
    out: (t) => 1 - Math.pow(1 - t, 3),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    linear: (t) => t,
  };
  const mix = (a, b, p) => a + (b - a) * p;

  // Keyframes are [{ t, ...props, e }]. Missing props carry over from the
  // previous keyframe; `e` names the easing used to arrive at that keyframe.
  const filled = (kfs) => {
    const out = [];
    let prev = { x: 0, y: 0, s: 1, o: 1, r: 0 };
    for (const kf of kfs) {
      prev = { ...prev, ...kf };
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
    const out = {};
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
    // A screenshot drawn `w` wide. Positions inside it are in its natural pixels,
    // so P.at() turns them into stage pixels for cursors and overlays.
    image(src, { w, natural, kfs, style = "" }) {
      const node = el("img", { style: `width:${w}px;${style}` });
      node.src = src;
      node.dataset.f = String(w / natural);
      return P.anim(node, kfs);
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
        const inP = ease.out(clamp((t - at) / 260));
        const outP = clamp((t - (until - 200)) / 200);
        const o = inP * (1 - outP);
        node.style.opacity = String(o);
        node.style.transform = `translateX(-50%) translateY(${(1 - inP) * 14 + outP * 6}px) scale(${0.96 + 0.04 * inP})`;
      });
      return node;
    },
    // A pointer that moves along keyframes and presses on each click time.
    cursor(kfs, clicks = []) {
      const ring = el("div", {
        style: "width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:3px solid rgba(255,255,255,.95);box-shadow:0 0 0 2px rgba(0,0,0,.35)",
      });
      const node = el("div", {
        html: `<svg width="40" height="40" viewBox="0 0 24 24"><path d="M4 2.5l15.5 9.2-6.9 1.4 3.9 7.6-2.9 1.5-3.9-7.6-5 4.7z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
        style: "margin:-4px 0 0 -6px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.35))",
      });
      const all = filled(kfs);
      parts.push((t) => {
        const p = track(all, t);
        const pressed = clicks.some((c) => t >= c && t < c + 140);
        apply(node, { ...p, s: pressed ? 0.86 : 1 });
        const last = clicks.filter((c) => t >= c).pop();
        const age = last === undefined ? 1 : clamp((t - last) / 420);
        ring.style.opacity = String(last === undefined ? 0 : (1 - age) * 0.9);
        ring.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.3 + ease.out(age) * 0.9})`;
      });
    },
  };

  window.P = P;
  window.renderAt = (t) => parts.forEach((part) => part(t));
})();

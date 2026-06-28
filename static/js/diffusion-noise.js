/*
  Visuals for "KV Caching for dLLMs is Noise Process Agnostic".

  One ES module, auto-loaded by the post's `hero` frontmatter. It drives the
  hero canvas ([data-hero-canvas]) and every inline animation ([data-anim]).

  Shared visual grammar across all of them:
    warm (amber -> red) = a position being (re)computed / high KV drift
    cool (steel blue)   = a position that is cached / stable
  So the same color story reads consistently from the AR cache animation all the
  way to the block-wise drift map.
*/

// ---- shared helpers ---------------------------------------------------------

function colors() {
  const s = getComputedStyle(document.documentElement);
  const v = (n, f) => s.getPropertyValue(n).trim() || f;
  return {
    bg: v("--body-background", "#ffffff"),
    fg: v("--body-font-color", "#2c2724"),
    mute: v("--gray-500", "#b0aba5"),
    line: v("--gray-200", "#ece9e4"),
  };
}

const COOL = [91, 138, 166]; // cached / stable
const MID = [224, 168, 63]; // moderate change
const HOT = [216, 101, 75]; // actively recomputed / high drift

function heat(t) {
  t = Math.max(0, Math.min(1, t));
  const [a, b, u] = t < 0.5 ? [COOL, MID, t / 0.5] : [MID, HOT, (t - 0.5) / 0.5];
  const c = (i) => Math.round(a[i] + (b[i] - a[i]) * u);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
}

function hexToRgb(h) {
  const m = h.replace("#", "").trim();
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) || 0);
}
function mix(a, b, t) {
  t = Math.max(0, Math.min(1, t));
  const c = (i) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, Math.max(0, w), Math.max(0, h), r);
}

// deterministic per-step jitter so flicker is stable within a frame
function hash(n) {
  const x = Math.sin(n * 127.1 + 11.7) * 43758.5453;
  return x - Math.floor(x);
}

const SANS =
  "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const MONO = "14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

// generic canvas runner: heightFor(W) sets the wrapped height, render draws a frame
function run(canvas, heightFor, render) {
  const ctx = canvas.getContext("2d");
  let W = 0,
    H = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, canvas.clientWidth || canvas.getBoundingClientRect().width || 600);
    H = heightFor(W);
    canvas.style.height = H + "px";
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();
  requestAnimationFrame(function frame(now) {
    ctx.clearRect(0, 0, W, H);
    render(ctx, W, H, now);
    requestAnimationFrame(frame);
  });
}

function legend(ctx, items, cx, y, C) {
  ctx.font = SANS;
  ctx.textBaseline = "middle";
  const sw = 11,
    g = 6,
    pad = 16;
  const ws = items.map((it) => sw + g + ctx.measureText(it.label).width);
  const total = ws.reduce((a, b) => a + b, 0) + pad * (items.length - 1);
  let x = cx - total / 2;
  items.forEach((it, i) => {
    if (it.outline) {
      ctx.strokeStyle = C.mute;
      ctx.lineWidth = 1.5;
      rrect(ctx, x, y - sw / 2, sw, sw, 3);
      ctx.stroke();
    } else {
      ctx.fillStyle = it.c;
      rrect(ctx, x, y - sw / 2, sw, sw, 3);
      ctx.fill();
    }
    ctx.fillStyle = C.mute;
    ctx.textAlign = "left";
    ctx.fillText(it.label, x + sw + g, y + 1);
    x += ws[i] + pad;
  });
}

function squareSize(W, N, max) {
  return Math.max(12, Math.min(max, (W - 36) / N - 9));
}

// ---- 1. AR generation with KV caching --------------------------------------
// Row of squares generated left->right. Each is computed once (warm pulse) then
// cached forever (cool). The active square reads all cached squares (arcs).

function arCache(canvas) {
  const N = 9,
    STEP = 780,
    HOLD = 4;
  const sq = (W) => squareSize(W, N, 42);
  const DIP = 38,
    TOP = 16,
    CAP = 30;
  run(
    canvas,
    (W) => TOP + sq(W) + DIP + CAP,
    (ctx, W, H, now) => {
      const C = colors();
      const s = sq(W);
      const gap = s * 0.34;
      const rowW = N * s + (N - 1) * gap;
      const x0 = (W - rowW) / 2;
      const y = TOP;
      const cy = y + s / 2;
      const cx = (i) => x0 + i * (s + gap) + s / 2;

      const cycle = N + HOLD;
      const step = Math.floor(now / STEP) % cycle;
      const ph = (now % STEP) / STEP;
      const active = step < N ? step : -1;

      // causal attention: active square reads every cached square below the row
      if (active > 0) {
        ctx.strokeStyle = heat(0.55);
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1.4;
        for (let j = 0; j < active; j++) {
          ctx.beginPath();
          ctx.moveTo(cx(j), cy + s / 2);
          ctx.quadraticCurveTo(
            (cx(active) + cx(j)) / 2,
            cy + s / 2 + DIP,
            cx(active),
            cy + s / 2,
          );
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      for (let i = 0; i < N; i++) {
        const x = x0 + i * (s + gap);
        if (i > active && active >= 0) {
          // future: empty outline
          ctx.strokeStyle = C.line;
          ctx.lineWidth = 1.5;
          rrect(ctx, x, y, s, s, 6);
          ctx.stroke();
        } else if (i === active) {
          const pop = 1 + 0.06 * Math.sin(ph * Math.PI);
          const d = (s * (pop - 1)) / 2;
          ctx.globalAlpha = Math.min(1, ph * 3);
          ctx.fillStyle = heat(0.82);
          rrect(ctx, x - d, y - d, s * pop, s * pop, 6);
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = heat(0.05);
          rrect(ctx, x, y, s, s, 6);
          ctx.fill();
        }
      }

      legend(
        ctx,
        [
          { c: heat(0.82), label: "computed this step" },
          { c: heat(0.05), label: "cached (reused)" },
        ],
        W / 2,
        TOP + s + DIP + CAP / 2,
        C,
      );
    },
  );
}

// ---- 2. Diffusion generation: every position drifts every step --------------

function diffusionDrift(canvas) {
  const N = 16,
    STEP = 480,
    STEPS = 14,
    HOLD = 3;
  const sq = (W) => squareSize(W, N, 34);
  const TOP = 16,
    CAP = 32;
  const drift = new Array(N).fill(0.85);
  const target = new Array(N).fill(0.85);
  let lastStep = -1,
    lastNow = performance.now();
  run(
    canvas,
    (W) => TOP + sq(W) + CAP,
    (ctx, W, H, now) => {
      const C = colors();
      const s = sq(W);
      const gap = s * 0.34;
      const rowW = N * s + (N - 1) * gap;
      const x0 = (W - rowW) / 2;
      const y = TOP;

      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      const cycle = STEPS + HOLD;
      const step = Math.floor(now / STEP) % cycle;
      if (step !== lastStep) {
        lastStep = step;
        // drift accumulates across positions as more steps change tokens
        const prog = Math.min(1, step / STEPS);
        const base = 0.06 + 0.82 * Math.pow(prog, 1.4);
        for (let i = 0; i < N; i++)
          target[i] = Math.min(1, base * (0.5 + hash(i * 9 + step * 5)) + 0.04);
      }
      for (let i = 0; i < N; i++)
        drift[i] += (target[i] - drift[i]) * Math.min(1, dt * 9);

      for (let i = 0; i < N; i++) {
        ctx.fillStyle = heat(drift[i]);
        rrect(ctx, x0 + i * (s + gap), y, s, s, 6);
        ctx.fill();
      }

      legend(
        ctx,
        [
          { c: heat(0.05), label: "low drift" },
          { c: heat(0.5), label: "" },
          { c: heat(0.95), label: "high drift" },
        ],
        W / 2,
        TOP + s + CAP / 2,
        C,
      );
    },
  );
}

// ---- 3. Local drift: one token changes, drift stays concentrated ------------
// A single sequence. Periodically one position changes; drift spikes there and
// decays sharply with distance in both directions. Far positions barely move.

function driftLocal(canvas) {
  const N = 21,
    STEP = 1600;
  const EPI = [10, 5, 15, 8, 13, 3, 17]; // changing position cycles around
  const sq = (W) => squareSize(W, N, 28);
  const TOP = 14,
    MARK = 12,
    CAP = 30;
  const drift = new Array(N).fill(0.03);
  let lastNow = performance.now();
  run(
    canvas,
    (W) => TOP + MARK + sq(W) + CAP,
    (ctx, W, H, now) => {
      const C = colors();
      const s = sq(W);
      const gap = s * 0.34;
      const rowW = N * s + (N - 1) * gap;
      const x0 = (W - rowW) / 2;
      const y = TOP + MARK;
      const xc = (i) => x0 + i * (s + gap) + s / 2;

      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      const step = Math.floor(now / STEP);
      const epi = EPI[step % EPI.length];

      // drift is a sharp local bump (gaussian falloff) centered on the changing
      // position; it holds there through the step, then jumps to the next one
      const sigma = 1.25;
      for (let i = 0; i < N; i++) {
        const d = i - epi;
        const target = 0.03 + 0.97 * Math.exp(-(d * d) / (2 * sigma * sigma));
        drift[i] += (target - drift[i]) * Math.min(1, dt * 6);
      }

      for (let i = 0; i < N; i++) {
        ctx.fillStyle = heat(drift[i]);
        rrect(ctx, x0 + i * (s + gap), y, s, s, 5);
        ctx.fill();
      }

      // marker on the position that just changed (caret + ring), held then faded
      const tIn = (now % STEP) / STEP;
      const mA = Math.min(1, (1 - tIn) * 5);
      if (mA > 0) {
        const mx = xc(epi);
        ctx.globalAlpha = mA;
        ctx.fillStyle = heat(0.92);
        ctx.beginPath();
        ctx.moveTo(mx, y - 3);
        ctx.lineTo(mx - 5, y - 11);
        ctx.lineTo(mx + 5, y - 11);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = heat(0.95);
        ctx.lineWidth = 2;
        rrect(ctx, x0 + epi * (s + gap) - 1.5, y - 1.5, s + 3, s + 3, 6);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      legend(
        ctx,
        [
          { c: heat(0.05), label: "low drift" },
          { c: heat(0.5), label: "" },
          { c: heat(0.95), label: "high drift" },
        ],
        W / 2,
        y + s + CAP / 2,
        C,
      );
    },
  );
}

// ---- masked / uniform tile state machines -----------------------------------

const TARGET = ["the", "sky", "was", "a", "pale", "gold", "then", "grey"];
const POOL = [
  "ship", "cold", "iron", "dawn", "blue", "fast", "near", "red",
  "tree", "sea", "calm", "dark", "soft", "rain", "glass", "lone",
];
const REVEAL_ORDER = [2, 5, 0, 7, 3, 1, 6, 4];
const WRONG = TARGET.map((w, i) => POOL[(i * 5 + 3) % POOL.length]);
const TILE_STEP = 760;

const masked = {
  N: TARGET.length,
  // returns {text, decoded, flash} per tile for the current clock
  at(now) {
    const per = 2;
    const reveal = Math.ceil(this.N / per); // steps to reveal all
    const cycle = reveal + 4; // + hold
    const step = Math.floor(now / TILE_STEP) % cycle;
    const tIn = (now % TILE_STEP) / TILE_STEP;
    const shown = Math.min(this.N, step * per);
    const justAt = (step - 1) * per; // tiles revealed at the start of this step
    return REVEAL_ORDER.map((tile, rank) => {
      const decoded = rank < shown;
      const flash = decoded && rank >= justAt && step <= reveal ? 1 - tIn : 0;
      return {
        i: tile,
        text: decoded ? TARGET[tile] : "[ ? ]",
        decoded,
        flash,
        warm: false,
      };
    }).sort((a, b) => a.i - b.i);
  },
};

const uniform = {
  N: TARGET.length,
  at(now) {
    const cycle = this.N + 4;
    const step = Math.floor(now / TILE_STEP) % cycle;
    const tIn = (now % TILE_STEP) / TILE_STEP;
    const reviseRank = 1; // a tile that settled early...
    const reviseStep = this.N - 1; // ...changes again late (self-correction)
    return REVEAL_ORDER.map((tile, rank) => {
      const resolved = rank < step;
      let text = resolved ? TARGET[tile] : WRONG[tile];
      let warm = false;
      let flash = 0;
      if (resolved && rank === reviseRank && step === reviseStep) {
        text = POOL[(tile * 7 + 2) % POOL.length]; // revised to a different word
        flash = 1 - tIn * 0.5; // same flash as any other change — it's just a word swap
      } else if (rank === step - 1 && step <= this.N) {
        flash = 1 - tIn; // flash when a tile changes
      }
      return { i: tile, text, decoded: resolved, flash, warm };
    }).sort((a, b) => a.i - b.i);
  },
};

function tileMetrics(ctx) {
  ctx.font = MONO;
  let wmax = ctx.measureText("[ ? ]").width;
  for (const w of TARGET.concat(POOL)) wmax = Math.max(wmax, ctx.measureText(w).width);
  return { tw: Math.ceil(wmax) + 26, th: 30, gap: 8 };
}

function tileLayout(ctx, w, N) {
  const m = tileMetrics(ctx);
  const cols = Math.max(1, Math.min(N, Math.floor((w + m.gap) / (m.tw + m.gap))));
  const rows = Math.ceil(N / cols);
  return { ...m, cols, rows, blockH: rows * (m.th + m.gap) - m.gap };
}

// flat = uniform style: every tile reads the same (cool, no grey), so nothing
// in the visuals reveals which positions are "done"
function drawTiles(ctx, x, y, w, tiles, now, C, flat) {
  const L = tileLayout(ctx, w, tiles.length);
  const rowW = (n) => n * L.tw + (n - 1) * L.gap;
  ctx.font = MONO;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  tiles.forEach((t, k) => {
    const r = Math.floor(k / L.cols);
    const inRow = Math.min(L.cols, tiles.length - r * L.cols);
    const cx0 = x + (w - rowW(inRow)) / 2;
    const tx = cx0 + (k - r * L.cols) * (L.tw + L.gap);
    const ty = y + r * (L.th + L.gap);

    if (flat || t.decoded) {
      ctx.fillStyle = heat(0.05);
      ctx.globalAlpha = flat ? 0.22 : 0.18;
      rrect(ctx, tx, ty, L.tw, L.th, 7);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = C.line;
      ctx.globalAlpha = 0.5;
      rrect(ctx, tx, ty, L.tw, L.th, 7);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (t.flash > 0) {
      ctx.strokeStyle = t.warm ? heat(0.85) : heat(0.2);
      ctx.globalAlpha = t.flash;
      ctx.lineWidth = 2;
      rrect(ctx, tx + 1, ty + 1, L.tw - 2, L.th - 2, 6);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = !flat && !t.decoded && t.text === "[ ? ]" ? C.mute : C.fg;
    if (t.warm) ctx.fillStyle = heat(0.85);
    ctx.fillText(t.text, tx + L.tw / 2, ty + L.th / 2 + 1);
  });
  return L.blockH;
}

function maskedAnim(canvas) {
  const TOP = 12,
    CAP = 28;
  run(
    canvas,
    (W) => {
      const ctx = canvas.getContext("2d");
      return TOP + tileLayout(ctx, W, masked.N).blockH + CAP;
    },
    (ctx, W, H, now) => {
      const C = colors();
      drawTiles(ctx, 0, TOP, W, masked.at(now), now, C);
      legend(
        ctx,
        [
          { outline: true, label: "[ ? ]  masked" },
          { c: heat(0.05), label: "decoded · fixed" },
        ],
        W / 2,
        H - CAP / 2,
        C,
      );
    },
  );
}

function uniformAnim(canvas) {
  const TOP = 12,
    CAP = 28;
  run(
    canvas,
    (W) => {
      const ctx = canvas.getContext("2d");
      return TOP + tileLayout(ctx, W, uniform.N).blockH + CAP;
    },
    (ctx, W, H, now) => {
      const C = colors();
      drawTiles(ctx, 0, TOP, W, uniform.at(now), now, C, true);
      legend(
        ctx,
        [{ c: heat(0.85), label: "every tile is a real word · any can change" }],
        W / 2,
        H - CAP / 2,
        C,
      );
    },
  );
}

// ---- 5. Block-wise decoding (also the "drift is local" map) -----------------

function blockwise(canvas) {
  const P = 3,
    R = 18,
    B = 6,
    N = P + R;
  const nBlocks = R / B;
  const T = 6,
    STEP = 300,
    HOLD = 4;
  const sq = (W) => squareSize(W, N + 1, 26); // +1 for the prompt gap
  const TOP = 14,
    WIN = 8,
    CAP = 30;
  run(
    canvas,
    (W) => TOP + sq(W) + WIN + CAP,
    (ctx, W, H, now) => {
      const C = colors();
      const s = sq(W);
      const gap = s * 0.34;
      const promptGap = s * 0.7;
      const rowW = N * s + (N - 1) * gap + promptGap;
      const x0 = (W - rowW) / 2;
      const y = TOP + WIN;
      const xOf = (idx) =>
        x0 + idx * (s + gap) + (idx >= P ? promptGap : 0);

      const cycle = nBlocks * T + HOLD;
      const step = Math.floor(now / cycle) >= 0 ? Math.floor(now / STEP) % cycle : 0;
      const curBlock = Math.min(nBlocks, Math.floor(step / T));
      const within = step % T;
      const justCommitted = within === 0 && curBlock > 0 && curBlock <= nBlocks;

      // prompt squares
      for (let i = 0; i < P; i++) {
        ctx.fillStyle = C.mute;
        ctx.globalAlpha = 0.55;
        rrect(ctx, xOf(i), y, s, s, 5);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // response squares
      for (let r = 0; r < R; r++) {
        const blk = Math.floor(r / B);
        let d;
        if (blk < curBlock) d = 0.06; // completed -> cached
        else if (blk > curBlock) d = 0.05; // future -> cached
        else d = (0.55 + 0.4 * hash(r * 13 + step * 7)) * (1 - (within / T) * 0.5);
        ctx.fillStyle = heat(d);
        rrect(ctx, xOf(P + r), y, s, s, 5);
        ctx.fill();
      }
      // active block window outline
      if (curBlock < nBlocks) {
        const a = xOf(P + curBlock * B);
        const bEnd = xOf(P + curBlock * B + B - 1) + s;
        ctx.strokeStyle = heat(0.85);
        ctx.globalAlpha = justCommitted ? 1 : 0.85;
        ctx.lineWidth = 2;
        rrect(ctx, a - 4, y - 4, bEnd - a + 8, s + 8, 8);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      legend(
        ctx,
        [
          { c: C.mute, label: "prompt" },
          { c: heat(0.05), label: "cached" },
          { c: heat(0.85), label: "active block" },
        ],
        W / 2,
        y + s + CAP / 2,
        C,
      );
    },
  );
}

// ---- hero: masked | uniform side by side ------------------------------------

function hero(canvas) {
  const PAD = 18,
    LABEL = 24,
    CAP = 26,
    TOP = 10;
  const stackAt = 560;
  run(
    canvas,
    (W) => {
      const ctx = canvas.getContext("2d");
      const narrow = W < stackAt;
      const pw = narrow ? W - PAD * 2 : (W - PAD * 3) / 2;
      const bh = tileLayout(ctx, pw, TARGET.length).blockH;
      const panel = LABEL + bh + CAP;
      return TOP + (narrow ? panel * 2 + PAD : panel) + PAD;
    },
    (ctx, W, H, now) => {
      const C = colors();
      const narrow = W < stackAt;
      const pw = narrow ? W - PAD * 2 : (W - PAD * 3) / 2;
      const bh = tileLayout(ctx, pw, TARGET.length).blockH;

      const panel = (x, y, title, anim, flat) => {
        ctx.font = "600 13px ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = C.fg;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(title, x + pw / 2, y + LABEL / 2);
        drawTiles(ctx, x, y + LABEL, pw, anim.at(now), now, C, flat);
      };

      if (narrow) {
        const ph = LABEL + bh + CAP;
        panel(PAD, TOP, "Masked diffusion", masked, false);
        panel(PAD, TOP + ph + PAD, "Uniform diffusion", uniform, true);
      } else {
        panel(PAD, TOP, "Masked diffusion", masked, false);
        panel(PAD * 2 + pw, TOP, "Uniform diffusion", uniform, true);
        // divider
        ctx.strokeStyle = C.line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2, TOP + 4);
        ctx.lineTo(W / 2, H - PAD);
        ctx.stroke();
      }
    },
  );
}

// ---- confidence fills in left to right --------------------------------------
// Confidence is highest next to already-resolved context, and the prompt anchors
// the left, so confidence-based decoding fills in roughly left to right on its
// own. Grey = unresolved, blue = confident/decoded. Discrete: one more token
// turns blue each step, left to right.

function confidenceLtr(canvas) {
  const N = 20,
    STEP = 240,
    HOLD = 10;
  const sq = (W) => squareSize(W, N, 30);
  const TOP = 14,
    CAP = 30;
  const conf = new Array(N).fill(0);
  let lastNow = performance.now();
  run(
    canvas,
    (W) => TOP + sq(W) + CAP,
    (ctx, W, H, now) => {
      const C = colors();
      const grey = hexToRgb(C.mute);
      const s = sq(W);
      const gap = s * 0.34;
      const rowW = N * s + (N - 1) * gap;
      const x0 = (W - rowW) / 2;
      const y = TOP;

      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      const step = Math.floor(now / STEP) % (N + HOLD);
      const filled = Math.min(N, step); // tokens turned blue so far
      // each square is discretely resolved or not; the flip eases in per token
      for (let i = 0; i < N; i++)
        conf[i] += ((i < filled ? 1 : 0) - conf[i]) * Math.min(1, dt * 12);

      for (let i = 0; i < N; i++) {
        ctx.fillStyle = mix(grey, COOL, conf[i]);
        rrect(ctx, x0 + i * (s + gap), y, s, s, 6);
        ctx.fill();
      }

      legend(
        ctx,
        [
          { c: mix(grey, COOL, 0), label: "unresolved" },
          { c: mix(grey, COOL, 1), label: "confident → decoded" },
        ],
        W / 2,
        y + s + CAP / 2,
        C,
      );
    },
  );
}

// ---- dispatch ---------------------------------------------------------------

const ANIMS = {
  "ar-cache": arCache,
  "diffusion-drift": diffusionDrift,
  "drift-local": driftLocal,
  "confidence-ltr": confidenceLtr,
  masked: maskedAnim,
  uniform: uniformAnim,
  blockwise: blockwise,
};

for (const c of document.querySelectorAll("[data-hero-canvas]")) hero(c);
for (const c of document.querySelectorAll("[data-anim]")) {
  const fn = ANIMS[c.getAttribute("data-anim")];
  if (fn) fn(c);
}

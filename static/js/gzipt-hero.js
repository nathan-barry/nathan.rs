/*
  gzipt hero — a replay of a real gzipt run.

  Generating gzipt faithfully (beam search scoring every candidate with real gzip
  over a 30 KB window) is far too heavy to run live in a browser — and at small
  scale it collapses into whitespace or verbatim loops, exactly like the real tool.
  So rather than fake it live, this animates an *actual* run: gzipt.py was executed
  offline against tinyshakespeare (window 30000, horizon 24, beam_width 32,
  temperature 0.5, seed 3 — the very run quoted at the top of the post), and each
  step's finalists, their real gzip byte-lengths, and the committed span were
  recorded into the TRACE below. Nothing here is invented; the bars are genuine
  compressed-byte counts.

  What the bars show is the honest punchline: the beam's finalists differ by only
  0–1 byte (Δ vs best), because at whole-byte resolution gzip can barely tell them
  apart. Unlike a normal LM's softmax, the candidates literally tie — so the
  committed span (✓) is essentially a random draw from the near-equal finalists,
  not a confident winner. That flat, tie-prone score is the whole reason gzipt
  needs a wide beam and a span-deep horizon to say anything at all.
*/

const TRACE = {
  prompt: "MENENIUS:\n",
  window: 30000,
  horizon: 24,
  beam_width: 32,
  temperature: 0.5,
  tail: 80,
  steps: [
    {
      commit: "'Though all at once canq",
      pick: 1,
      bars: [
        { t: "'Though all at once cann", len: 13024 },
        { t: "'Though all at once canq", len: 13024 },
        { t: "'Though all at once can\n", len: 13025 },
        { t: "'Though all at once can ", len: 13025 },
        { t: "'Though all at once can!", len: 13025 },
        { t: "'Though all at once can'", len: 13025 },
      ],
    },
    {
      commit: "\n\nMARCIUS:\nPray now, noc",
      pick: 5,
      bars: [
        { t: "\n\nMARCIUS:\nPray now, no ", len: 13027 },
        { t: "\n\nMARCIUS:\nPray now, no\n", len: 13028 },
        { t: "\n\nMARCIUS:\nPray now, no!", len: 13028 },
        { t: "\n\nMARCIUS:\nPray now, no'", len: 13028 },
        { t: "\n\nMARCIUS:\nPray now, no,", len: 13028 },
        { t: "\n\nMARCIUS:\nPray now, noc", len: 13028 },
      ],
    },
    {
      commit: "amest thou to a morsel .",
      pick: 5,
      bars: [
        { t: "amest thou to a morsel o", len: 13030 },
        { t: "amest thou to a morsel \n", len: 13031 },
        { t: "amest thou to a morsel  ", len: 13031 },
        { t: "amest thou to a morsel !", len: 13031 },
        { t: "amest thou to a morsel '", len: 13031 },
        { t: "amest thou to a morsel .", len: 13031 },
      ],
    },
    {
      commit: "\n\nLARTIUS:\nHence, and\nI'",
      pick: 5,
      bars: [
        { t: "\n\nLARTIUS:\nHence, and\n\nA", len: 13035 },
        { t: "\n\nLARTIUS:\nHence, and\n\nC", len: 13035 },
        { t: "\n\nLARTIUS:\nHence, and\n\nL", len: 13035 },
        { t: "\n\nLARTIUS:\nHence, and\n\nM", len: 13035 },
        { t: "\n\nLARTIUS:\nHence, and\n'T", len: 13035 },
        { t: "\n\nLARTIUS:\nHence, and\nI'", len: 13035 },
      ],
    },
    {
      commit: " the end admire, where G",
      pick: 5,
      bars: [
        { t: " the end admire, where l", len: 13036 },
        { t: " the end admire, where \n", len: 13037 },
        { t: " the end admire, where  ", len: 13037 },
        { t: " the end admire, where !", len: 13037 },
        { t: " the end admire, where '", len: 13037 },
        { t: " the end admire, where G", len: 13037 },
      ],
    },
    {
      commit: "\nagain; and after it ag ",
      pick: 1,
      bars: [
        { t: "\nagain; and after it ag\n", len: 13037 },
        { t: "\nagain; and after it ag ", len: 13037 },
        { t: "\nagain; and after it ag'", len: 13037 },
        { t: "\nagain; and after it ag,", len: 13037 },
        { t: "\nagain; and after it ag;", len: 13037 },
        { t: "\nagain; and after it agI", len: 13037 },
      ],
    },
    {
      commit: ".\n\nLARTIUS:\nHence, and\nI",
      pick: 0,
      bars: [
        { t: ".\n\nLARTIUS:\nHence, and\nI", len: 13036 },
        { t: ".\n\nLARTIUS:\nHence, and\n\n", len: 13037 },
        { t: ".\n\nLARTIUS:\nHence, and\n ", len: 13037 },
        { t: ".\n\nLARTIUS:\nHence, and\n!", len: 13037 },
        { t: ".\n\nLARTIUS:\nHence, and\n'", len: 13037 },
        { t: ".\n\nLARTIUS:\nHence, and\n,", len: 13037 },
      ],
    },
    {
      commit: "' the end ad\n\nLARTIUS:\nf",
      pick: 5,
      bars: [
        { t: "' the end ad\n\nLARTIUS:\nH", len: 13039 },
        { t: "' the end ad\n\nLARTIUS:\n\n", len: 13040 },
        { t: "' the end ad\n\nLARTIUS:\n ", len: 13040 },
        { t: "' the end ad\n\nLARTIUS:\n!", len: 13040 },
        { t: "' the end ad\n\nLARTIUS:\n'", len: 13040 },
        { t: "' the end ad\n\nLARTIUS:\nf", len: 13040 },
      ],
    },
    {
      commit: "ame and envy. Fix thy f!",
      pick: 3,
      bars: [
        { t: "ame and envy. Fix thy fo", len: 13039 },
        { t: "ame and envy. Fix thy f\n", len: 13040 },
        { t: "ame and envy. Fix thy f ", len: 13040 },
        { t: "ame and envy. Fix thy f!", len: 13040 },
        { t: "ame and envy. Fix thy f'", len: 13040 },
        { t: "ame and envy. Fix thy f,", len: 13040 },
      ],
    },
  ],
};

for (const canvas of document.querySelectorAll("[data-hero-canvas]")) {
  main(canvas);
}

function main(canvas) {
  const ctx = canvas.getContext("2d");

  const REVEAL = 26; // committed bytes revealed per second (typewriter)
  const DWELL = 900; // ms to linger on a finished step
  const HOLD = 1500; // ms to hold the full run before looping

  // Fixed layout metrics. The canvas height is derived from these so it wraps the
  // content exactly — no fixed aspect-ratio leaving dead space at the bottom.
  const PAD = 22; // outer padding
  const GAP = 26; // gap between the two columns
  const HEAD = 26; // height reserved for a panel's header label
  const SUB = 16; // extra header line on the finalists panel
  const LINE = 18; // output text line height
  const ROW = 32; // finalists row height
  const NBARS = TRACE.steps[0].bars.length; // 6
  const STACK_W = 640; // below this width the two panels stack vertically
  const STACKGAP = 20; // vertical gap between stacked panels
  const OUT_LINES = 9; // output lines (side-by-side reference)
  const MOBILE_BARS = 3; // finalists shown when stacked (the pick is always kept)
  const OUT_LINES_M = 6; // output lines when stacked

  // ---- palette pulled live from the site's CSS variables --------------------
  let C = readColors();
  function readColors() {
    const s = getComputedStyle(document.documentElement);
    const v = (n, f) => s.getPropertyValue(n).trim() || f;
    return {
      fg: v("--body-font-color", "#2c2724"),
      mute: v("--gray-500", "#b0aba5"),
      line: v("--gray-200", "#ece9e4"),
      accent: "#64748b",
    };
  }
  new MutationObserver(() => (C = readColors())).observe(
    document.documentElement,
    { attributes: true, attributeFilter: ["class"] },
  );

  // ---- replay state ---------------------------------------------------------
  const state = {
    step: -1,
    generated: TRACE.prompt, // committed text so far (typewriter target)
    shown: TRACE.prompt.length,
    bars: [], // {tail, delta, wTarget, w, pick}
    alpha: 1,
    fading: 0, // -1 out, +1 in
  };

  function loadStep(i) {
    const st = TRACE.steps[i];
    const lens = st.bars.map((b) => b.len);
    const min = Math.min(...lens);
    const max = Math.max(...lens);
    state.bars = st.bars.map((b, k) => ({
      tail: b.t,
      delta: b.len - min, // honest Δ bytes vs the best finalist
      wTarget: 1 - 0.8 * (max > min ? (b.len - min) / (max - min) : 0),
      w: 0,
      pick: k === st.pick,
    }));
    state.generated += st.commit; // typewriter reveals it
  }

  async function loop() {
    await sleep(500);
    for (;;) {
      state.step++;
      loadStep(state.step);
      await until(() => state.shown >= state.generated.length);
      await sleep(DWELL);
      if (state.step >= TRACE.steps.length - 1) {
        await sleep(HOLD);
        state.fading = -1;
        await until(() => state.alpha <= 0.02);
        state.step = -1;
        state.generated = TRACE.prompt;
        state.shown = TRACE.prompt.length;
        state.bars = [];
        state.fading = 1;
      }
    }
  }

  // ---- rendering ------------------------------------------------------------
  const MONO = "13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  const SANS =
    "11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

  let W = 0,
    H = 0,
    last = performance.now();

  // Layout for the current width: narrow screens stack the panels and show fewer
  // finalists / output lines. The canvas height wraps the content (no fixed
  // aspect-ratio), so it's the max of the two side by side or their sum stacked.
  function layout() {
    const narrow = W < STACK_W;
    const nbars = narrow ? MOBILE_BARS : NBARS;
    const outLines = narrow ? OUT_LINES_M : OUT_LINES;
    return {
      narrow,
      nbars,
      barsBlock: HEAD + SUB + nbars * ROW,
      outBlock: HEAD + outLines * LINE,
    };
  }
  function contentHeight() {
    const L = layout();
    return L.narrow
      ? L.outBlock + STACKGAP + L.barsBlock
      : Math.max(L.barsBlock, L.outBlock);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth || canvas.getBoundingClientRect().width;
    H = PAD * 2 + contentHeight();
    canvas.style.height = H + "px";
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function draw(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (state.fading < 0) state.alpha = Math.max(0, state.alpha - dt * 3);
    else if (state.fading > 0) {
      state.alpha = Math.min(1, state.alpha + dt * 3);
      if (state.alpha >= 1) state.fading = 0;
    }
    for (const b of state.bars) b.w += (b.wTarget - b.w) * Math.min(1, dt * 9);
    if (state.shown < state.generated.length)
      state.shown = Math.min(state.generated.length, state.shown + dt * REVEAL);

    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = state.alpha;
    const L = layout();
    if (L.narrow) {
      // stacked: output on top, finalists below (both full width)
      const w = W - PAD * 2;
      drawOutput(PAD, PAD, w, L.outBlock);
      drawBars(PAD, PAD + L.outBlock + STACKGAP, w, L.barsBlock, L.nbars);
    } else {
      // side by side
      const leftW = Math.round(W * 0.52) - PAD - GAP / 2;
      const rightX = PAD + leftW + GAP;
      const rightW = W - rightX - PAD;
      const colH = H - PAD * 2;
      drawOutput(PAD, PAD, leftW, colH);
      drawBars(rightX, PAD, rightW, colH, L.nbars);
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }

  function label(text, x, y, color) {
    ctx.font = SANS;
    ctx.fillStyle = color || C.mute;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, x, y);
  }

  function drawOutput(x, y, w, h) {
    label("OUTPUT", x, y + 4);
    ctx.font = MONO;
    ctx.textBaseline = "top";
    const charW = ctx.measureText("M").width;
    const cols = Math.max(8, Math.floor(w / charW));
    const areaTop = y + HEAD;
    const areaH = h - HEAD;
    const maxLines = Math.max(1, Math.floor(areaH / LINE));

    const text = state.generated.slice(0, Math.floor(state.shown));
    const lines = [];
    for (const para of text.split("\n")) {
      if (para === "") {
        lines.push("");
        continue;
      }
      for (let i = 0; i < para.length; i += cols)
        lines.push(para.slice(i, i + cols));
    }
    const visible = lines.slice(Math.max(0, lines.length - maxLines));

    // bottom-anchor so the column always fills downward (no dead space below)
    let oy = areaTop + Math.max(0, areaH - visible.length * LINE);
    ctx.fillStyle = C.fg;
    let cx = x,
      cy = oy;
    for (let i = 0; i < visible.length; i++) {
      ctx.fillText(visible[i], x, oy);
      if (i === visible.length - 1) {
        cx = x + ctx.measureText(visible[i]).width;
        cy = oy;
      }
      oy += LINE;
    }
    if (Math.floor(performance.now() / 530) % 2 === 0) {
      ctx.fillStyle = C.accent;
      ctx.fillRect(cx + 1, cy, charW * 0.62, 15);
    }
  }

  function drawBars(x, y, w, h, nbars) {
    // show `nbars` finalists, always including the committed (picked) one
    let rows = state.bars;
    if (rows.length > nbars) {
      const pi = rows.findIndex((b) => b.pick);
      rows = rows.slice(0, nbars);
      if (pi >= nbars) rows[nbars - 1] = state.bars[pi];
    }

    label("FINALISTS", x, y + 4);
    ctx.font = SANS;
    ctx.fillStyle = C.mute;
    ctx.textAlign = "right";
    ctx.fillText("beam of 32 → top " + rows.length, x + w, y + 4);
    ctx.textAlign = "left";
    label("Δ vs best · ✓ sampled from the near-ties", x, y + 20, C.mute);

    const gutter = 13; // keeps span text aligned whether or not a ✓ is drawn
    const top = y + HEAD + SUB;
    for (let i = 0; i < rows.length; i++) {
      const b = rows[i];
      const ry = top + i * ROW;
      const barY = ry + ROW - 14;
      const barH = 6;
      const textY = barY - 7;

      // Δ label, right-aligned; measured so the span text can fit beside it
      ctx.font = SANS;
      const dl = b.delta === 0 ? "best" : "+" + b.delta + " B";
      ctx.fillStyle = b.pick ? C.accent : C.mute;
      ctx.textAlign = "right";
      ctx.fillText(dl, x + w, textY);
      ctx.textAlign = "left";
      const dlW = ctx.measureText(dl).width;

      // ✓ marks the committed span, in a gutter so all spans stay left-aligned
      ctx.font = MONO;
      if (b.pick) {
        ctx.fillStyle = C.accent;
        ctx.fillText("✓", x, textY);
      }

      // the FULL candidate span (finalists share a prefix and differ in the last
      // byte); only clipped from the end if it can't fit, keeping the start shown
      let span = b.tail.replace(/\n/g, "⏎");
      const avail = w - gutter - dlW - 10;
      if (ctx.measureText(span).width > avail) {
        while (span.length > 1 && ctx.measureText(span + "…").width > avail)
          span = span.slice(0, -1);
        span += "…";
      }
      ctx.fillStyle = b.pick ? C.fg : C.mute;
      ctx.fillText(span, x + gutter, textY);

      // bar: fuller = fewer compressed bytes; ties render equal
      roundRect(x, barY, w, barH, barH / 2);
      ctx.fillStyle = C.line;
      ctx.fill();
      roundRect(x, barY, Math.max(barH, w * b.w), barH, barH / 2);
      ctx.globalAlpha = state.alpha * (b.pick ? 1 : 0.5);
      ctx.fillStyle = b.pick ? C.accent : C.mute;
      ctx.fill();
      ctx.globalAlpha = state.alpha;
    }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, Math.max(w, 0), h, r);
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const until = (cond) =>
    new Promise((r) => {
      const tick = () => (cond() ? r() : setTimeout(tick, 30));
      tick();
    });

  requestAnimationFrame(draw);
  loop();
}

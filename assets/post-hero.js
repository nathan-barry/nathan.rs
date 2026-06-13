(function () {
  "use strict";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPostEnhancements);
  } else {
    initPostEnhancements();
  }

  function initPostEnhancements() {
    initHero();
    initSidenotes();
  }

  function initHero() {
    document.querySelectorAll(".post-hero-canvas").forEach((canvas) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const title = canvas.dataset.title || "";
      let frame = 0;

      function hashText(text) {
        let hash = 2166136261;
        for (let i = 0; i < text.length; i++) {
          hash ^= text.charCodeAt(i);
          hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
      }

      function random(seed) {
        let value = seed >>> 0;
        return function () {
          value += 0x6d2b79f5;
          let t = value;
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }

      function draw() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.floor(rect.width * dpr));
        const height = Math.max(1, Math.floor(rect.height * dpr));

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const cssWidth = width / dpr;
        const cssHeight = height / dpr;
        const styles = getComputedStyle(document.documentElement);
        const fg = styles.getPropertyValue("--body-font-color").trim() || "#222";
        const line = styles.getPropertyValue("--gray-200").trim() || "#ddd";
        const muted = styles.getPropertyValue("--color-link").trim() || "#666";
        const seed = hashText(title);
        const rand = random(seed);

        ctx.clearRect(0, 0, cssWidth, cssHeight);
        ctx.fillStyle = styles.getPropertyValue("--body-background").trim() || "#fff";
        ctx.fillRect(0, 0, cssWidth, cssHeight);

        const cols = 13;
        const rows = 7;
        const cellW = cssWidth / cols;
        const cellH = cssHeight / rows;
        const pulse = Math.sin(frame * 0.015) * 0.5 + 0.5;

        ctx.lineWidth = 1;
        ctx.strokeStyle = line;
        for (let x = 0; x <= cols; x++) {
          ctx.beginPath();
          ctx.moveTo(x * cellW, 0);
          ctx.lineTo(x * cellW, cssHeight);
          ctx.stroke();
        }
        for (let y = 0; y <= rows; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * cellH);
          ctx.lineTo(cssWidth, y * cellH);
          ctx.stroke();
        }

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const r = rand();
            if (r < 0.42) continue;
            const cx = x * cellW + cellW * (0.25 + rand() * 0.5);
            const cy = y * cellH + cellH * (0.25 + rand() * 0.5);
            const radius = Math.min(cellW, cellH) * (0.07 + rand() * 0.12);
            ctx.globalAlpha = 0.12 + rand() * 0.26 + pulse * 0.05;
            ctx.fillStyle = r > 0.78 ? muted : fg;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;

        ctx.font = "16px Georgia, serif";
        ctx.fillStyle = muted;
        ctx.textAlign = "center";
        ctx.fillText("nathan.rs", cssWidth / 2, cssHeight - 24);

        frame += 1;
        window.requestAnimationFrame(draw);
      }

      draw();
    });
  }

  function initSidenotes() {
    const grid = document.querySelector(".post-reading-grid");
    const content = document.querySelector(".book-post-content");
    const sidenotes = document.querySelector(".post-sidenotes");
    if (!grid || !content || !sidenotes) return;

    const footnoteSection = content.querySelector(".footnotes, .footnotes-list") || content.querySelector("section[role='doc-endnotes']");
    const refs = Array.from(content.querySelectorAll("sup a[href^='#fn'], a.footnote-ref[href^='#fn']"));
    if (refs.length === 0) return;

    function render() {
      sidenotes.innerHTML = "";
      if (window.matchMedia("(max-width: 1100px)").matches) return;

      const gridTop = grid.getBoundingClientRect().top + window.scrollY;
      const placed = [];

      refs.forEach((ref, index) => {
        const targetId = decodeURIComponent(ref.getAttribute("href").slice(1));
        const target = document.getElementById(targetId);
        if (!target) return;

        const note = document.createElement("div");
        note.className = "post-sidenote";
        note.innerHTML = target.innerHTML;
        note.querySelectorAll(".footnote-backref, a[role='doc-backlink']").forEach((link) => link.remove());

        const number = document.createElement("span");
        number.className = "post-sidenote-number";
        number.textContent = String(index + 1);
        note.prepend(number);

        sidenotes.appendChild(note);

        const refTop = ref.getBoundingClientRect().top + window.scrollY - gridTop;
        const last = placed[placed.length - 1];
        const top = last ? Math.max(refTop, last.top + last.height + 18) : refTop;
        note.style.top = top + "px";
        placed.push({ top: top, height: note.offsetHeight });
      });

      sidenotes.style.minHeight = Math.max(content.offsetHeight, placed.at(-1)?.top || 0) + "px";
      if (footnoteSection) footnoteSection.classList.add("post-footnotes-original");
    }

    render();
    window.addEventListener("resize", render);
    window.addEventListener("load", render);
  }
})();

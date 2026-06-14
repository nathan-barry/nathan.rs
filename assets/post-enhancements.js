(function () {
  "use strict";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPostEnhancements);
  } else {
    initPostEnhancements();
  }

  function initPostEnhancements() {
    initSidenotes();
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

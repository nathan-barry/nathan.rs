// Live, in-place filter for the homepage writing index.
// Predictable substring matching: a post is shown only if every whitespace-
// separated query token appears in its title or full content (case-insensitive).
// Empty sections collapse; clearing the box restores the grouped view.
(function () {
  "use strict";

  const input = document.querySelector("#home-search");
  const index = document.querySelector(".site-writing-index");
  if (!input || !index) return;

  const blocks = Array.from(index.querySelectorAll(".writing-block"));
  const items = Array.from(index.querySelectorAll(".block-list > li"));
  let docs = null; // [{ href, text }]
  let loading = null;

  input.addEventListener("focus", load);
  input.addEventListener("input", onInput);

  // Lazily fetch the index on first interaction.
  function load() {
    if (loading) return loading;
    loading = fetch(input.dataset.index)
      .then((res) => res.json())
      .then((data) => {
        docs = data.map((d) => ({
          href: d.href,
          text: (d.title + " " + d.content).toLowerCase(),
        }));
        if (input.value.trim()) onInput();
      })
      .catch(() => { loading = null; });
    return loading;
  }

  function onInput() {
    const q = input.value.trim().toLowerCase();

    if (!q) {
      items.forEach((li) => (li.hidden = false));
      blocks.forEach((b) => (b.hidden = false));
      return;
    }
    if (!docs) {
      load();
      return;
    }

    const tokens = q.split(/\s+/);
    const hrefs = new Set(
      docs
        .filter((d) => tokens.every((t) => d.text.includes(t)))
        .map((d) => d.href)
    );

    items.forEach((li) => {
      const a = li.querySelector("a");
      const href = (a && (a.dataset.href || a.getAttribute("href"))) || "";
      li.hidden = !hrefs.has(href);
    });
    blocks.forEach((b) => {
      b.hidden = !b.querySelector(".block-list > li:not([hidden])");
    });
  }
})();

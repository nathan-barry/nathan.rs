(function () {
  function init() {
    if (typeof Typewriter === "undefined") return;
    document.querySelectorAll(".typewriter-target").forEach(function (target) {
      var wrap = target.parentNode;
      if (!wrap) return;
      var placeholder = wrap.querySelector(".typewriter-placeholder");
      if (!placeholder) return;

      // Pull text from the placeholder (sans the static cursor span)
      var clone = placeholder.cloneNode(true);
      var cursor = clone.querySelector(".Typewriter__cursor");
      if (cursor) cursor.remove();

      new Typewriter(target, { delay: 20 }).typeString(clone.innerHTML).start();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

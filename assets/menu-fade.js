(function () {
  "use strict";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const menu = document.querySelector(".book-menu");
    if (!menu) return;

    let ticking = false;
    function update() {
      menu.classList.toggle(
        "book-menu-faded",
        window.scrollY > window.innerHeight * 0.5,
      );
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }
})();

(function () {
  "use strict";

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTocScroll);
  } else {
    initTocScroll();
  }

  function initTocScroll() {
    const toc = document.querySelector(".book-toc nav");
    if (!toc) return; // No TOC on this page

    const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
    if (tocLinks.length === 0) return;

    // Create a map of heading IDs to their TOC links
    const linkMap = new Map();
    tocLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      linkMap.set(id, link);
    });

    // Get all headings that are linked in the TOC
    const headings = Array.from(
      document.querySelectorAll(
        "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
      ),
    )
      .filter((heading) => linkMap.has(heading.id))
      .sort((a, b) => {
        // Sort by position in document
        const posA = a.getBoundingClientRect().top + window.scrollY;
        const posB = b.getBoundingClientRect().top + window.scrollY;
        return posA - posB;
      });

    if (headings.length === 0) return;

    let activeLink = null;
    let ticking = false;

    function setActiveLink(link) {
      if (activeLink === link) return;

      if (activeLink) {
        activeLink.classList.remove("active");
      }

      if (link) {
        link.classList.add("active");
      }

      activeLink = link;
    }

    function updateActiveLink() {
      // Trigger point is 33% down the viewport
      const triggerPoint = window.scrollY + window.innerHeight * 0.33;

      // Find the current heading
      // Start from the end and work backwards to find the last heading that's above the trigger point
      let currentHeading = headings[0];

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const headingTop = heading.offsetTop;

        if (triggerPoint >= headingTop) {
          currentHeading = heading;
          break;
        }
      }

      // Update the active link
      const link = linkMap.get(currentHeading.id);
      setActiveLink(link);

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveLink);
        ticking = true;
      }
    }

    // Listen to scroll events
    window.addEventListener("scroll", onScroll, { passive: true });

    // Set initial state
    updateActiveLink();
  }
})();

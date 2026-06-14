# nathan.rs

Hey welcome to my site! Currently, the site is based on a ***heavily modified*** version of [hugo-book](https://github.com/alex-shpak/hugo-book/). Hugo-Book was designed for documentation, and I have many substantial changes to the repo (and removed many things) to make it suitable for a beautiful blog.

## Post Heroes

Posts can opt into a hero (the visual block under the title). The default is **nothing** — a post has no hero unless its frontmatter sets a `hero` key. The value is dispatched on its file extension by `layouts/partials/docs/hero.html`:

| Frontmatter | Renders |
| --- | --- |
| `hero = "/images/foo.gif"` | `<img>` — `gif`, `png`, `jpg`, `jpeg`, `webp`, `avif`, `svg` |
| `hero = "/videos/demo.mp4"` | autoplaying, looping, muted `<video>` — `mp4`, `webm`, `mov` |

Sidenotes/footnote logic lives separately in `assets/post-enhancements.js`, which loads globally on every post.

## Shortcodes

These are shortcodes that I don't use (other than katex) but might be useful one day so I'm keeping them here!

> **Note:** the unused shortcode CSS in `assets/_shortcodes.scss` was pruned — only the styling for the two live markdown render hooks (`.book-hint` from `render-blockquote.html` and `.book-codeblock-filename` from `render-codeblock.html`) is kept. The shortcode *templates* below still exist, but re-enabling one (buttons, columns, tabs, badge, steps, card, image, asciinema) means restoring its styles.

- [Buttons](https://hugo-book-demo.netlify.app/docs/shortcodes/buttons/)
- [Columns](https://hugo-book-demo.netlify.app/docs/shortcodes/columns/)
- [Details](https://hugo-book-demo.netlify.app/docs/shortcodes/details/)
- [Hints](https://hugo-book-demo.netlify.app/docs/shortcodes/hints/)
- [Mermaid](https://hugo-book-demo.netlify.app/docs/shortcodes/mermaid/)
- [Tabs](https://hugo-book-demo.netlify.app/docs/shortcodes/tabs/)
- [KaTeX](https://hugo-book-demo.netlify.app/docs/shortcodes/katex/)

# nathan.rs

Source for [nathan.rs](https://nathan.rs), a personal writing site built with [Hugo](https://gohugo.io/).

The site started from a heavily modified version of [hugo-book](https://github.com/alex-shpak/hugo-book), but most of the documentation-theme structure has been removed or reshaped for a blog-style reading experience.

## Development

Requires Hugo Extended. The GitHub Actions workflow currently builds with Hugo `0.151.0`; local development also works with newer Hugo Extended versions.

Run the local dev server:

```sh
make run
```

Equivalent command:

```sh
hugo server -D --noHTTPCache
```

Build the production site locally:

```sh
hugo --minify
```

The generated site is written to `public/`, which is intentionally ignored by git.

## Project structure

- `content/posts/` — blog posts.
- `layouts/` — Hugo templates and render hooks.
- `layouts/index.html` — homepage / writing index.
- `layouts/_default/single.html` — blog post layout.
- `layouts/partials/docs/top-nav.html` — top navigation.
- `assets/` — SCSS and JS processed by Hugo Pipes.
- `static/` — files copied directly into the built site.
- `static/CNAME` — custom domain file copied into `public/CNAME` for GitHub Pages.

## Writing posts

Posts live in `content/posts/`. The default archetype is `archetypes/posts.md`.

Common frontmatter fields include:

```yaml
title: "Post title"
date: 2026-01-01
tags: ["Machine Learning"]
description: "Optional subtitle/description shown under the title."
hero: "/images/example.gif"
```

## Post heroes

Posts can opt into a hero visual below the title with the `hero` frontmatter key. No hero is shown unless `hero` is set.

Hero rendering is handled in `layouts/partials/docs/hero.html` and is based on the file extension:

| Frontmatter | Renders |
| --- | --- |
| `hero: "/images/foo.gif"` | Image: `gif`, `png`, `jpg`, `jpeg`, `webp`, `avif`, `svg` |
| `hero: "/videos/demo.mp4"` | Autoplaying, looping, muted video: `mp4`, `webm`, `mov` |

Hero assets should usually live under `static/images/` or another `static/` subdirectory, then be referenced from the site root path.

## Markdown features

- Code blocks use Hugo/Chroma highlighting.
- Optional code block filenames are rendered by `layouts/_markup/render-codeblock.html`.
- Mermaid code blocks are rendered by `layouts/_markup/render-codeblock-mermaid.html`.
- KaTeX assets live in `static/katex/`, with math delimiter passthrough configured in `hugo.toml`.
- Sidenotes and footnote enhancements live in `assets/post-enhancements.js`.

## Styling

The main stylesheet entrypoint is `assets/book.scss`.

Important partials:

- `assets/_defaults.scss` — CSS variables and base theme defaults.
- `assets/_markdown.scss` — markdown content styling.
- `assets/_custom.scss` — site-specific layout and visual customization.
- `assets/syntax-dark.scss` and `assets/syntax-light-scoped.scss` — Chroma syntax themes.

## Deployment

Deployment is handled by GitHub Actions in `.github/workflows/deploy.yml`:

1. Checkout the repo.
2. Install Hugo Extended.
3. Run `hugo --minify`.
4. Upload `./public` as a GitHub Pages artifact.
5. Deploy via `actions/deploy-pages`.

GitHub Pages should be configured with:

- **Source:** GitHub Actions

If Pages is set to “Deploy from a branch,” GitHub may serve the repository root instead of the Hugo build output. Since the repo root has a `README.md` but no `index.html`, that can make Pages display this README rather than the actual site.

The custom domain is `nathan.rs`. Keep `static/CNAME` in place so Hugo includes `CNAME` in the deployed `public/` artifact.

## Notes

The repo also contains `.github/workflows/main.yml`, which runs Hugo builds on pushes and pull requests as a CI check.

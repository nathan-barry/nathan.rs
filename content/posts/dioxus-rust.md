+++
title = "Rust Front-End Development with Dioxus"
date = 2023-08-16 
tags = ["Programming", "2023"]
+++



## Why Rust for Front-End Development
---
I’ve been using React and Next.js for front-end development ever since high school, it was one of the first few things I learned when it came to programming. Recently, I’ve had the itch to learn something new, specifically Rust front-end. As someone with a ".rs" domain, it felt like an inevitable fate. Finally, I can say I put the ".rs" in the "nathan.rs".

The front-end Rust ecosystem has come a long way in the last few years. We are at a point where we now have Rust frameworks that are actually somewhat usable (huge asterisk). While frameworks like Svelte, Astro, and Solid are making people rethink their approach to front-end development, Rust frameworks like Leptos and Dioxus are also maturing.

I've never been a fan of TypeScript or JS but have always loved Rust. I decided to rewrite my website in Rust using Dioxus. In addition to being more enjoyable to work on, any Rust code I write for other personal projects, I can compile down to WebAssembly and show on this site.

> EDIT: Eventually rewrote the site again with Hugo. Most of my content is just text and it is pretty unnecessary to use a SPA app just for a blog. I decided to make my site statically generated for fast load times and minimum bundle size. It is the right tool for the job.



## Dioxus Overview
---
For me, it was between this and Leptos. I chose Dioxus because of its versatility. It has support for desktop and mobile and has multiple options for serving a website.

The first option is `dioxus_web` which is Single Page Application (SPA) similar to React. SPAs work by sending over a large bundle of JavaScript which renders the website client side. This gives a very fluid experience but is bad for SEO and has relatively poor initial load times.

The second option is `dioxus_liveview` which renders everything on the server and uses WebSockets to stream the server content to the client. This is good for real-time multiparty apps where multiple people might be collaborating, like google docs or live whiteboard.

Finally, they have `dioxus_fullstack` which does SSR (Server Side Rendering). This means that they render the HTML server-side and send it to the client, as opposed to sending JS which renders it client-side as with dioxus_web.

I chose `dioxus_web` mainly since GitHub Pages support only static web apps which basically eliminated the other two options. I'm also familiar with React, and as we know, old habits die hard. Now that we've covered that, let's go through the basics.

```rust
// ./src/main.rs

// Snippet 1
#![allow(non_snake_case)]
use dioxus::prelude::*;
use dioxus_router::prelude::*;
use crate::pages::{
    about_me::AboutMe,
    page_not_found::PageNotFound,
};

// Snippet 2
#[derive(Routable, Clone)]
enum Route {
    #[route("/")]
    Home {},
    #[route("/about")]
    AboutMe {},
    #[route("/:..route")]
    PageNotFound { route: Vec<String> },
}

// Snippet 3
#[inline_props]
pub fn Home(cx: Scope) -> Element {
    render! {
        h1 { "Hello, World!" }
        p { class: "mb-4",
            "This is what RSX looks like! It's like JSX but Rust!"
        }
    }
}

// Snippet 4
fn app(cx: Scope) -> Element {
    render! {
        Router::<Route> {}
    }
}

fn main() {
    // launch the web app
    dioxus_web::launch(app);
}
```

Above is the bare-bones stripped-down version of my site. If you're familiar with React or Next.js, it should look very familiar.

Below is an explanation of each of the 4 snippets above:

1. This snippet contains two things. The first is a macro that suppresses warnings about snake case. Normally, functions in rust use `snake_case` and the compiler will give a warning if you don’t follow the standard convention, but in the React ecosystem, we tend to use PascalCase for function components. Below the macro are project imports. For external crates, we have dioxus and dioxus router. The other imports are just two pages components in different files.

2. This consists of the router. The code is fairly self-explanatory. The main thing of note is that the last enum variant is the catch all route. Any URL that doesn't pattern match to any above it will be directed to this custom 404 page.

3. This is a component that is used as the home page. The base URL will route to and render this component. Dioxus uses RSX, but they do provide an html macro that allows you to write a more familiar JSX style. RSX supports TailwindCSS which is what I use for styling in this example.

4. This is just the entry point for the web app. The function app() renders the current route which is ran by main. It's just boilerplate you should keep in main.rs.

Dioxus also has its own CLI tool that makes serving easy. You just run `dx serve` to host it locally. It should say to open `https://localhost:8080/` to view the site. You can read more about how to get started with Dioxus [here](https://dioxuslabs.com/learn/0.4/getting_started).

### Fixing Routing with Tailwind
To let the CLI know that you are using Tailwind, you must explicitly define it in a Dioxus config via a `Dioxus.toml` file. Here is what is provided in the [docs](https://dioxuslabs.com/learn/0.4/cookbook/tailwind).

I eventually learned that the Dioxus CLI was updated after this documentation was created. Since then, routing was completely reworked and the CLI must use a newer default config. When I added Tailwind, I had to override the newer deployment configuration with an old config that didn't account for routing. Luckily, the solution was a simple fix, I just needed to add this line in the toml:

```toml
# ./Dioxus.toml

# --snip--

[web.watcher]

index_on_404 = true

# --snip--
```

That's better. We'll also talk about hosting on Github pages here because it similarly involved the toml.



## Hosting on Github Pages
---
The easiest way to host this was to move the build output directory to `/docs` and then, in the Pages settings page in the github repository, select it to build from `/docs`. Below is a screenshot of what it should look like.

Github Pages will host your site at `http://<USERNAME>.github.io/`. If your repository is named `<USERNAME>.github.io` the site will be hosted at the base URL, `/`. Otherwise, it'll go live at code `/<REPO_NAME>`. I have my custom domain set up so it says `http://nathan.rs/` for me.

```toml
# ./Dioxus.toml

[application]

# --snip--

# OLD DEFAULT
# out_dir = "dist"

# NEW 
out_dir = "docs"

# --snip--
```

My file tree looks something like this:

```md
File Tree
.
├── Cargo.lock
├── Cargo.toml
├── Dioxus.toml
├── docs
├── index.html
├── public
├── src
│   ├── blog
│   ├── components
│   ├── input.css
│   ├── main.rs
│   ├── pages
│   ├── projects
├── tailwind.config.js
└── target
```

The base level index.html is just because I have custom HTML I need to load highlight.js to do the syntax highlighting for the code block components. The Dioxus CLI produces a new HTML and JS file every time you build but there is a CLI option to have a custom HTML page that produces one in the base directory for you to edit.

As you can see, `dx serve` and `dx build --release` now builds everything in `/docs`, which Github Pages treats as the base directory. Easy peasy.



## Interacting with JS Libraries from Rust
---
The wasm-bindgen project provides developers with a few tools for interacting with JS and browser APIs.

The web-sys crate contains bindings to browser web APIs. This includes things like the Document Object Model (DOM), HTML elements, browser-specific functions like window.fetch, and more. I use this extensively for my Conway's Game of Life implementation, which you can find the source code [here](https://github.com/nathan-barry/nathan-barry.github.io/blob/3af983098dddfc21a81a3e1d66512b0babcfe031/src/projects/game_of_life.rs). js-sys is what we're looking for, which is quite easy to use. It allows us to interact with JavaScript code directly from a rust file.

I mentioned above about loading a JS library via the index.html file. I included a link element that downloads highlight.js' default stylesheet and a script element that downloads the highlight.js library.

```html
<!-- ./index.html -->

<!DOCTYPE html>
<html>
<head>
  <!-- snip -->

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/default.min.css">

  <!-- snip -->
</head>
<body>
  <!-- snip -->

  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>

  <!-- snip -->
</body>
```

I ended up making my own custom code syntax theme in `./public/hljs.css` and updated the link element to be `<link rel="stylesheet" href="hljs.css">` to use my new theme.

Below is how to call the highlight.js library via Dioxus's `use_effect` hook to highlight rendered code blocks.

```rust
// ./src/main.rs

#[inline_props]
pub fn Home(cx: Scope) -> Element {

    // Calls highlight.js code when page loads
    use_effect(cx, (), move |_| {
        async move {
            let js_code = "hljs.highlightAll();";
            js_sys::eval(js_code).expect("Error highlighting code");
        }
    });

    render! {
        h1 { "Below is a code block" }

        pre {
            code { class: "language-rust",
                "let x: f64 = 7.0;"
            }
        }
    }
}
```

Like React, Dioxus has a `use_effect` hook that fires whenever the page loads. All we need to do to execute JS code is call `js_sys::eval(js_code)`. Thus, we can interact with JavaScript libraries directly in rust.



## Conclusion
---
I had a very enjoyable time reimplementing my website in Rust using this framework.

All of these Rust front-end libraries are very new and share the same characteristics as any frontier. There is usually poor documentation. Sometimes things just don't work. At times you'll have to dive deep into the source code to find answers. On the other hand, the codebase is 'small' enough to where one person can comprehend it. Such a challenge is possible and rewarding.

I think that such projects are lovely to work on. It requires you to get your hands dirty and actually understand what is going on under the hood. In the past, I was a classic React user that only knew the abstraction, not the layers of complexity beneath it. This project helped uncover some of that complexity while teaching me the basics of WebAssembly. I recommend giving this library a try.

+++
title = "Markdown Syntax Guide"
description = "This article offers a bunch of basic Markdown syntax items that can be used in Hugo content files. This is usually used by me as a reference, and to make sure everything is rendering properly."
date = 2020-01-01
tags = ["Misc"]
+++

{{< toc >}}



## Blockquotes
***
The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

Blockquote without attribution:

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use *Markdown syntax* within a blockquote.

Blockquote with attribution:

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.



## Tables
***
Tables aren't part of the core Markdown spec, but Hugo supports supports them out-of-the-box.

   Name | Age
--------|------
    Bob | 27
  Alice | 23

Inline Markdown within tables:

| Italics   | Bold     | Code   |
| --------  | -------- | ------ |
| *italics* | **bold** | `code` |



## Code Blocks
***
Code block with backticks:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```



## List Types
***
Ordered List:

1. First item
2. Second item
3. Third item

Unordered List:

* List item
* Another item
* And another item

Nested list:

* Fruit
  * Apple
  * Orange
  * Banana
* Dairy
  * Milk
  * Cheese



## Other Elements — abbr, sub, sup, kbd, mark
***
<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.



## Sidenotes
***
[LaTeX.css](https://latex.vercel.app/), which this site is using, defines syntax for sidenotes. I took code from the HugoTex theme that provides a shortcut for it:

```md
A sentence deserving a sidenote. {{%/* sidenote */%}}The note itself.{{%/* /sidenote */%}}
```

Will render into

A sentence deserving a sidenote. {{% sidenote %}}The note itself.{{% /sidenote %}}



## Rich Content
***
Hugo ships with several [Built-in Shortcodes](https://gohugo.io/content-management/shortcodes/#use-hugos-built-in-shortcodes) for rich content, along with a [Privacy Config](https://gohugo.io/about/hugo-and-gdpr/) and a set of Simple Shortcodes that enable static and no-JS versions of various social media embeds.

YouTube Privacy Enhanced Shortcode:

{{< youtube MxOScWMZdwI >}}



## Emoji Support
***
Emoji can be enabled in a Hugo project in a number of ways. 
<!--more-->
The [`emojify`](https://gohugo.io/functions/emojify/) function can be called directly in templates or [Inline Shortcodes](https://gohugo.io/templates/shortcode-templates/#inline-shortcodes). 

To enable emoji globally, set `enableEmoji` to `true` in your site's [configuration](https://gohugo.io/getting-started/configuration/) and then you can type emoji shorthand codes directly in content files; e.g.

<p><span class="nowrap"><span class="emojify">🙈</span> <code>:see_no_evil:</code></span>  <span class="nowrap"><span class="emojify">🙉</span> <code>:hear_no_evil:</code></span>  <span class="nowrap"><span class="emojify">🙊</span> <code>:speak_no_evil:</code></span></p>

The [Emoji cheat sheet](http://www.emoji-cheat-sheet.com/) is a useful reference for emoji shorthand codes.



## Latex
***
Mathematical notation in a Hugo project can be enabled by using third party JavaScript libraries.

<p>
Inline math: \(\varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887…\)
</p>

Block math:
<p>
 $$\varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } } $$
</p>
<br>

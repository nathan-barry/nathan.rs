+++
title = "How to Fix Hugo's iOS Code-Block Text-Size Rendering Issue"
date = 2024-02-04T17:23:27-06:00
tags = ["Misc"]
+++


## The Rendering Issue

Lately, I've been coming across many blogs that have weird font-size rendering issues for code blocks on iOS. Basically, in a code snippet, the text-size would sometimes be much larger for some lines than others.

Below are a few screenshots I've taken for websites that I've seen this on:


<div class="two-columns">
<img alt="iovec.net code block issue" src="/images/IMG_9051.png">
<img alt="shyam.blog code block issue" src="/images/IMG_9057.png">
</div>

As you can see, the text-size isn't uniform across code block lines. I've seen this issue across many blogs that compile markdown files to HTML such as sites built using Hugo, Jekyll, or even [custom md-to-html shell scripts](https://github.com/git-bruh/site).

This issue seems to happen on every browser on iOS (Safari, Firefox, and Chrome in my testing).

## Solution

I previously spotted this issue when I was originally setting up this site. Luckily, there seems to be an easy solution.

All you need to do to fix this is to include the code snippet below in your main CSS file:

```css
/* Fixes iOS font sizing anomaly */
code {
    text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}
```

This should fix the rendering issue and make the text-size in code blocks look correct. 

If I have sent you this post, it means that I've spotted this issue on your site. Should be an easy fix.

## What might cause this?

The CSS snippet above explicitly tells the browser to render the text size at its original size (the `-ms`, `-moz`, and `-webkit` are for IE, Firefox, and Safari respectively). Without this, the browser decides it's fine to change the text size for certain lines. But why?

I did some investigation on my own site by removing the CSS snippet. After looking at a couple of posts, there was an obvious pattern to what lines were rendered large: **line length**.

Below are two screenshots of different code blocks on my site:

<div class="two-columns">
<img alt="nathan.rs short code block, no issue" src="/images/IMG_9069.png">
<img alt="shyam.blog long lines in code block, issue" src="/images/IMG_9077.png">
</div>

In both images, the only lines that are rendered large are the long ones. This has been true for every code block I've looked at.

### My Guess

Let's look at the code block below:

```go
func buildTopo(v *Value, topo []*Value, visited map[*Value]bool) []*Value { // 1st
	if !visited[v] {
		visited[v] = true
		for _, prev := range v.prev {
			topo = buildTopo(prev, topo, visited) // 5th
		}
		topo = append(topo, v)
	}
	return topo
}
```

This is a code snippet from a previous post of mine. The first and fifth lines (the two longest) both render large without the `text-size-adjust: 100%` CSS block.

If we inspect element, we can view the HTML of the code block.

```html
<code class="language-go" data-lang="go">
    <span style="display:flex;">...</span>
    <span style="display:flex;">...</span>
    <!-- one span for each line of code... 10 in total -->
    <span style="display:flex;">...</span>
</code>
```

Let us look at one of the lines (line 4 in this case). The HTML of a line of code is just a bunch of nested spans. If the code is highlighted, it's wrapped in another nested span with the color styling, otherwise it is just the text. 

```html
<span style="display:flex;"><span>
    <span style="color:#fe8019">for</span>
    _, prev
    <span style="color:#fe8019">:=</span>
    <span style="color:#fe8019">range</span>
    v.prev {
</span></span>
```

The first line (long) looks like this:

```html
<span style="display:flex;">
    <span>
        <span style="color:#fe8019">func</span>
        <span style="color:#fabd2f">buildTopo</span>
        (v
        <span style="color:#fe8019">*</span>
        Value, topo []
        <span style="color:#fe8019">*</span>
        Value, visited
        <span style="color:#fe8019">map</span>
        [
        <span style="color:#fe8019">*</span>
        Value]
        <span style="color:#fabd2f">bool</span>
        ) []
        <span style="color:#fe8019">*</span>
        Value {
    </span>
</span>
```

My best guess is that the longer lines overflow and the browser tries to handle them differently. I could do more experiments, but I'm satisfied with my investigation.


### Souls Saved

Below is a list of all the websites that added the fix.

Website | Date
--- | ---
nathan.rs | 09/06/2023
iovec.net | 02/03/2024 
shyam.blog | 02/08/2024

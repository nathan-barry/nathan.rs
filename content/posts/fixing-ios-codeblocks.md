+++
title = "Fixing the iOS Code-Block Font Rendering Issue"
date = 2024-02-04T17:23:27-06:00
tags = ["Misc"]
+++


## The Rendering Issue

Lately I've been coming across many blogs that have weird font rendering issues for code blocks on iOS. Basically, in a code snippet, the font size would seemingly randomly be much larger for some lines than others.

Below are a few screenshots I've taken for websites that I've seen this on:


<div class="two-columns">
<img alt="iovec.net code block issue" src="/images/IMG_9051.png">
<img alt="shyam.blog code block issue" src="/images/IMG_9057.png">
</div>

As you can see, the font size isn't uniform across code block lines. This seem to be common for many blogs that compile markdown files to HTML such as Hugo or Jekyll sites.

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

This should fix the rendering issue and make the font in code blocks look correct. It seems like this issue is just on iOS and is agnostic of the browser used (as in it appears using Safari and Firefox in my testing, perhaps more).

If I have sent you this post, it means that I've spotted this issue on your site. Should be an easy fix, farewell.

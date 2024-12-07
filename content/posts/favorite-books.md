+++
title = "Favorite Books"
description = "I've always enjoyed seeing what books other people have read. Below are all the books I've read since middle school, roughly in order. Those highlighted orange were those I particularly enjoyed or found impactful. An asterisk (*) indicates you can click to see some of my thoughts on the book :)"
tags = ["Personal"]
+++

<script>
let bookNumber = 156;  // Initialize book number

document.addEventListener("DOMContentLoaded", function() {
  // Auto-increment book numbers
  document.querySelectorAll('.book-number').forEach((book) => {
    book.textContent = bookNumber-- + '. ';
  });
});

function toggleDescription(element) {
  const descriptionElement = element.querySelector('.book-description');
  if(descriptionElement) {
    descriptionElement.classList.toggle("hidden");
  }
}

function setHovering(isHovering, element) {
  const titleElement = element.querySelector('.book-title');
  if(titleElement && isHovering) {
    titleElement.classList.add("font-bold");
  } else {
    titleElement.classList.remove("font-bold");
  }
}
</script>



## [2024 | Age 21]
---
{{< book
    title="Nexus"
    author="Yuval Noah Harari"
    special=""
    description="">}}

{{< book
    title="An Introduction to Linear Algebra"
    author="Gilbert Strang"
    special=""
    description="I went back through this textbook and took notes over it. I like having notes over 'core' math like this that I can go back to time to time. Most of my classes this semester is heavy with linear algebra, so I thought it would be a good time to refresh my memory.">}}

{{< book
    title="When Einstein Walked with Gödel"
    author="Jim Holt"
    special=""
    description="This was an interesting book covering wide ranging topics over mathematics and philosophy: graph theory, quantum physics, string theory, history, etc. It reminds me of the two books Quantum Magazine has published in the sense where it's made up of a series of disjoint topics over a variety of topics.">}}

{{< book
    title="The C Programming Language"
    author="Brian W. Kernighan & Dennis M. Ritchie"
    special=""
    description="This is the third time I've picked up this book. The first time was when I first entered Computer Architecture and read about the first 50 pages. I'm thinking that I might do a lot of C development, and I always prefer to read everything about a language if I'm going to use it a lot. Always things you pick up here and there.">}}

{{< book
    title="Competitive Programmer's Handbook"
    author="Antti Laaksonen"
    special=""
    description="Read the first two thirds and skimmed the last third (about misc. topics). It was a good review of my Algorithms & Complexity class, as it covers many of the same algorithms.">}}

{{< book
    title="Going Infinite"
    author="Michael Lewis"
    special="true"
    description="This book is about the FTX collapse and is a short and enjoyable read. It was a very interesting book to listen to, especially as someone who was interested and working at DeFi startups at the time. That year itself was just absolutely wild. Beanstalk, Terra, FTX, and all the hacks that happened, things blowing up left and right. Seeing the outcome of an overleveraged market imploding on itself, combined with the outcome of dozens of bad (irrational) decisions. What is most wild about this story is just how fine FTX was. They were making half a billion a year in profits. The only reason why FTX went insolvent was because they illegally backdoored their own customer funds to Alameda Research. Most people working there when things started to collapse were in absolute disbelief that they were insolvent, since they were literally operating a money printer.">}}

{{< book
    title="Seeing Like A State"
    author="James C. Scott"
    special=""
    description="This book talks about how authoritarianism and high modernist movements have always failed because of the human tendency to abstract away concrete minute details for uniformity and simplicity. For any system that we desire to have more control over, we force it to adhere to our abstractions and shape systems to be more legible, which has had extreme successes and failures throughout the industrial world. One thing that I have pondered about in the past is whether authoritarianism ever could work. In theory, if we had a perfect omnipotent being that knew all, it should be able to devise a more perfect and efficient system than what free market forces could devise, since there is no information delay or imperfections. Perhaps in a world with the extensive data mining and tracking we have today, the Soviets would have fared much better. To the hypothetical idea of creating an AI that can plan and direct economies, I wonder if it is feasible or whether there will always be detrimental edge cases that the model doesn't generalize well on. Regardless, it'll be as heartless as any state has been when it comes to realities that it does not considers.">}}

{{< book
    title="The Innovators"
    author="Walter Isaacson"
    special=""
    description="I've read plenty of books about the history of technology and silicon valley, but this one has been by far the most extensive and complete. One beauty of learning things is that you see how many things are connected. This book added on to that. For instance, I already knew about the history of Fairchild Semiconductor, but I somehow missed the huge connection that Noyce also founded Intel as well. What a glaring gap in my knowledge now resolved. I liked the chronological order of this book, from Babbage to modern day, as a lot of these stories that I've heard were individual instances and this book showed the connections from the flow of time.">}}

{{< book
    title="Industrial Society And Its Future"
    author="Ted Kaczynski"
    special=""
    description="This is a very interesting book which covers a broad set of ideas similar to Seeing Like A State, Huxley's Brave New World, Nietzsche's Thus Spoke Zarathustra, and Bostrom's Superintelligence. Most of his commentary on contemporary society is true (especially interesting is his commentary on the insatiable character of left-wing movements) but the conclusion he draws is bizarre. Yes, technology is great, it has reduced the burden of man and has drastically increased the quality of life for billions of people. It has also alienated man from their natural state, caused mass societal and environmental problems, and has arguably reduced humans to gears in a system, with that system restricting freedom and turning out lives Kafkaesque with rules imposed on us and our individuality consistently stripped away. However, the solution is to not eradicate 95% of the human race and nuke us back to the Stone Age, as his solution must inevitably cause. If mankind has shown one specialty, it is innovating and having the capabilities to dig itself out of its own holes it inevitably creates by the unintended side effects of progress. Progress is just the motif of humanity and trying to create a world where it is limited is a fools errand, even if it wasn't a terrible idea from the offset. One striking curiosity is how the anti-human Unabomber worldview has become fashionable amongst those exact same over-socialized elites Kaczynski laments about in his work. Hopefully, the future will shine fortune on those who want to take humanity to the stars than those who desire to revert it to the yesteryears wherein for most of man, life is nasty, brutish, and short.">}}

{{< book
    title="The Founders"
    author="Jimmy Soni"
    special="true"
    description="This was a good book that covered the history of PayPal and all the members that eventually became known as the PayPal Mafia, but this got the special orange tag because of the last chapter. That was completely out of left field and pushed this book over the edge. This guy also wrote the Claude Shannon book below, great author in general.">}}

{{< book
    title="The Cathedral & The Bazaar"
    author="Eric S. Raymond"
    special=""
    description="One thing that I thought was interesting in this book was it's discussion on the origin of traditions and customs for conflict resolution management in a decentralized system where there is no central authority. I've recently been thinking about that topic as a whole when applied to the history of the United States (and societies in general), and how such tradition and customs (deemed legitimate by the host population) were the foundations of order, and how when central authority monopolized dispensing of justice, such traditions and customs completely faded. Such things tend to completely die, with people domesticated, and left completely reliant on the central authority to properly uphold law and order, which for a variety of states across time, tends to be improperly implemented. Overall, I think that the book was very interesting and covered insightful history on the birth of the open source movement.">}}

{{< book
    title="The Man Who Solved The Market"
    author="John Steele Gordon"
    special=""
    description="This was about Jim Simons and Renaissance Technology. Jim recently passed away a few weeks before me reading the book. Very interesting read. I'm surprised to have heard names like John Nash and Claude Shannon appear throughout the book.">}}

{{< book
    title="An Empire of Wealth"
    author="John Steele Gordon"
    special=""
    description="This was a good book over the entire history of the United States, from a Marxist perspective of history (through the lens that economic structures fundamentally drives history).">}}

{{< book
    title="Writing a Compiler In Go"
    author="Thorsten Ball"
    special=""
    description="I skimmed through this book while at my sister's med school graduation. It was interesting to see how a virtual machine compiler worked. I want to make a simple compiler and interpreter over the summer, and this book will be my reference.">}}

{{< book
    title="Killers of the Flower Moon"
    author="David Grann"
    special=""
    description="This was about the Osage Murders and the birth of the FBI. Interesting to read history books and to put it in perspective with everything else. It's always strange to be reminded of prohibition. Amazing that there was ever enough political will for it to be enacted at all ever." >}}

{{< book
    title="Computer Architecture: A Quantitative Approach"
    author="John L. Hennessy & David A. Patterson"
    special="true"
    description="Went through a bit of this for Advanced Computer Architecture. The Appendix was a great review of normal comp arch. Good book and good class." >}}

{{< book
    title="Alexander Hamilton"
    author="Ron Chernow"
    special="true"
    description="I just found out that Ron Chernow was the author of the book that the musical was largely inspired from. Decided to give it a read, and it's my favorite of his work. Certainly a book worth reading. I realized that I knew much less about the early founding period than I previously thought." >}}

{{< book
    title="Titan: The Life of John D. Rockefeller"
    author="Ron Chernow"
    special=""
    description="" >}}

## [2023 | Age 20]
---
{{< book
    title="Napoleon"
    author="Andrew Roberts"
    special="true"
    description="I've read dozens of books about entrepreneurs, statesmen, scientists, etc, but this book makes me feel something more than just inspiration for worldly pursuits. Napoleon was one of the last Great individuals. We today have great people everywhere which is great for humanity, but long gone is the time when an era could be named after an individual alone. He is put in the group of great conquerors of history, along side Caesar and Alexander, and he is the last." >}}

{{< book
    title="A Tour of C++"
    author="Bjarne Stroustrup"
    special=""
    description="I've never seen a language so great and terrible. I've yet to dive deep in a project with it. My biggest gripe about it is just the lack of decent tooling around it. I'd rather use something like Zig and Rust, where making it deployable seems like a sane task. Having to deal with the lack of coherence (tooling, package management, different versions) just makes it seem like a pain. Things like C++ supporting Modules, but 3 years later GCC doesn't support it is just wild to me.">}}

{{< book
    title="Efficient Go"
    author="Bartiomiej Plotka"
    special=""
    description="This book was alright. The first half was about Go and the second half was just a review of computer architecture. I half read a handful of books covering Go, but since I only half read them, this is the only one that is included.">}}

{{< book
    title="Writing an Interpreter In Go"
    author="Thorsten Ball"
    special=""
    description="So much of life is just Abstract Syntax Trees.">}}

{{< book
    title="The Contrarian: Peter Thiel and Silicon Valley's Pursuit of Power"
    author="Max Chafkin"
    special="true"
    description="">}}

{{< book
    title="Elon Musk"
    author="Walter Isaacson"
    special="true"
    description="">}}

{{< book
    title="The House of Morgan"
    author="Ron Chernow"
    description="This behemoth of a book is about the Morgan banking dynasty, from George Peabody and J.S. Morgan to now. Because the Morgan Dynasty has been around for 200 years, this book also is nearly a history of modern banking as a whole. What I thought was interesting was the evolution of the relation between bank and the state. From king makers to diplomats to tools of the state, their power (and power of bankers in general) has diminished greatly.">}}

{{< book
    title="The Rust Programming Language"
    author="Steve Klabnik & Carol Nichols"
    special=""
    description="This is not the first time I've read this, nor will it be the last. When I first read this two years ago, I didn't know shit from Shinola. Now, I'm marginally smarter. I've actually taken a computer architecture and OS class, understand memory, etc. I went ahead and made a few small Rust projects (a WASM blog and basic symbolic math library). Perhaps one day I'll actually use Rust for something non-trivial.">}}

{{< book
    title="The Odyssey"
    author="Translated by Emily Wilson"
    special="true"
    description="Surprisingly, I've never read many 'classics'. Emily Wilson did a fantastic translation. I did enjoy the story. These old archetypal stories always reflect aspects of the human condition that we can relate to and cause us to reflect deeper about our lives. We are all the hero in our own lives on our own journey, and we must make the best of it.">}}

{{< book
    title="Physics for Engineers and Scientists, Vol. 1"
    author="Hans C. Ohanian & John T. Markert"
    special="true"
    description="This is the first textbook I've actually nearly read to from cover to cover. Everything excepct for the sections on heat and thermodynamics. It was a very good textbook. I noticed that there's a really large gap in my understanding of the world. Math and computer science is solid knowledge, but in terms of how the world actually works, I've been fully ignorant until now." >}}

{{< book
    title="Six Easy Pieces"
    author="Richard P. Feynman"
    description="Feels great to actually understand physics (currently also taking a physics sequence at UT). After a couple of books about general relativity and quantum mechanics, I'll tap out of physics. I'll have a reasonable understanding. I can die satisfied." >}}

{{< book
    title="Rome: An Empire's Story"
    author="Greg Woolf"
    description="I loved the end, when it was talking about what causes a culture to create monuments. The late republic and early empire, tons of monuments were built. People that build monuments have enough trust that there will be someone there in the future to remember them. Very few monuments were built after the early life of the empire, which also lines up with the start of its decline. Of course, economic factors play in, but maybe people didn't believe that future generations would be there for them? Or at least future generations that they cared about." >}}

{{< book
    title="The Man From The Future"
    author="Ananyo Bhattacharya"
    description="This book talks about each field that John von Neumann was involved in: quantum mechanics, the manhatten project, computers, and cellular automaton. It's too late for me, but there seems to be a systematic way to raise kids with a touch of genius. Every time I think about it, focusing my entire life on gathering resources and then pivoting all my focus on my future kids seems like it should surely have a higher long term expected value than me trying to reach great heights, as my kids would surely be able to do more. Of course, the future is always full of uncertainties." >}}

{{< book
    title="American Prometheus"
    author="Kai Bird & Martin J. Sherwin"
    special="true"
    description="This is a great biography about J. Robert Oppenheimer. I've read so many books about such great figures. It's strange, going through someone's entire life in just a week. It always leaves an impression on me greatly, reading about their death, and Oppenheimer is of no exception. Wasted away from cancer. Hearing about how people change when faced with their own mortality, it always makes me stop and ponder what I am doing with my life." >}}

{{< book
    title="Einstein"
    author="Walter Isaacson"
    description="This book became so much better and more enriching after I learned about the basics of topology and the history of non-Euclidian geometry and the early Prussian university system with the characters and historic figues that came out of there. I love more about the same things through different lenses. Great biography in general." >}}

{{< book
    title="Algorithms to Live By"
    author="Brian Christian & Tom Griffiths"
    description="This book made me wonder how much knowledge I didn't catch throughout my life. I read a part of this book in the past before. Rereading it again, after taking computer architecture and OS, is a completely different experience. Things that I didn't understand or pick up on are now obvious to me and the amount I take away is greatly different." >}}

{{< book
    title="Gödel's Proof"
    author="Ernest Nagel & James R. Newman"
    special="true"
    description="For the first time in my life, I feel like I actually have a fairly intuitive understanding of Gödel's Incompleteness Theorem (EDIT: forgot it already). I decided to read this because I started Gödel Escher Bach and wanted to truly understand the concept that sparked it all before reading such a Tour De Force." >}}

{{< book
    title="The Joy of X"
    author="Steven Strogatz"
    description="Just another book about math history and trivia. One thing that I thought was super interesting is that it mentioned how to optimal stopping point for any problem where you know the size, the solution is 1/e. In another book, 'Agorithms To Live By', it mentioned this, but it just said .37% (the rounded decimal version of 1/e). I'm just reminded of how amazing math is and how it is unexplanably beautiful and tied together." >}}

{{< book
    title="The Creature from Jekyll Island"
    author="G. Edward Griffin"
    special="true"
    description="This is mandatory reading. This book does what Howard Zinn's 'The People's History Of The United States' wanted to do, while funnily being on the exact opposite of the political spectrum. I'm always reminded how, in response to the criticism of conspiracy theories in general, people remind us that the founding of our country was a massive conspiracy theory. The more I exist, the more I realize that a lot of the largest socio, political, and economic events in human history have all been just strings of conspiracy theories, and we are almost certainly living amongst many at the current moment." >}}

{{< book
    title="How Google Works"
    author="Eric Schmidt & Jonathan Rosenberg"
    description="Bland. This was a mix between 'History of Google' and 'Google's management philosophy'. The history part is nice, the latter was just very generic stuff. Most likely my perspective. When this book came out these ideas could have been novel, but throughout the years, much of this advice propagated to most of the startups out there to the point where a lot of this is common knowledge" >}}

{{< book
    title="A Mind at Play"
    author="Rob Goodman & Jimmy Soni"
    special="true"
    description="I love Claude Shannon. Really a human to cause inspires in others. The archetypal tinkerer. Just a terrific man. While I might not ever be able to outshine his genius, I might one day be able to juggle better than him (5 balls instead of 4)!" >}}

{{< book
    title="The Poincaré Conjecture"
    author="Donal O'Shea"
    special="true"
    description="A truly fantastic book, one of the best I've ever read. Goes through the history of math, from Euclid to Gauss, Riemann, etc. and covers the origin of geometry, topology, calculus, and other foundations of math and how it all connects. I very much appreciated its intro to topology as I'm very new to a lot of higher math topics. Truly a wonderful book and has helped spark a deeper curiousity and love for math within me." >}}

{{< book
    title="The Everthing Store"
    author="Brad Stone"
    special="true"
    description="This book is about Jeff Bezos and the founding of Amazon. Really surprised me. Who knows how much the lens of this story warps the reality, but from this book, it seems like Jeff Bezos doing something great was inevitable. I recently read half of 'Shoe Dog', the founding story about nike, and it really seems like the guy just got insanely lucky. Jeff Bezos seems to be at the very opposite of the spectrum; it was inevitable he would do something great. Very much holds admirable traits to emulate." >}}

{{< book
    title="All the Math You Missed"
    author="Thomas A. Garrity"
    description="This covers everything from Linear Algebra to Topology, from Differential Equations to Non-Euclidian Geometry. It was really nice to just see everything that one could cover in an undergraduate math degree and introduced me to a bunch of new topics." >}}

{{< book
    title="Cracking The Coding Interview"
    author="Gayle Laakmann Mcdowell"
    description="Just had to go through this quickly to refresh my memory" >}}

{{< book
    title="Chip War"
    author="Chris Miller"
    description="This book is about the history of the microchip industry, mentioning the rise of globalism, of Japan, Tiwan, South Korea, the history of Silicon Valley and its relation with the US military, and the national security concerns China and the US has over the lack of control over technologies that make up the majority of their military might. Fantastic book, right down my alley." >}}

{{< book
    title="Empire of Pain"
    author="Patrick Radden Keefe"
    description="This book is about the Sackler family and the opioid pandemic. I realized that, like how a lot of women enjoy true crime stories, I am a sucker for the male equivilant: white-collar crime stories. This is like the 8th book I've read over some corporate story of fraud and greed." >}}

{{< book
    title="No Longer Human"
    author="Osamu Dazai"
    description="" >}}

{{< book
    title="The Roman Empire"
    author="Gregory S. Aldrete"
    description="Hail Caesar!" >}}

{{< book
    title="The Rise of Rome"
    author="Gregory S. Aldrete"
    description="" >}}

{{< book
    title="The Smartest Guys In The Room"
    author="Bethany McLean"
    special="true"
    description="It's always interesting to ready more about these interconnected web of major corporations that had a large impact on american society, mainly because we learn about these things as if they happened in a vacuum while in reality thousands of other things were going on and much of it interweaved. After reading books about Bechtel and McKinsey and seeing how those companies had a large impact on Enron and how it all feeds one another, one realizes what a complicated beast humanity is. I also just thought it's interesting seeing how historically, periods of exuberance come again and again and how our window of pattern recognition is far smaller than how often these periods occur. Problems are always ignored when the momentum of things are positive and it is only until the floor from under us begins to shake that we realize our folly. Innate suscpicion is the only cure to exaulted hubris, but it's a fine line between conservatism and letting opportunities pass." >}}

{{< book
    title="The Firm"
    author="Duff McDonald"
    special="true"
    description="This is a history of McKinsey, the famous consulting firm. It's crazy to see that these guys literally created consulting as an industry and how it shaped business across the world. Helped bring the managerial revolution to the world and now currently has the largest alumni network, with ex-McKinsey people running or holding high positions in the majority of the fortune 500 companies." >}}

{{< book
    title="The United States and the Middle East"
    author="Salim Yaqub"
    description="This is a Greats Course lecture series on Audible. I've always had a fairly deep amount of knowledge with western history but lacked historical knowledge of other cultures. The whole rise of pan-Arabism, the origin of anti-US hostility, anti-Zionism and the relation between Israel and the other states, the history of colonial european powers in the area, and the dynamic the cold war played are things I think are necessary to know to understand the last century of conflicts with this part of the world." >}}



## [2022 | Age 19]
---
{{< book
    title="A Beautiful Mind"
    author="Sylvia Nasar"
    description="This is a biography of the mathematician John Nash. He produced great work in multiple areas of mathematics but you probably have heard of him from Game Theory via the Nash Equilibrium. He suffered from Schizophrenia and lost a large chunk of his productive life due to it. Started off incredibly smart and promising, slowly lost the ability to reason, and then gained it back. Sad in its own way. By then much of his life had passed him by. He still produced work but his golden years had passed. Always reminds me to not take the time I have today for granted.">}} 

{{< book
    title="How Markets Fail"
    author="John Cassidy"
    special="true"
    description="This book was excellent and very broad in scope. Talked about the economic theories of Keynes, Friedman, Hayek, Minsky, and others, John Von Neumann and game theory, causes of market failures with natural occurring prisoner dilemmas, market spillovers, information failure, and many others, and dove into the events that led to the 2008 financial crisis.">}} 

{{< book
    title="The Lost Bank"
    author="Kristen Grind"
    description="This was a great telling of the story and history of Washington Mutual, the largest bank failure in U.S. History. It goes through the 132-year history of the bank and goes into great detail about option adjustable-rate and sub-prime loans.">}} 

{{< book
    title="Masters of DOOM"
    author="David Kushner"
    special="true"
    description="I've always been a massive fan of John Carmack. The paragon of the engineer, of competence itself. This story goes over the entire video game arc of him and John Romero. The ingenious of Carmack for every game engine he developed was otherworldly. Once in a generation mind.">}} 

{{< book
    title="Blitzed: Drugs in the Third Reich"
    author="Norman Ohler"
    special=""
    description="Wild. Definitely changes the way I look at what I read in The Rise And Fall Of The Third Reich." >}}

{{< book
    title="Flash Boys"
    author="Michael Lewis"
    special="true"
    description="This book covers the rise of high-frequency trading firms and the absurd length they went to gain a speed advantage over others and how they were making billions of dollars risk-free by front-running everyone else's trades. Absolutely insane that nothing happened to these guys.">}} 

{{< book
    title="The Machiavellians"
    author="James Burnham"
    description="">}} 

{{< book
    title="Human Nature"
    author="Robert Greene"
    description="">}} 

{{< book
    title="The Lessons Of History"
    author="Will & Ariel Durant"
    description="">}} 

{{< book
    title="Atlas Shrugged"
    author="Ayn Rand"
    special="true"
    description="I did love Ayn Rand's novels. I think I did prefer 'The Fountainhead' for the most part, but this story does a great job at appealing to the ideal side of humanism.">}} 

{{< book
    title="The Road To Serfdom"
    author="F. A. Hayek"
    description="">}} 

{{< book
    title="Zero To One"
    author="Peter Thiel"
    description="">}} 

{{< book
    title="The Fountain Head"
    author="Ayn Rand"
    special="true"
    description="Already wrote a bit about Rand for Atlas Shrugged (banger title btw). I think that this is her best work as it just solely inspires the creative side of man through the archetypal story of a hero that will complete his quest no matter what and who stays true to himself and his vision despite the world telling him that his perception of the world is incorrect.">}} 

{{< book
    title="The New Right"
    author="Michael Malice"
    description="">}} 

{{< book
    title="A People's History Of The United States"
    author="Howard Zinn"
    description="I think that this is an important book for everyone to read. I disagreed with a lot of things and the book is very heavily biased, but as Zinn points out himself, it is to give the counterview of the majority of mainstream history.">}} 



## [2021 | Age 18]
---
{{< book
    title="The Sovereign Individual"
    author="James Dale Davidson & William Rees-Mogg"
    special="true"
    description="There seems to be a trend in human history where new innovations start under a centralized institution. The internet and dozens of other innovations under the U.S. Military. Literateness used to be solely for the royal and religious sectors of society. Civilization itself, under the Egyptians, Babylonians, etc, started under a centralized power structure. As society progresses, such innovations trickle down from centralized institutions down to individuals. This book talks a lot about this past trend and tries to predict future trends from it, and most of the predictions have held out quite well.">}} 

{{< book
    title="The Origin Of Virtue"
    author="Matt Ridley"
    description="">}} 

{{< book
    title="The Rational Male"
    author="Rollo Tomassi"
    description="I've seen this book here and there for years but didn't have any idea of what it was until I finally checked it out. This is apparently the original redpill manifesto. I don't agree with this life philosophy, but I do think it does has a lot of things any young guy should be conscious of. I certainly disagree with the nihilistic hypergamous view of cross-gender relations. Underneath the 'toxic masculinity' dressing, the book just vouches for good habits and that one should look inwards for validation instead of from the people around us.">}} 

{{< book
    title="The Infinite Machine"
    author="Camila Russo"
    description="">}} 

{{< book
    title="The Bitcoin Standard"
    author="Saifedean Ammous"
    description="">}} 

{{< book
    title="Beyond Order"
    author="Jordan B. Peterson"
    description="I used to be a big Jordan B. Peterson fan when I was younger. I liked his earliest stuff with his Maps of Meaning and Biblical Series. I do enjoy the talks about morality and philosophy. I've listened to the majority of content he had produced up to 2020 and have found much of the new to be a rehash of the old. I saw him give a lecture in Austin, his first public tour in a couple of years. It was all stuff I've already heard him say in the hundreds of hours I've listened to him. I feel like that's how this book felt to me.">}} 

{{< book
    title="Colonel Roosevelt"
    author="Edmund Morris"
    special="true"
    description="">}} 

{{< book
    title="21 Lessons For The 21st Century"
    author="Yuval Noah Harari"
    description="">}} 

{{< book
    title="Homo Deus"
    author="Yuval Noah Harari"
    special="true"
    description="">}}

{{< book
    title="Life 3.0"
    author="Max Tegmark"
    description="">}}

{{< book
    title="The Nuremberg Trials"
    author="Paul Roland"
    description="">}}

{{< book
    title="Give Me Tomorrow"
    author="Patrick K. O'Donnel"
    description="">}}

{{< book
    title="In The Shadows Of The American Century"
    author="Alfred W. McCoy"
    description="">}}

{{< book
    title="How The Internet Happened"
    author="Brian McCullough"
    description="">}}

{{< book
    title="Up From Slavery"
    author="Booker T. Washington"
    description="">}}

{{< book
    title="Bury My Heart At Wounded Knee"
    author="Dee Brown"
    description="">}}

{{< book
    title="Super Intelligence"
    author="Nick Bostrom"
    special="true"
    description="">}}

{{< book
    title="About Face"
    author="David H. Hackworth"
    special="true"
    description="">}}

{{< book
    title="All Quiet On The Western Front"
    author="Erich Maria Remarque"
    special="true"
    description="">}}

{{< book
    title="Sapiens"
    author="Yuval Noah Harari"
    special="true"
    description="">}}

{{< book
    title="American Ulysses"
    author="Ronald C. White"
    description="">}}

{{< book
    title="Theodore Rex"
    author="Edmund Morris"
    special="true"
    description="">}}

{{< book
    title="Haroun And The Sea Of Stories"
    author="Salman Rushdie"
    description="">}}

{{< book
    title="The Power Broker"
    author="Robert Caro"
    special="true"
    description="">}}

{{< book
    title="Endurance: Shackleton's Incredible Voyage"
    author="Alfred Lansing"
    description="">}}

{{< book
    title="Surely You're Joking, Mr. Feynman"
    author="Richard Feynman"
    description="">}}

{{< book
    title="The Great Gatsby"
    author="F. Scott Fitzgerald"
    description="">}}

{{< book
    title="The Rise Of Theodore Roosevelt"
    author="Edmund Morris"
    special="true"
    description="">}}

{{< book
    title="Atomic Habits"
    author="James Clear"
    special="true"
    description="The most important insight I got from this book was in the first 20 pages. It verbalized something that I've vaguely understood. It was the fact that your habits reinforce your identity and your identity reinforces your habits. If you wake up early, you probably identify as a morning person. Because you identify as a morning person, there's much less cognitive friction in waking up early. It's just *who you are*. It's just *what you do*. Anytime I want to make a positive change in my life, I try to just become someone that does that. I want to get good at math? I'll just dive into it and *become a math guy*. Goes for anything.">}} 

{{< book
    title="Brave New World"
    author="Aldous Huxley"
    special="true"
    description="">}}

{{< book
    title="Alice In Wonderland"
    author="Lewis Carroll"
    description="">}}

{{< book
    title="The Rise And Fall Of The Third Reich"
    author="William L. Shirer"
    special="true"
    description="">}}



## [2020 | Age 17]
---
{{< book
    title="Memories, Dreams, Reflections"
    author="Carl Jung"
    description="">}}

{{< book
    title="Ecce Homo"
    author="Fridrich Nietsche"
    description="">}}

{{< book
    title="Benjamin Franklin"
    author="Walter Isaacson"
    description="">}}

{{< book
    title="The Alchemist"
    author="Paulo Coelho"
    description="">}}

{{< book
    title="Crime And Punishment"
    author="Fyodor Dostoevsky"
    special="true"
    description="">}}

{{< book
    title="The Things They Carried"
    author="Tim O'Brian"
    description="I really liked this book. I'm always been a big fan of vietnam media like Full Metal Jacket and Apolalypse Now (which is just Conrad's The Heart Of Darkness told in a modern setting). It's fascinating because these stories always delve into the minds of men who were thrown into unthinkable circumstances but who are quite relatable. WW2 and every war before seems as if it is from a distant time, but Vietnam, it is actually comprehensible how we went from there to now.">}} 

{{< book
    title="Notes From The Underground"
    author="Fyodor Dostoevsky"
    special="true"
    description="">}}

{{< book
    title="A Short History Of Nearly Everything"
    author="Bill Bryson"
    special="true"
    description="">}}

{{< book
    title="The Compound Effect"
    author="Darren Hardy"
    description="">}}

{{< book
    title="Beowulf"
    author="Ancient Tale"
    description="">}}

{{< book
    title="Animal Farm"
    author="George Orwell"
    description="">}}

{{< book
    title="The Coddling Of The American Mind"
    author="Greg Lukianoff & Jonathan Haidt"
    description="">}}

{{< book
    title="The Boys In The Boat"
    author="Daniel James Brown"
    special="true"
    description="My high school cross country coach, Bob Miller, brought up this boat. A beautiful story of a group of young boys sacrificing for something greater than themselves. Truly one of the most special moments a human can experience. One day I wish to do the same.">}} 

{{< book
    title="Bad Blood"
    author="John Carreyrou"
    description="">}}

{{< book
    title="The 50th Law"
    author="Robert Greene & 50 Cent"
    description="">}}

{{< book
    title="AI Superpowers"
    author="Kai-Fu Lee"
    special="true"
    description="">}}

{{< book
    title="The Autobiography Of Ben Franklin"
    author="Ben Franklin"
    description="">}}

{{< book
    title="Can't Hurt Me"
    author="David Goggins"
    description="">}}

{{< book
    title="The Denial Of Death"
    author="Ernest Becker"
    special="true"
    description="">}}



## [2019 | Age 16]
---
{{< book
    title="The Tipping Point"
    author="Malcom Gladwell"
    description="">}}

{{< book
    title="Talking To Strangers"
    author="Malcom Gladwell"
    description="">}}

{{< book
    title="Elon Musk"
    author="Ashlee Vance"
    description="">}}

{{< book
    title="Man's Search For Meaning"
    author="Viktor E. Frankl"
    special="true"
    description="">}}

{{< book
    title="The River Of Doubt"
    author="Candice Millard"
    special="true"
    description="">}}

{{< book
    title="Rich Dad Poor Dad"
    author="Robert Kiyosaki"
    description="">}}

{{< book
    title="Be Obsessed Or Be Average"
    author="Grant Cardone"
    description="">}}

{{< book
    title="The Art Of War"
    author="Sun Tzu"
    description="">}}

{{< book
    title="Steve Jobs"
    author="Walter Isaacson"
    special="true"
    description="">}}

{{< book
    title="The Snowball"
    author="Alice Schroeder"
    special="true"
    description="">}}

{{< book
    title="The Art Of Seduction"
    author="Robert Greene"
    description="">}}

{{< book
    title="E-Myth Revisited"
    author="Michael Gerber"
    description="">}}

{{< book
    title="Andrew Carnegie"
    author="David Nasaw"
    special="true"
    description="">}}

{{< book
    title="The Selfish Gene"
    author="Richard Dawkins"
    special="true"
    description="">}}

{{< book
    title="Alexander Hamilton's Guide To Life"
    author="Jeff Wilser"
    description="">}}

{{< book
    title="Managing One's Self"
    author="Peter Drucker"
    description="">}}

{{< book
    title="The Curious Incident Of The Dog In The Night"
    author="Mark Haddon"
    description="">}}

{{< book
    title="Mango Street"
    author="Sandra Cisneros"
    description="">}}

{{< book
    title="Explosive Growth"
    author="Cliff Lerner"
    description="">}}

{{< book
    title="Smarter, Faster, Better"
    author="Charles Duhigg"
    description="">}}

{{< book
    title="12 Rules For Life"
    author="Jordan B. Peterson"
    special="true"
    description="">}}



## [2018 | Age 15]
---
{{< book
    title="The Richest Man In Babylon"
    author="George S. Clason"
    special="true"
    description="">}}

{{< book
    title="How To Win Friends And Influence People"
    author="Dale Carnegie"
    description="">}}

{{< book
    title="Blink"
    author="Malcom Gladwell"
    description="">}}

{{< book
    title="Drop Out And Get Schooled"
    author="Patrick Bet-David"
    description="">}}

{{< book
    title="Exactly What To Say"
    author="Phil M. Jones"
    description="">}}

{{< book
    title="Unlimited Memory"
    author="Kevin Horsley"
    description="">}}

{{< book
    title="The 1 Page Marketing Plan"
    author="Allan Dib"
    description="">}}

{{< book
    title="Flowers for Algernon"
    author="Daniel Keyes"
    description="">}}

{{< book
    title="Sell Or Be Sold"
    author="Grant Cardone"
    description="">}}

{{< book
    title="The Power Of Habit"
    author="Charles Duhigg"
    description="">}}



## [2017 | Age 14]
---
{{< book
    title="To Kill A Mockingbird"
    author="Harper Lee"
    description="">}}

{{< book
    title="Unbroken"
    author="Laura Hillenbrand"
    description="">}}

{{< book
    title="1984"
    author="George Orwell"
    description="">}}

{{< book
    title="Mastery"
    author="Robert Greene"
    special="true"
    description="">}}

{{< book
    title="Excellent Sheep"
    author="William Deresiewicz"
    description="">}}

{{< book
    title="Of Mice and Men"
    author="John Steinbeck"
    special="true"
    description="">}}

{{< book
    title="The Giver"
    author="Lois Lowry"
    description="">}}



## [2016 | Age 13]
---
{{< book
    title="The 48 Laws Of Power"
    author="Robert Greene"
    special="true"
    description="">}}

<br>

> "The average person puts only 25% of his energy and ability into his work. The world takes off its hat to those who put in more than 50% of their capacity, and stands on its head for those few and far between souls who devote 100%" - Andrew Carnegie

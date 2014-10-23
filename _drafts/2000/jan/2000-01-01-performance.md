---
layout: post
title: "Are You a Hacker or a Designer?"
date: 2000-01-01
tags: mgmt programming
description:
  Twenty years ago we worried about performance. Now
  it is time to worry about maintainability, even though
  it often compromises performance.
keywords:
  - performance vs maintainability
  - software performance
  - scalability
  - maintainability
  - readability
---

Twenty years ago, the best programmer was the one
capable of fitting an entire application into a 64Kb
`.COM` file. Those who were able to get the most out of
that poor Intel 80386 were the icons of programming.

That's because twenty years ago computers were expensive and programmers
were cheap. That was the time of the "hacker mentality".
That time is over. That mentality is not appreciated any more,
because the market situation is completely opposite.

Today, computers are cheap and programmers are expensive.
This is the era of the "designer mentality", when the readability
of our code is much more important than its performance.

<!--more-->

## Prices vs Salaries

{% badge /images/2014/10/trends.png 300 %}

Look at this graph. It is a comparison of two trends over the
last twenty years (1994-2014).
The first trend falls down and shows how much cheaper
[computer memory](http://www.jcmit.com/memoryprice.htm)
and [HDD storage](http://ns1758.ca/winch/winchest.html)
have become over the last twenty years.

The second trend demonstrates how much software developers' salaries
escalated over the same period. More accurately, they tripled. I didn't find
an official report about that, but I'm sure it's no secret to anyone
that the salaries of programmers keep growing &mdash; $200,000 per year for
a senior developer is not a dream any more... while twenty years
ago $60K was the best offer around. I found
[this article](http://markcunningham91.blogspot.com/2013/05/a-history-of-offers-to-software.html)
very interesting about this very subject.

Basically, this means that in order to create a PHP website
in 1994 we had to spend 1000 times more on hardware and three times
less on programmers than we do now, in 2014. And we're talking about the
same stack of technologies here. The same Linux box with an Apache HTTP Server
inside.

The difference is that in 1994, if our application had performance problems because of
hardware limitations, we paid $35,000 per each additional gigabyte of RAM, while
in 2014 we pay $10.

In 1994 it was much more efficient to hire more programmers and ask
them to [optimize](https://en.wikipedia.org/wiki/Program_optimization)
the code or even rewrite it, instead of buying new hardware. In 2014 the
situation is exactly the opposite. It is now much cheaper to double the
size of the server (especially if the server is a virtual cloud one)
instead of paying salaries for optimizing the software.

In 1994 the best engineers had that "hacker mentality", while in 2014 the
"designer mentality" is much more appreciated.

## Hacker Mentality

Someone with a hacker mentality would call this
[Fibonacci](https://en.wikipedia.org/wiki/Fibonacci_number)
Java method an "elegant code" (would you?):

{% highlight java %}
public int f(int n) { return n>2?f(n-1)+f(n-2):1; }
{% endhighlight %}

I would highlight these qualities of a good
[hacker](https://en.wikipedia.org/wiki/Hacker_%28computer_security%29):

 * uses all known (and unknown) features of a programming language
 * discriminates others as hackers and newbies and writes for hackers
 * gets bored and frustrated by rules and standards
 * doesn't write unit tests &mdash; juniors will write them later
 * enjoys fire-fighting &mdash; that's how his talent manifests
 * prefers talks over docs, since they are much more fun
 * hates to see his code being modified by someone else
 * likes to dedicate himself to one project at a time

A hacker is a talented individual. He wants to express his
talent in the software he writes. He enjoys coding and does
it mostly for fun. I would say, he is married to his code and can't imagine
its happy life after an eventual divorce. Code ownership is
what a hacker is about &mdash; he understands himself as an "owner"
of the code.

When I ask one of my hacker friends &mdash; "How will someone understand
what this code does?" I almost always hear the same answer &mdash;
"They will ask me!" (usually said very proudly, with a sincere smile).

## Designer Mentality

Someone with a designer mentality would refactor the code above
to make it easier to read. He would call this Java function an "elegant code"
(how about you?):

{% highlight java %}
public int fibo(final int pos) {
  final int num;
  if (pos > 2) {
    num = fibo(pos - 1) + fibo(pos - 2);
  } else {
    num = 1;
  }
  return num;
}
{% endhighlight %}

I think these qualities can be attributed to a good designer:

 * tends to use traditional programming techniques
 * assumes everybody is a newbie and writes accordingly
 * enjoys setting rules and following them
 * prefers docs over talks and automation over docs
 * spends most of his coding time on unit tests
 * hates fire-fighting and working over time
 * loves to see his code being modified and refactored
 * works with a few projects at the same time

A designer is a talented team player. He contributes to the team
processes, standards, rules, education, and discipline as much as he
contributes to the source code. He always makes sure that once
he leaves the project his code and his ideas stay and work.

The highest satisfaction for a good designer
is to see his code living its own life &mdash; being modified, improved,
refactored and eventually retired. A designer sees himself as a parent
of the code &mdash; once it is old enough to walk and talk, it has
to live its own life.

## The Future

If you consider yourself a hacker, I believe it's time to change. The time of
hackers is fading out.

In the near future we will probably even stop thinking in terms of "hardware" and will
run our applications in elastic computational platforms with unlimited
amounts of memory, CPU power and storage space. We will simply pay
for resource utilization and almost any performance issue will just add a few extra
dollars to our monthly bills. We won't care about optimization any more.

At the same time, good software engineers will become more and more expensive
and will charge $500+ per hour just to check out software and give
a diagnosis. Just like good lawyers or dentists.

That's why, while developing a new software product, those who pay for it will
care mostly about its maintainability. Project sponsors will
understand that the best solution they can get for their money is
the one that is the most readable, maintainable, and automated.

Not the fastest.
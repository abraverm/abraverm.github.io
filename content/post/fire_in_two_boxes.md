+++
categories = ["UI", "system"]
date = "2017-05-24T21:35:35+03:00"
description = "Browser and terminal symbioses"
draft = false
images = []
publishdate = "2017-05-24T08:05:46+03:00"
tags = ["browser", "terminal", "firefox", "googler", "docker"]
title = "Who needs browser anyway"
toc = false

+++

## Prologue

It all started with thinking "If I can just run Firefox in Tmux pane, that
would be great..."

![great](/images/meme_great.jpg)

And I really tried to look for something worthy of my needs, but in vein.
After long searching and wondering what I want, is basically have Firefox
X window rendered somehow in CLI. Like one of the ASCII art thingy but
continuously, maybe avoiding pictures or videos. Well, I found [TextTop][1]
but I haven't tried it and the video doesn't seem promising to me. I need to
have a clear text.

Why? 90% of my work I spent in those two places, why not make it one?
Easier context switching, workflow automation and maybe much more.
But it can't really be done without Firefox or any modern browser major
functionalities, such as plugins, web rendering with Javascript. Its amazing
how much we rely on this functionalities on our daily web browsing.
If you don't believe me, try for yourself w3m and links cli browsers.

## Change of view

I didn't gave up, just changed the approach a bit. When I thought about it,
there are some regular domains that I visit, For example Stack-overflow and
Google. So what if I minimize my needs of a browser to specific situations where
the terminal can't handle it without overhead. I searched the web and found two
potential tools:

 - [googler][2] - Google Site Search from the command-line
 - [socli][3] - Stack Overflow command line written in python

I do a lot of searches, if it of errors or general subject. I was hoping with
this tools I will be able to do it faster and easier. In reality, googler is
slow to start and socli does generic questions only, that is searching for
errors won't work. Another problem that I encountered at the beginning was how
to open URL with the right profile in Firefox?

I have two Firefox profiles, one for work and another for home. So when I use
googler I want to send the found result to the right profile. But when you have
two Firefox profiles open, it means one of them was started with `no-remote`
option: `--no-remote        Do not accept or send remote commands;`. Which means
that only one Firefox profile can receive URL links from external program like
googler. I hate that programs try to limit me in such stupid ways.
I got triggered, and started working on a solution.

## Firefox in a box

When I say box, I mean container, Docker container. Why? Because then Firefox
doesn't know about other processes beside him, he is in a box!

It ain't hard running [Firefox in a container][4], the problem is getting
everything else to work with it:

 - Fonts
 - Vimperator scripts
 - Flash
 - Special plugins like Spice
 - Password management
 - Sound
 - Downloads
 - Kerberos
 - GPG

And then you have bugs, like why I can't forward online videos.
I don't have a magical Dockerfile that solve all the problems, but I can say it
works good enough for me.

After lunching the two different Firefox instances, came another annoying issue,
how to tell googler which Firefox to send the URL to?
Well the documentation says use `BROWSER` environment variable, but it work-ish.
I was able to tell googler to open the links with w3m but it continued opening
the same Firefox instance. During my try-error-search process, I stumbled on
'sensible-browser' tool that looks like was the default tool in Ubuntu for
finding a browser in the system, and one of the ways to overwrite it was set
`BROWSER` environment variable. I did a wrong 1+1, and installed sensible-browser.
It didn't help... Then I thought "maybe... just maybe.. googler doesn't like
when you pass option to BROWSER". I mean, I was trying to run this command:

`docker exec -d firefox_work firefox -P work`

And it works fine from CLI, so why not from a program. The reason I thought this
might be the root cause is the past experience in Vimperator when I tried
running such command in Javascript. Hint: They don't like it.

So I did a stupid script `~/bin/dfirefox_open_work`:
```bash
#!/bin/bash
docker exec -d firefox_work firefox -P work $@
```

Walla! it works...

## Googler

From here it was just semantics. Now I have two commands for googler so I can
lunch URL in the right Firefox. Since then, I almost didn't use the command.
Reasons:

- slow to start but works fast when up =\
- It doesn't highlight the words in the results, which makes it visually harder
  to determine the quality of the link
- It could've been nice to have more lines from each result
- Very important - I don't know if I already visited that page

I wished I could've had a minimal version of the site, without all the menus
and other affects, just to have the gist of it, like Firefox read mode.
When I wrote this, I said "why not", and started digging. So there is a
readability mode in Firefox, and there is a service to do it called [Mercury][6].
I found a [script][7] that creates an HTML file from Mercury API call. With
it I created my own script:

```bash
#!/bin/bash
tmpfile=$(mktemp /tmp/mercury.XXXXXX.html)
$HOME/bin/mercury_parse.py --url $@ --htmlfile $tmpfile
w3m $tmpfile
rm -rf $tmpfile
```

Surprisingly it worked well with googler. But after a bit of testing, I found
I don't like the way most pages look like in w3m, and not in any of the CLI
browsers ( lynx, links2 end elinks). My brain is hard wired to read formatted
pages in modern browsers. I can't really expect any service to parse web pages
to really good CLI formats such as VIM help or even man pages.

## The future

The only way I can now imagine to be productive is to keep the level of
format and have it in terminals and shells too. But this really a new territory
that people just starting to explore, for example:

 - [NGS](https://github.com/ilyash/ngs) - Create a language that will be
 domain-specific for system tasks (interesting )
 - [TermKit](https://github.com/unconed/TermKit) -  Experimental Terminal
 platform built on WebKit + node.js which was [abandoned][8].
 - [Hyper](https://hyper.is/) - JS/HTML/CSS Terminal (I will give it a try)
 - [Black Screen](https://github.com/railsware/black-screen) - Black Screen is
 an IDE in the world of terminals. Also works on JS, HTML and CSS. (maybe)
 - [xiki](http://xiki.org/) - A shell console with GUI features

So I think I finished with bringing new technology to old and try moving
forward.

[1]: https://github.com/tombh/texttop
[2]: https://github.com/jarun/googler
[3]: https://github.com/gautamkrishnar/socli
[4]: https://github.com/abraverm/docker-images/tree/firefox
[6]: https://mercury.postlight.com/web-parser/
[7]: https://gist.github.com/tanimislam/7f36db977ffd254691840ca14534e5b2
[8]: https://www.reddit.com/r/programming/comments/137kd9/18_months_ago_termkit_a_nextgeneration_terminal/

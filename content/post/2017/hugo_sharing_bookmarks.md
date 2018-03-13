+++
categories = ["blog", "development", "todo"]
date = "2017-05-27T13:41:05+03:00"
description = "How to share bookmarks from Pocket in Hugo"
draft = false
images = []
publishdate = "2017-06-10T17:11:35+03:00"
tags = ["pocket","hugo","github","ifttt", "huginn", "xpra"]
title = "Hugo sharing bookmarks"
toc = false

+++

One the reasons I've started a blog is to have a place to record my journey and
adventures. Each post is a record of what I've done. This is mostly for myself,
as sometimes I get back to same point doing a different path and its nice to
mark those points. Part of an adventure is a lot of browsing and learning of
new things. Some of the gems I find are not related to the subject in matter,
but non the less I want to save it for other time. I end up with huge pile of
open tabs in Firefox. Which right now I manage with tab groups and smart key
bindings but its really not such a good system. Also I want to share those gems
just as much as my posts, but not all of them fit in. But today I think I found
something that might work.

My wife asked me about how I manage my tasks and personal thoughts, so I told
her about Vim-wiki. She is not a Vim user, so I just showed her how a personal
wiki works for me. Next, she decides that its only true to give me back her gem
of productivity and gives me introduction to [Pocket][1]. I've noticed this
[Pocket thingy in newer versions of Firefox][2], but I didn't give it a lot of
thought. After showing it to me, I thought "Is there a way I can share the things
in my pocket". Quick web search gave me [this little amazing gem][3]. I was
amazed as it was exactly what I wanted.

[Jessica Lord][4] created amazingly simple solution that creates:

 > "A website for your Pocket article archive. Fork-n-Go set up."

![aww](/images/meme_aww.jpg#floatright)
Using IFTTT, you stream the saved web sites in Pocket to a Google sheet, and
her amazing repository just parse the Google sheet into a cool web site.
The instructions are in the Readme, and it was pretty simple to setup.
The only problem, IFTTT doesn't work :(. I've tried their documentation and even
mailing them, all I got is "we are too busy for you". So I took a pick at
Zapier, alternative to IFTTT. They to have support for Pocket and Google sheets,
but they get each article tags a separate fields, which is useless to me and
all their internal utilities didn't help. I started looking for other alternative
services, but non support Pocket. I was annoyed even more so I went for my own
open source service, [Huginn][6]. I know its probably doesn't support Pocket
out of the box, but fuck it, I will write extension and share it with awesome
people who use it. But damn... neither Pocker or Google drive are supported.

I was excited with the idea (before IFTTT failed me) and started adding bookmarks,
but the new problem I encountered was how do I tag them right?

For example, yesterday I stumbled on [Xpra][5] when trying to solve
the sound issue I have with my containerized Firefox. I noticed that some people
use Xpra instead of sharing host resources with the container - interesting.
But after reading what Xpra does, it seems to me like a neat tool I can utilize
for other purposes, but at least have it as alternative for NX, VNC 
and X forwarding. So what tags should I give it?

docker, remote desktop, remote application, X, persistent

Look at those tags, they don't do justice with Xpra awesomeness, its like a bad
CV. Also what if I have a bookmark I want to relate both, the only option I
can think of is using 'xpra' tag.

It came to my mind I need to make a new type of content in my blog: Ideas.
Then bookmarks will have the idea as their tag too, this can give more
information about the bookmark and have references for the idea.

Anyway until I will have new interest in Huginn or IFTTT will start working or
something, I'm going to leave this in the todo category.


[1]: https://getpocket.com
[2]: https://blog.mozilla.org/blog/2017/02/27/mozilla-acquires-pocket/
[3]: http://jlord.us/sheetsee-pocket/
[4]: https://github.com/jlord
[5]: https://en.wikipedia.org/wiki/Xpra
[6]: https://github.com/huginn/huginn

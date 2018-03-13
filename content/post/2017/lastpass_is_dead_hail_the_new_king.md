+++
categories = ["UI", "system", "security", "development"]
date = "2017-05-26T21:34:15+03:00"
description = "How I stopped worrying about CPU and found peace with Pass"
draft = false
images = []
publishdate = "2017-05-26T21:36:51+03:00"
tags = ["firefox", "gpg", "vimperator", "pass"]
title = "LastPass is dead! Hail the new manager"
toc = false

+++

About two weeks ago LastPass Firefox plugin was updated and I started to notice
that Firefox is taking much more resources. We all know that the browser is a
heavy cow on the system, and now its a cow with a wagon. My beast laptop,
ThinkPad W541, handled it without sweat with a bit of struggle on
cold start and restoring large sessions.
I didn't think about it too much until I was trying to put [Firefox in
a container][0], which required lots of restarts. Every cold restart Firefox
was asking about hanging javascript from the lovely  LastPass. And guess what,
when I disabled LastPass Firefox became blazing fast, like a running bull.
So I left it disabled and didn't think about it too much.

![](/images/wondering_meme.png#floatright)
Fortunately, few days later I was working on a new deployment and needed a
place to store and share passwords. I was wondering why can't we share passwords
with Git or something, where there is no need in a dedicated server.
After short search I found [GoPass][1] which was exactly what I was looking for.
Now, GoPass is based on more popular tool called [pass][2], and it has support
for Firefox... and it can import passwords from LastPass...

Go back, what is `pass`:

> Password management should be simple and follow Unix philosophy. With pass,
each password lives inside of a gpg encrypted file whose filename is the title
of the website or resource that requires the password. These encrypted files
may be organized into meaningful folder hierarchies, copied from computer to
computer, and, in general, manipulated using standard command line file
management utilities.

What is `gopass`:

> The slightly more awesome Standard Unix Password Manager for Teams. Written
in Go.

Theoretically you can use `pass` for shared passwords, but `gopass` does it much
easier. To get started you can follow these guides:

 - [pass detailed example][3]
 - [GPG quick start][4]
 - [GPG for Daily Use][5]
 - [Gentroo GnuPG wiki][12]
 - [Arch GnuPG wiki][13]

I was excited, and started migrating from LastPass, when I remembered there is
[automation for it][6]. But damn, it doesn't work with `gpg-agent` for some
unknown hellish reason. And I had more than 300 passwords(?!). So the script
kept asking me for password to open my GPG key, and its pretty long to type.
First I thought "well this is a case for ops", and starting shift-inserting my
password. After 20 imports I gave up. Next I developed a `expect` script, which
BTW took __longer than the ops approach__. Anyway, if you encounter this
problem, here is the script:

```
Fuck! I lost it...
Good luck to you ;)
```

Finally I got all most all of my password in `pass`, victory!
Now... how I'm using it in my containerized Firefox?

1. Install gpg inside the container `RUN dnf install -y gnupg`
2. I will probably need pass in it too `RUN dnf install -y pass`
3. Add the Firefox plugin [PassFF][7]

That's it, should work out of the box. In your dreams...

PassFF listed all the credentials but unable to get them. Tried another plugin
for Firefox - [Browserpass][8] - no luck. Step back, `docker exec -it
firefox_Personal2 bash` and  `pass github.com` asking for GPG password.

Not this again...

OK. Let's share the GPG agent with the container:
`/run/user/1000/gnupg/S.gpg-agent`, no luck, and 'yes' I made sure to connect
to the agent `gpg-connect-agent /bye`. For some reason, gpg-agent in the
container created a socket in `~/.gnupg/`. I tried so many things and
googled the shit out of it. And then I found it!

![facepalm](/images/Computer-Guy-Facepalm.jpg#floatleft)
The problem was with `gpg` command, while works fine with `gpg2`. And what about
pass? [pass prefers gpg2][10], why isn't it working?

**Because `which` is not installed in fedora containers.**


The last problem is one that I actually thought off during all the testing, was
how to enter the password for GPG key the first time?
The answer lies in gpg-agent 'pinentry-program' setting, I've installed
`pinentry-gtk` package and set the program to `/usr/bin/pinentry`. I also
changed the TTL to something reasonable. The final result looks like
this  `~/.gnupg/gpg-agent.conf`:

```
default-cache-ttl 999999
max-cache-ttl 999999
pinentry-program /usr/bin/pinentry
allow-loopback-pinentry
```

![gaze](/images/pc_gazing_meme.jpg#floatright)
Now pass works from shell. Going back to Firefox, and... it still doesn't work.

> sigh

Well I can try to make this plugin work, but do I really need it?
I mean, anyway I wanted to make LastPass work with Vimperator, maybe there is
a script for pass, geeky enough, no?

Well there is no such script, but it shouldn't be too hard. Just to make sure,
I searched the web, and I found [something close for 'keyring' tool][9].
So I did some manipulations to it and [ta-dam!][11]
I have pass working from Firefox with Vimperator!

[0]: https://abraverm.github.io/post/fire_in_two_boxes/
[1]: https://github.com/justwatchcom/gopass
[2]: https://www.passwordstore.org/
[3]: https://git.zx2c4.com/password-store/about/#EXTENDED%20GIT%20EXAMPLE
[4]: https://www.madboa.com/geek/gpg-quickstart/
[5]: http://moser-isi.ethz.ch/gpg.html
[6]: https://git.zx2c4.com/password-store/tree/contrib/importers/lastpass2pass.rb
[7]: https://addons.mozilla.org/en-US/firefox/addon/passff/
[8]: https://addons.mozilla.org/en-US/firefox/addon/browserpass/
[9]: https://github.com/ervandew/keyring/blob/master/vimperator/plugin/keyring.js
[10]: https://github.com/zx2c4/password-store/blob/master/src/password-store.sh#L12
[11]: https://gist.github.com/abraverm/9ff7599cd89c2b316483dec13172ab85
[12]: https://wiki.gentoo.org/wiki/GnuPG
[13]: https://wiki.archlinux.org/index.php/GnuPG

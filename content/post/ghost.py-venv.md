+++
categories = ["development"]
date = "2017-05-07T14:49:15+03:00"
description = "Make Ghost.py work from Python virtual environment"
draft = false
tags = ["python","ghost.py","virtualenv","best-practise","workaround"]
title = "ghost.py venv"
toc = false

+++

I'm not a professional programmer, and Python is just a tool to GTD. But I also
hate doing things sloppily, especially when I think it something I will have to
get back to in the future. So when I started working on a long term solution
I wanted to do it right. For me, modern open source project must avoid
[dependency hell][2] at any stage of project life cycle. In development it
means to use isolated, easy to manage environment. Python has a known tool for
that called [virtualenv][4]. And naturally when I started working on my small
project, I created an environment with virtualenv. However, [Ghost.py][6],
one of the libraries I wanted to use, decided it doesn't going to play a long.

The innocent steps of a noob following [documentation][5]:
``` bash
mkvirtualenv my_project
workon my_project
pip install Ghost.py
python -c "from ghost import Ghost"
```

> I use IPython to play with libraries but why over complicate a post.

And what did I got?

```bash
ImportError: No module named QtWebKi
```

> Gods of development really love me... while I'm writing this post, I'm
verifying my steps and what do you know, the issue is not reproducable
in a Docker container -\_-'

sigh... I hate when your first step is falling.

The next step is so boringly common - Google it. My first search was what are
Ghost.py dependencies. Sometimes, maintainers don't enforce the dependency during
deployment and wait for the user to read their
[documentation][1].

> Now I noticed my own stupidity, the documentation asks for PySide2, while
I did something else and made things worse.

I installed PySide, it was easy but took a long time:

```bash
pip install pyside
```

To my disappointment the issue persisted. My next Google queries took me to
unexpected journey:

 - [Ghost.py issue 168](https://github.com/jeanphix/Ghost.py/issues/168)
 - [Ghost.py issue 162](https://github.com/jeanphix/Ghost.py/issues/262)
 - [Stackoverflow 1](http://stackoverflow.com/questions/32701784/centos-7-python-importerror-cannot-import-name-qtwebkit-even-though-its-in-my)
 - [Stackoverflow 2](http://stackoverflow.com/questions/29523541/importerror-no-module-named-pyqt4-qtwebkit)
 - [Ubuntu forums](https://ubuntuforums.org/showthread.php?t=2253348)

> OK, it seems the issue is a bit reproducable,  but I'm still confused how I
got in that mess.

All the links suggest other library is involved, PyQt. And I thought maybe
installing it will solve my issues. Guess what...

**You can't install PyQt with Pip(?!) in virtualenv**

This seems to be a known fact:

 - [Stackoverflow](http://stackoverflow.com/questions/1961997/is-it-possible-to-add-pyqt4-pyside-packages-on-a-virtualenv-sandbox)
 - [Ninjas](http://amyboyle.ninja/Python-Qt-and-virtualenv-in-linux)

It started to annoy me, I just want to play a bit with Ghost.py, there are other
options out there. Why do I even bother?! does it really worth my time?! is that
makes me happy?!

Well... I didn't like any of the solutions out there, but linking the os package
into the environment seemed to me the easiest path to go with. I used one of the
[scripts][3] in the searches for
doing it (maybe another tool for the box). You know what?

It didn't work.

**WTF!**

> I gave this problem 60% of me, while reading on optimizing ZSH and virtualenv
workflow, and leaving for long periods to watch Sense8 new season which is
amazing.

The next day I put my thinking hat: "What if PySide and PyQT both provide
QtWebKit but for some reason Ghost.py prefers one of them?". I removed PySide
and everything worked, and I said "Huh! that worth a post on my fresh blog".
As I mentioned earlier I wanted to confirm everything in a really clean
environment like Docker container. But you know what? Ghost.py worked without
PyQt or PySide, in a virtualenv as I planned. So I removed the link to PyQt in
my development environment to investigate further, but the gods waited for that
and had good laugh on me when I saw that everything works, and I'm like

![wut](/images/meme_wut.jpg)

Just to make sure
the issue is reproducible, I installed PySide with Pip in the container, and
walla! here is the issue.

“It's a dangerous business, Frodo, going out your door. You step onto the road,
and if you don't keep your feet, there's no knowing where you might be swept
off to.” like to dependency hell, you don't want to go there.

[1]: https://github.com/jeanphix/Ghost.py#installation
[2]: https://en.wikipedia.org/wiki/Dependency_hell
[3]: https://gist.github.com/davidfraser/6555916
[4]: https://virtualenv.pypa.io/en/stable/
[5]: http://python-guide-pt-br.readthedocs.io/en/latest/dev/virtualenvs/
[6]: http://jeanphix.me/Ghost.py/

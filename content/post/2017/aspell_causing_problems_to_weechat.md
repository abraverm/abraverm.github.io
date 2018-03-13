+++
categories = ["todo"]
date = "2017-06-07T11:25:06+03:00"
description = "Weechat polluted with `EOF while looking for matching`"
draft = false
publishdate = "2017-06-10T17:17:53+03:00"
tags = ["aspell","weechat","bug"]
title = "aspell causing problems to weechat"
toc = false

+++

From time to time I see in my WeeChat window some messed up error:

`EOF while looking for matching '`

Now I already figured out that aspell is causing it, and I can disable it, but
I need it for spell checking. I thought maybe the spellchecker triggering it
in aspell somehow, but that wasn't it. Google not helping me either.
I can't reproduce this because it happens out of the blue, like apsell is
checking buffer spelling or something. I don't know. I will keep publishing
updates on this when ever I find it annoying enough to fix.


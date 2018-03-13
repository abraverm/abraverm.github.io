+++
categories = ["UI", "system"]
date = "2017-05-22T20:54:33+03:00"
description = "Keybinding to more rational and faster context switching"
draft = false
images = []
tags = ["window manager", "i3", "productivity", "linux"]
title = "i3 alternative context switch"
toc = false

+++

I like to maximize my productivity as life is short and there are so many things
I enjoy doing. My biggest enemy when I'm using the computer is to be forced
waiting for something to complete or happen. Such as a tasks that takes 2-5
minutes, or slow discussion with someone. I also hate when I'm in a hurry I get
mixed up with different desktops I have. That is each program (context) has its
own desktop in the window manager. Each desktop is numbered, so for example,
Firefox is usually at desktop number 1. I have something like 5-6 major programs
running. Switching to the right desktop number blindly and fast, can be
a challenge. Currently I use the key binding \$mod+#num. But this proved to be
clumsy over time. 

---

**Update 19/05/2017**: Today I've returned to write the post as I was busy with
possessive and hectic improvement of i3 and other stuff in my system UI.
I shoudn't have postponed my writing, bad me.

I'm trying to use a new system of keybindings for switching between
applications. The idea is to use a specific key combo to switch to target
context. For example \$mod+F will take me to Firefox. The reason I feel it will
be better, is because I will not have to remember the desktop I left things, or
find the number on my keyboard, and less chance hitting the wrong number. The
two main problems with the method are:

- I will have to get used to using the new keybindings, and I'm not sure how
easy it should be.
- I can't possible cover all possible applications out there or make it "smart"
to be usable. So I have to decide what I need to have key binding for.

My current list of "must" keybinded applications:

1. Work browser - Firefox work profile
2. Personal browser - Firefox personal profile
3. Terminal - Urxvt
4. Mail - Mutt
5. Chat - WeeChat
6. Music - Pianobar
7. Blog - custom Tmux server in Urxvt
8. Wiki - Personal Vim Wiki
9. Journal - Vim Wiki Journal

The last three probably will unite to a single Tmux server. I noticed that
I can't do so much writing during the day even if all of them open.
Maybe I should unite the Mail and WeeChat to another Tmux server...
Usage of work browser rarely collide with personal use, so fast switching
between them ain't critical.

But the most import part is to have extremly fast context switching.
Now I already have the "Windows" button mapped for all i3 bind keys, so this
causes a minor issue. How bind new keys that make sense such as "\$mod+f" for
firefox and not overlap with existing bindings like "\$mod+f" for fullscreen.
After a bit of searching online, I came across [i3 modes][1]:

> You can have multiple sets of bindings by using different binding modes. When
you switch to another binding mode, all bindings from the current mode are
released and only the bindings defined in the new mode are valid for as long as
you stay in that binding mode. The only predefined binding mode is default,
which is the mode i3 starts out with and to which all bindings not defined in
a specific binding mode belong.

That sounded to me what I was looking for, but boy... making the mode behave
like I wanted, wasn't easy:

1. It has to find the correct window: two types of Firefox instances, and multipe terminals.
2. Tell i3 to focus on that window
3. Transperent change of modes
4. Nice to have: UI friendly

## i3 finding windows
To [interact with i3][2] there is a command tool called [i3-msg][3] which to me is
easier to develop the [creteria][4] than updating i3 directly. The most common
and easiest to control creterias where 'class' and 'title':

> *class*
  Compares the window class (the second part of WM_CLASS). Use the special value
  \_\_focused\_\_ to match all windows having the same window class as the
  currently focused window.

> *title*
  Compares the X11 window title (_NET_WM_NAME or WM_NAME as fallback). Use the
  special value \_\_focused\_\_ to match all windows having the same window title as
  the currently focused window.

Now that I'm looking at it again, con_mark maybe a better option than title.
But title can be set with the program lunch, at least with terminals.
To make it work I defined all my key bindings that start applications in Urxvt
to have the argument `-title "APP_NAME"`. However it didn't go so well with
terminals that have Tmux in them. I had to tell Tmux to not update the window
title automatically, which I don't have any use for anyway in I3:
`set-option -g automatic-rename off` at ~/.tmux.conf. The end result is like
this:

```
# Pandora - F8
exec urxvt256c-ml -title "Pandora" -ls -sb -bc -e ~/bin/pianobar
for_window [class="URxvt" title="Pandora"] move to workspace 18, border none
bindsym $mod+F8 exec urxvt256c-ml -title "Pandora" -ls -sb -bc -e ~/bin/pianobar
bindsym F8 workspace 18
```

To change Firefox title required ugly workaround, an add-on - [Firetitle][5].
*Which works magically! +1 to the maintainer*. This took care of 1 and 2.
Implementing the actual mode switch took a bit of web search  and came up with
this setup:

```
set $select Firefox (H)ome, (F)irefox RedHat, (T)erminal, (W)eeChat, (M)utt, (B)log, (P)andora, (W)iki, (D)iary
mode "$select" {
    bindsym h exec --no-startup-id i3-msg '[class="Firefox" title="Home"] focus'
    bindsym f exec --no-startup-id i3-msg '[class="Firefox" title="RedHat"] focus'
    bindsym t exec --no-startup-id i3-msg '[class="URxvt" title="Terminal"] focus'
    bindsym g exec --no-startup-id i3-msg '[class="URxvt" title="WeeChat"] focus'
    bindsym m exec --no-startup-id i3-msg '[class="URxvt" title="Mutt"] focus'
    bindsym b exec --no-startup-id i3-msg '[class="URxvt" title="Blog"] focus'
    bindsym p exec --no-startup-id i3-msg '[class="URxvt" title="Pandora"] focus'
    bindsym w exec --no-startup-id i3-msg '[class="URxvt" title="Wiki"] focus'
    bindsym d exec --no-startup-id i3-msg '[class="URxvt" title="Diary"] focus'
    bindsym --release Menu mode "default"
}
bindsym Menu mode "$select"
```

The nice thing about it is that it shows in the i3-status bar the options
`Firefox (H)ome, (F)irefox RedHat, (T)erminal, (W)eeChat, (M)utt, (B)log,
(P)andora, (W)iki, (D)iary` and I'm in that mode only when Menu button is
pressed. Menu button, BTW, is that button between the right Alt and Ctrl.
The only time I need it is when I'm doing something in web browser that needs
that menu. I prefer the context switching over it.

After writing this post, I've updated the configuration to:

```
set $select Firefox (H)ome, (F)irefox RedHat, (T)erminal, (W)eeChat, (M)utt, (B)log, (P)andora, (W)iki, (D)iary
mode "$select" {
    bindsym h [class="Firefox" title="Home"] focus
    bindsym f [class="Firefox" title="RedHat"] focus
    bindsym t [class="URxvt" title="Terminal"] focus
    bindsym g [class="URxvt" title="WeeChat"] focus
    bindsym m [class="URxvt" title="Mutt"] focus
    bindsym b [class="URxvt" title="Blog"] focus
    bindsym p [class="URxvt" title="Pandora"] focus
    bindsym w [class="URxvt" title="Wiki"] focus
    bindsym d [class="URxvt" title="Diary"] focus
    bindsym --release Menu mode "default"
}
bindsym Menu mode "$select"
```

**Retrospective**:
After two weeks of usage I can't say the transition is over. The old habit of
desktop switching is still there, especially when I'm in a hurry. But when
I use it normally I noticed that my first thought is of the new key binding.
I didn't disable the desktop switching as I find it useful for loose cases.
I also noticed that some key bindings are easier to remember, such Menu-f for
work Firefox. Some bindings are just easier to push (same example).
But bindings like Menu-h, home Firefox, is just hard to push and remember.
I wish Linux just could read my mind.

[1]: https://i3wm.org/docs/userguide.html#binding_modes
[2]: https://i3wm.org/docs/ipc.html
[3]: http://build.i3wm.org/docs/i3-msg.html
[4]: https://i3wm.org/docs/userguide.html#command_criteria
[5]: https://addons.mozilla.org/en-US/firefox/addon/firetitle/


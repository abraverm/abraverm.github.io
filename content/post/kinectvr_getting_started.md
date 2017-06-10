+++
categories = ["VR"]
date = "2017-06-09T12:02:23+03:00"
description = "KinectVR on Linux"
draft = false
publishdate = "2017-06-09T16:19:47+03:00"
tags = ["kinect","nodejs"]
title = "kinectvr_getting_started"
toc = false

+++

Last week, my VR partner, Yotam showed me [KinectVR][1] as out of the box
solution for our VR setup. We are build an OpenSource based VR development
environment where every component from hardware to software is OS, with easiest
bootstrap possible. From there we want to build RPG game that will make it
realistic as possible. This is a very ambitious project, but I believe we have
a good environment for this project and it looks like a very fun project.

Anyway, we were able to run Unity on Android, which is most affordable VR gear
with easiest development platform we found. The next step was to make our body
movement traceable in the VR. There are many technologies under development but
those that are purchasable are too expansive for starting out. The cheapest
technology we thought of for body movement tracking was camera based. I knew
Kinect is well developed technology for that. And I remember from my time when
I working in robotics laboratory that its a common tool in projects.
So there are probably good SDKs for it. Just by chance I have a Kinect at home.
Thus we decided to make this work, and Yotam found the KinectVR.

Because we both want to develop with it, and we have different environment,
each will have to setup KinectVR. The problem in my case, is that I have
Linux, and KinectVR documentation is for Windows. Let see how it goes:

## Step 1: Download software and install things

Part of the setup is to have a server connected to Kinect that transmits the
movemenents. The server is 'Kinect-VR-Broadcaster', in short "broadcaster"
that is a NodeJS program. The broadcaster will probably use the Kinect SDK
to get the body movements.

Issue 1 - [Kinect official SDK][2] only works on Windows

But there is an OpenSource version of Kinect SDK - [OpenKinect][3], which
its library [libfreenect][4] is very active (last merge 7 days ago).
Maybe... but just maybe... I will be able to make the broadcaster use
libfreenect. Worst case scenerio I will make my first contribution for open
source VR project. Getting prepared, and made a [fork][5] of our broadcaster.

Issue 2 - KinectVR shallow clone is 425 MB (!!). This is not source code per
say. It seems the project contains many compiled libraries, which I'm not
sure are very legal. Issue 3 (?).

It looks like Unity will be connecting to the Kinect SDK and not NodeJS.
I'm not sure what I feel about this. Continue with the documentation:
Starting Unity and loading the project. Looks ok-ish.
Building the project for Linux - passed...
Trying to lunch the build, when I don't have kinect connected, failed:

---

Set current directory to /home/abraverm/VR
Found path: /home/abraverm/VR/broadcaster.x86
Mono path[0] = '/home/abraverm/VR/broadcaster_Data/Managed'
Mono path[1] = '/home/abraverm/VR/broadcaster_Data/Mono'
Mono config path = '/home/abraverm/VR/broadcaster_Data/Mono/etc'
PlayerConnection initialized from /home/abraverm/VR/broadcaster_Data (debug = 0)
PlayerConnection initialized network socket : 0.0.0.0 55162
Multi-casting "[IP] 192.168.1.103 [Port] 55162 [Flags] 3 [Guid] 1790099615 [EditorId] 651863147 [Version] 1048832 [Id] LinuxPlayer(192.168.1.103) [Debug] 1" to [225.0.0.222:54997]...
Waiting for connection from host on [192.168.1.103:55162]...
Timed out. Continuing without host connection.
Using monoOptions --debugger-agent=transport=dt_socket,embedding=1,defer=y,address=0.0.0.0:56615
PlayerConnection already initialized - listening to [192.168.1.103:55162]
displaymanager : xrandr version warning. 1.5
client has 8 screens
displaymanager screen (0)(HDMI1): 1920 x 1080
Using libudev for joystick management


Importing game controller configs
[1]    15781 abort (core dumped)  ./broadcaster.x86

---

Lets find something useful.. oh god its hard...
Start with, the whole thing seems to hard depended on Windows libraries which
mean nothing in Linux. I can't find a reasonable way to debug the whole thing.
Seems like there is some sort of Unity-Mono integration, which refuses to work
on my system. The internal MonoDevelop doesn't work at all, and my external hangs
on opening the script files. I think this is some sort of POC done by students,
as the project doesn't have any updates since 8 month ago. I have no interest
in fixing it. But I will keep it for reference.

> sigh



[1]: http://kinectvr.com/
[2]: https://www.microsoft.com/en-us/download/details.aspx?id=44561
[3]: https://openkinect.org
[4]: https://github.com/OpenKinect/libfreenect
[5]: https://github.com/abraverm/KinectVR


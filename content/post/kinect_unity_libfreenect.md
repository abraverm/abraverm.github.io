+++
categories = ["VR","development"]
date = "2017-06-11T10:55:45+03:00"
description = "Getting started integrating Kinect and Unity OSS in Linux"
draft = true
publishdate = "datetime"
tags = ["kinect","unity","libfreenect"]
title = "Kinect with Unity and libfreenect"
toc = false

+++

[My first attempt with integrating Kinect and Unity][1] with out of the box solution
named KinectVR didn't go well. So I decided to look for another alternative,
and found a [similar project based on OpenKinect][2] library (libfreenect).
But of course it didn't compile on my system, which caused me doubt my
workspace. The real feeling that was annoying me is that there are so many things
I don't understand how they work in Unity. For example the C# scripting and how
things are related and triggered. I was afraid they might be practicing witchcraft,
A.K.A  [Convention over Configuration][3] like Rails. This drove me to do
Unity [tutorial Roll-a-Ball][4] which I have to say was very good and fun. It
was also a great method to clean start my workspace.

# Getting started with Unity in Linux

1. Download the [latest compiled version][5] of Unity for Linux

> In theory you might be able to build Unity from source, but I didn't find a
guide for it.

Go to the last post in the thread, and you will see a link like this one:
"http://beta.unity3d.com/download/45784aaa9968/public_download.html"

Download the "Platform-Agnostic Self-Extracting Shell Script", I got a file
named 'unity-editor-installer-5.4.2f2+20161111.sh'

2. Install Unity:

---
chmod +x unity-editor-installer-5.4.2f2+20161111.sh
sudo ./unity-editor-installer-5.4.2f2+20161111.sh
mv unity-editor-5.4.2f2 ~/Unity # or anywhere else you want
cp *.desktop $HOME/.local/share/applications
---

Next, edit the desktop files and adjust the path to where you install Unity:

 - `$HOME/.local/share/applications/unity-monodevelop.desktop`
 - `$HOME/.local/share/applications/unity-editor.desktop`

For example `$HOME/.local/share/applications/unity-monodevelop.desktop`:

---
[Desktop Entry]
Version=0.0.0f0
Name=Unity
Exec=/home/abraverm/Unity/Editor/Unity %F
Exec=/home/abraverm/Unity/Editor/Unity %U
Icon=unity-editor-icon
Terminal=false
Type=Application
StartupNotify=true
Categories=Development;IDE;Application;
MimeType=x-scheme-handler/com.unity3d.kharma;
---

You should be able to find Unity where you find all your other applications.
If you want to start Unity from command line, call it directly:
`~/Unity/Editor/Unity` or add it to your PATH (out of scope for this guide).

3. Run and configure Unity

Start Unity Editor from your application menu or from the command line.
To verify that everything is in order, create a new project, like showed in
[Roll-a-Ball tutorial][6]. Create a script in the project, like demonstrated
in the next tutorial of [Roll-a-Ball][7], and try to open it.

If for some reason it doesn't open, configure Unity to use unity-monodevelop
manually, by going in the menu to: `Edit -> Prefrences -> External Tools`
Then click on the drop list of `External Script Editor` and select `browse`.
Enter `~/Unity/MonoDevelop/bin/monodevelop`, or wherever you installed Unity.
Now its possible to use other editor or globally installed MonoDevelop with
package manager, but Unity people configured it to work with Unity well, for
example auto-complete C# and nice help quick search. Trust me, I prefer using
VIM, and I'm working on making it happen but we are getting started here, right?

4. Version Control it

I think that any modern project must have version control, as its the only way
we can collaborate and effectively debug issues. My personal favorite version
control system is Git, but the following changes easily can be adjusted for any
other system. Unity by default stores configurations and other 3d data in binary
form. This maybe improve performance on large projects but its a critical blow
to version control, as it takes a lot of storage and impossible to version it.
So in any project you start working with, you have to do the following:

a. [Make everything in text][9]

`Editor → Project Settings → Editor → Asset Serialization Mode: Force Text`

b. Ignore temporary and other not to be version controlled files in [`.gitignore`][10]:

---
===============
Unity generated
===============
Temp/
Library/

=====================================
Visual Studio / MonoDevelop generated
=====================================
ExportedObj/
obj/
*.svd
*.userprefs
/*.csproj
*.pidb
*.suo
/*.sln
*.user
*.unityproj
*.booproj
---

c. [Smart merge things][11]

Add the following text to your .git/config or .gitconfig file:

---
[merge]
tool = unityyamlmerge

[mergetool "unityyamlmerge"]
trustExitCode = false
cmd = '<path to Unity>/Editor/Data/Tools/UnityYAMLMerge' merge -p "$BASE" "$REMOTE" "$LOCAL" "$MERGED"
---

> Adjust the cmd setting above to the correct path of Unity.

# Getting started with OpenKinect

1. Compile from source

The OpenKinect library comes with very useful tools and wrappers, and if your
OS provides the library, it probably doesn't come will all the tools and
wrappers. In our case we will need the C# wrapper, and for development it would
be nice to use fakenect a simulator of Kinect.

a. OpenCV - optional (if want python wrapper too)

My favorite language is Monty Python, so I prefer having Python wrapper just
in case, we are getting started here, right? Python wrapper example require
import of cv library, however it was deprecated from latest major version (3)
of OpenCV. The problem is that OpenCV 2 is not available in Pip or in your package
manager (probably), so we have to [build it ourselves][12][13]:

---
# Install requirements(maybe you don't need everthing, or maybe you need more?):
dnf install cmake python-devel numpy gcc gcc-c++ gtk2-devel libdc1394-devel \
  libv4l-devel ffmpeg-devel gstreamer-plugins-base-devel libpng-devel \
  libjpeg-turbo-devel jasper-devel openexr-devel libtiff-devel libwebp-devel \
  tbb-devel eigen3-devel python-sphinx texlive
# I have special directory for this cases at ~/src
cd ~/src
# This step will take some time..
git clone https://github.com/opencv/opencv.git
# We need our OpenCV version 2
git checkout 2.4.13

mkdir build && cd build

# Configure
cmake -D CMAKE_BUILD_TYPE=Release -D CMAKE_INSTALL_PREFIX=/usr/local ..

# Build - another cup of coffee
make

# Install(?) - I don't need OpenCV for anything else so I don't care installing
# it globallly. If you don't feel like it, well.. hmm.. write a post ;)
sudo make install

# Move the module to Python path
sudo cp /usr/local/lib/python2.7/site-packages/cv2.so /usr/lib/python2.7/site-packages
---

You can verify this works with running: `python -c "import cv;print cv.__file__"`

b. Configure and Build libfreenect

The process is pretty [straight forward][8]:

---

---

Follow the instructions of [Fetch & Build][9]
2. Test and verify

# Example Unity project with OpenKinect

Running the built project for Linux: `mono my_project.x86_64`


[1]: https://abraverm.github.io/post/kinectvr_getting_started/
[2]:
[3]: https://en.wikipedia.org/wiki/Convention_over_configuration
[4]: https://unity3d.com/learn/tutorials/projects/roll-ball-tutorial
[5]: https://forum.unity3d.com/threads/unity-on-linux-release-notes-and-known-issues.350256/
[6]: https://unity3d.com/learn/tutorials/projects/roll-ball-tutorial/setting-game?playlist=17141
[7]: https://unity3d.com/learn/tutorials/projects/roll-ball-tutorial/moving-player?playlist=17141
[8]: https://openkinect.org/wiki/Getting_Started#Manual_Build_on_Linux#
[9]: https://docs.unity3d.com/Manual/class-EditorManager.html
[10]: https://unity3d.com/learn/tutorials/topics/production/mastering-unity-project-folder-structure-version-control-systems
[11]: https://docs.unity3d.com/Manual/SmartMerge.html
[12]: http://docs.opencv.org/master/d7/d9f/tutorial_linux_install.html
[13]: http://docs.opencv.org/3.1.0/dd/dd5/tutorial_py_setup_in_fedora.html

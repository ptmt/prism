#!/bin/sh

/usr/local/lib/mono/xbuild src/prism.sln
mono ./build/Prism.App.exe
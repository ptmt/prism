#!/bin/sh

mono /usr/local/lib/mono/4.5/xbuild.exe src/prism.sln
cp build/* /var/www/prism.phinitive.com/last
killall -9 mono
mv /var/www/prism.phinitive.com/last/* /var/www/prism.phinitive.com/current/ 
mono /var/www/prism.phinitive.com/current/Prism.App.exe &
#!/bin/sh

mono /usr/local/lib/mono/4.5/xbuild.exe src/prism.sln || exit 1
cp build/* /var/www/prism.phinitive.com/last -R || exit 2
supervisorctl prismmono stop
rm /var/www/prism.phinitive.com/current/* -R 
mv /var/www/prism.phinitive.com/last/* /var/www/prism.phinitive.com/current/ 
supervisorctl prismmono start
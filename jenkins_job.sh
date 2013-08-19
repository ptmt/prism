#!/bin/sh

mono /usr/local/lib/mono/4.5/xbuild.exe src/prism.sln 
echo "copying files from build directory to last"
cp build/* /var/www/prism.phinitive.com/last -R | exit 1
supervisorctl stop prismmono
wait
rm /var/www/prism.phinitive.com/current/* -R | exit 2
echo "removing old files"
mv /var/www/prism.phinitive.com/last/* /var/www/prism.phinitive.com/current/ -f
echo "moving files from last build to current production folder"
supervisorctl start prismmono
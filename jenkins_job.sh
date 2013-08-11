#!/bin/sh

mono /usr/local/lib/mono/4.5/xbuild.exe src/prism.sln 
cp build/* /var/www/prism.phinitive.com/last -R
supervisorctl stop prismmono
rm /var/www/prism.phinitive.com/current/* -R 
mv /var/www/prism.phinitive.com/last/* /var/www/prism.phinitive.com/current/ 
supervisorctl start prismmono
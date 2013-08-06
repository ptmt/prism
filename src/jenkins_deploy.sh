#!/bin/sh

mono /usr/local/lib/mono/4.5/xbuild.exe src/prism.sln
cp build/* /var/www/prism.phinitive.com/last
cp src/public /var/www/prism.phinitive.com/last/public

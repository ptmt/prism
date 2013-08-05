#!/bin/sh

apt-get install -y mono-gmcs || exit 1

apt-get install git || exit 1
apt-get install automake || exit 1
apt-get install g++ || exit 1
apt-get install libtool || exit 1

git clone git://github.com/mono/mono.git || exit 2
cd mono
./autogen.sh || exit 4
make || exit 5
make install || exit 6

#cd mcs/tools/xbuild
#make || exit 7
#make install || exit 8

cd ..
rm -fr mono || exit 9

apt-get remove -y mono-gmcs || exit 10

exit 0
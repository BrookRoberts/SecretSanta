#!/bin/bash
# from http://stackoverflow.com/questions/59895/can-a-bash-script-tell-which-directory-it-is-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd $DIR && browserify src/app.js -o dst/bundle.js -t [ babelify --presets [ es2015 ] ] && popd;

# Run this in another process:
#pushd $DIR/server/client
#watchify src/app.js -o dst/bundle.js -t [ babelify --presets [ es2015 ] ] -v

#!/bin/bash
# from http://stackoverflow.com/questions/59895/can-a-bash-script-tell-which-directory-it-is-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd $DIR && browserify app.js -o bundle.js -t [ babelify --presets [ es2015 ] ] && popd;

# Run this in another process:
#pushd ~/dev/SecretSanta/src/client
#watchify app.js -o bundle.js -t [ babelify --presets [ es2015 ] ] -v

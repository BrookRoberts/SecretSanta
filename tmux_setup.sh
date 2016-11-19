#!/bin/bash

SESSIONNAME="secret_santa"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
tmux has-session -t $SESSIONNAME &> /dev/null

if [ $? != 0 ]; then
    tmux new-session -s $SESSIONNAME -n "vim" -d
    tmux send-keys -t $SESSIONNAME "vim devlog.md" C-m

    tmux new-window -n 'watchify'
    tmux send-keys -t $SESSIONNAME "pushd $SCRIPT_DIR/server/client" C-m
    tmux send-keys -t $SESSIONNAME "watchify src/app.js -o dst/bundle.js -t [ babelify --presets [ es2015 ] ] -v" C-m 

    tmux new-window -n 'sass'
    tmux send-keys -t $SESSIONNAME "pushd $SCRIPT_DIR/server/client" C-m
    tmux send-keys -t $SESSIONNAME "sass --watch scss:css" C-m 

    tmux new-window -n 'flask'
    tmux send-keys -t $SESSIONNAME "pushd $SCRIPT_DIR/server" C-m
    tmux send-keys -t $SESSIONNAME ". venv/bin/activate" C-m
    tmux send-keys -t $SESSIONNAME "export FLASK_APP=server.py" C-m 
    tmux send-keys -t $SESSIONNAME "export FLASK_DEBUG=1" C-m 
    tmux send-keys -t $SESSIONNAME "python -m flask run" C-m 

    tmux next-window
fi

tmux attach -t $SESSIONNAME

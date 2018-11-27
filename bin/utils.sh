#!/usr/bin/env bash

# tput colors
# @see https://eli.thegreenplace.net/2013/12/18/makefile-functions-and-color-output
# @see https://linux.101hacks.com/ps1-examples/prompt-color-using-tput/
RED=1
GREEN=2
YELLOW=3
BLUE=4
MAGENTA=5
CYAN=6


# Breaks output with a empty or custom string
breakline () {
    tput setaf $GREEN
    [ -z "$1" ] && echo "" || echo $1
    tput sgr0
}


# Outputs to sdout with color
colorecho () {
    tput setaf $2
    echo $1
    tput sgr0
}


# Outputs 'done'
dekita () {
    tput setaf $GREEN
    echo "できた (Done!)"
    tput sgr0
    breakline
}

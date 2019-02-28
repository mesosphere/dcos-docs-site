#!/bin/bash
#
# Usage:       count-words.sh pages/1.11/installing
#
# Description: Counts words in folder
#

find $1 -name index.md | xargs wc -w | tail -1

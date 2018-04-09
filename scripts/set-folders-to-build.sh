#!/bin/bash
#
# Usage:   This script gets the log from Jenkins and determines which folders should we build.
#
# Description: Gets the argument, finds the md files, strips the folder name and sends
#           this information
#           to mdtopdf.sh to recurse the tree and build the temp file with all the information
#           for the new pdf.
#
#
#

# If changes are coming in from ci/pdf/7-jenkins-build
LOG=${1}

echo "${LOG}"


# If changes come from ci/pdf/6-jenkins-list-of-changes
COMMIT_INFO=${1}
COMMIT_CHANGES=${2}
COMMIT_FILES=${3}

echo ${COMMIT_INFO} "This is the commit info"
echo ${COMMIT_CHANGES} "These are the commit changes"
echo ${COMMIT_FILES} "these are the commit files"
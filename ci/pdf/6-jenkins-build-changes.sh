#!/usr/bin/bash

#   Usage:        Get a list of the changes between builds
#
#   Description:  Get a list of commits with changes that are in the last successfull commit
#                 in order to split the build of the pdf. This script uses Groovy from Jenkins.
#


#   *******************************************************************
#    Get information from Last Changes Plugin and set up Env.Variables
#   *******************************************************************

#DESTINATION_DIR="/scripts/lint-process-generator.js"

# Shows all markdown files changes
LOG=$(git diff "${GIT_PREVIOUS_SUCCESSFUL_COMMIT}"..HEAD --name-only | grep .md)

echo "${LOG}" > ".log"


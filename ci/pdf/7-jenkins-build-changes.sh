#!/usr/bin/bash

#   Usage:        Get a list of the changes between builds
#
#   Description:  Get a list of commits with changes that are in the last successfull commit
#                 in order to split the build of the pdf. This script uses Groovy from Jenkins.
#


#   *******************************************************************
#    Get information from Last Changes Plugin and set up Env.Variables
#   *******************************************************************


# Define the format in which the log will come up
GIT_LOG_FORMAT="%ai %an: %s"
# Set up credentials # i dont know if we have this
USER=<username> # we would probably be needing this to get the information from Jenkins
API_TOKEN=<api_token> # We would be needing this as well as the username

# Set up succesful url to get the information
LAST_SUCCESS_URL_SUFFIX="lastSuccessfulBuild/api/xml" # do we have access to the xml?

URL="$JOB_URL$LAST_SUCCESS_URL_SUFFIX"

LAST_SUCCESS_REV=$(curl --silent --user ${USER}:${API_TOKEN} ${URL} | grep "<lastBuiltRevision>" | sed 's|.*<lastBuiltRevision>.*<SHA1>\(.*\)</SHA1>.*<branch>.*|\1|')
# Pulls all commit comments since the last successfully built revision
LOG=$(git log --pretty="${GIT_LOG_FORMAT}" ${LAST_SUCCESS_REV}..HEAD)
echo ${LOG} > /scripts/set-folders-to-build.sh


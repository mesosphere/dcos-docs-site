#!/usr/bin/env groovy

#  Usage:        Get a list of the changes between builds
#
#  Description:  Get a list of commits with changes that are in the last successfull commit
#                in order to split the build of the pdf. This script uses Groovy from Jenkins.
#




    #  *******************************************************************
    #   Get information from Last Changes Plugin and set up Env.Variables
    #  *******************************************************************


def lastSuccessfulCommit = getLastSuccessfulCommit()
 def currentCommit = commitHashForBuild(currentBuild.rawBuild)
    if (lastSuccessfulCommit) {
    commits = sh(
        script: "git rev-list $currentCommit \"^$lastSuccessfulCommit\"",
        returnStdout: true
    ).split('\n')
    println "Commits are: $commits"
 }
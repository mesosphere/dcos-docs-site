#!/bin/bash
#
# Usage: Get a list of the changes between builds
#
# Description:  Get a list of commits that triggered the build when possible in order to
#                split the build of the pdf.
#
#

def lastSuccessfulCommit = getLastSuccessfulCommit()
def currentCommit = commitHashForBuild(currentBuild.rawBuild)
if (lastSuccessfulCommit) {
commits = sh(
    script: "git rev-list $currentCommit \"^$lastSuccessfulCommit\"",
    returnStdout: true
).split('\n')
println "Commits are: $commits"
}
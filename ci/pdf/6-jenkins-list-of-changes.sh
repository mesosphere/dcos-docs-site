#!/usr/bin/env groovy

//   Usage:        Get a list of the changes between builds
//
//   Description:  Get a list of commits with changes that are in the last successfull commit
//                 in order to split the build of the pdf. This script uses Groovy from Jenkins.
//


//   *******************************************************************
//    Get information from Last Changes Plugin and set up Env.Variables
//   *******************************************************************


def publisher = LastChanges.getLastChangesPublisher "PREVIOUS_REVISION", "SIDE", "LINE", true, true, "", "", "", "", ""
    publisher.publishLastChanges()

def changes = publisher.getLastChanges()
println(changes.getEscapedDiff())

for (commit in changes.getCommits()) {
    println(commit)
    def commitInfo = commit.getCommitInfo()
    println(commitInfo)
    println(commitInfo.getCommitMessage())
    def commitChanges = commit.getChanges();
    println(commit.getChanges())
    // I dont know if getFiles() works
    def commitFiles = commit.getFiles();
    println(commit.getFiles());

    // Make this variables available to any environment
    sh "echo $commitInfo $commitChanges $commitFiles > 'scripts/set-folders-to-build.sh' "
}

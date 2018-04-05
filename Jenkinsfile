#!/usr/bin/env groovy
/*
** Usage:        Get a list of the changes between builds
**
** Description:  Get a list of commits with changes that are in the last successfull commit
**               in order to split the build of the pdf. This script uses Groovy from Jenkins.
**
**
*/

/* 1. Set the variables so I get the data that was either introduced or changed  */

/*     *******************************************************************
**      Get information from Last Changes Plugin and set up Env.Variables
**     *******************************************************************
*/

/* Set up the files I need to read variables into:
*/
def definingFile = "./scripts/set-folders-to-build.js";
def newFile = new File(definingFile)
def w = newFile.newWriter()

pipeline {
    agent any

    stages {
        stage('Checkout') {
            git 'https://github.com/jenkinsci/last-changes-plugin.git'
        }
        stage("last-changes") {
            def publisher = LastChanges.getLastChangesPublisher "PREVIOUS_REVISION", "SIDE", "LINE", true, true, "", "", "", "", ""
                publisher.publishLastChanges()
                def changes = publisher.getLastChanges()
                println(changes.getEscapeDiff())
                for (commit in changes.getCommit()) {
                    println(commit)
                    def commitInfo = commit.getCommitInfo()
                    println(commitInfo)
                    def commitMessage = commitInfor.getCommitMessage()
                    println(commitInfo.getCommitMessage())
                    def commitChanges = commit.getChanges()
                    println(commit.getChanges())

                    // write the variables into the file, and close the writer
                    newFile.newWriter().withWriter { w ->
                        w << sh "echo $commitInfo, $commitMessage, $commitChanges"
                    }
                }
        }
    }
}
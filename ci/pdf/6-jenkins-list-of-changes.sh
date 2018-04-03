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

/*    *****************
*     Get information from Last Changes Plugin and set up Env. Variables
*     *****************
*/
pipeline {
    agent { docker {image 'node:6.3'} }

    stages {
        stage('build') {
            steps {
                sh 'npm --version'

            }
        }
    }
}

/* 2. Find those files and run the scripts to lint */

/* 3. Run the compression script on any images */
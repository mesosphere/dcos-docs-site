#!/bin/bash
 //
//  Usage:   This script gets the log from Jenkins and determines which folders should we build.
//
//  Description: Gets the argument, finds the md files, strips the folder name and sends
//    this information
//    to mdtopdf.sh to recurse the tree and build the temp file with all the information
//    for the new pdf.
//
//
//

//  If changes are coming in from ci/pdf/7-jenkins-build
const log = process.env.LOG;

console.log(log)

// Require child processes
// const childProcess = require('child_process');

// Function to Lint markdown
// function markdownLint('./mdlinter.js', callback) {
//     var invoked = false;

//     var
// }


//  Loop through the files
function main() {
    const n = 0;

    // First lint the files
    while (n < log.length) {

    }
}

main(log);
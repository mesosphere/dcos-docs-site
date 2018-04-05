#!/bin/node
/*
* Usage:   This script gets the log from Jenkins and determines which folders should we build.
*
* Description: Gets the argument, finds the md files, strips the folder name and sends
*           this information
*           to mdtopdf.sh to recurse the tree and build the temp file with all the information
*           for the new pdf.
*
*
*/

const fs = require('fs');

const path = require('path');

// Get the log to examine.
const log = process.argv[2];
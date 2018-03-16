#!/bin/node
// script to validate the links to images in the markdown files

var fs = require('fs');
var path = require('path');
const dir = process.argv[2];

// expression to identify the files we want to process
var fileRX = new RegExp(/.*\/(index.md)/g);

// mdv is the library we want to use for it
var mdv = require('mdv');

// we activate the options
var options = '-w';

//script that checks for broken image links in markdown files

function walk (dir, done) {
  var results = [];
  var validate;
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            // check in mdv for any image link broken
            results.forEach(function(value) {

                // check for all the image links, codeblocks, etc
                if (value.match(fileRX) !== null) {
                // console.log(value, 'this is the value');
                   validate = mdv.validate(value, options);
                // MAKE IT log the error only if we are missing any of the things it checks
                   if (validate.imagesWithMissingAlt[0] > 0) {
                       console.log(validate)
                   }
                   //console.log(validate);
                }

            });
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(dir, function done(){})
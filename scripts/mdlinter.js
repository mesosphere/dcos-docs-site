#!/bin/node
// Usage: Script to validate the ./pages markdown and show any warnings before building.
// Description: Creates an async parallel loop  that traverses the ./pages directory
// Analysing any errors that can be found in the markdown.
//


const fs = require('fs');

const path = require('path');

const dir = process.argv[2];

const tovfile = require('to-vfile');

const vfile = require('vfile');

const vreporter = require('vfile-reporter');

// pattern to match the files we want to process.
const fileRX = new RegExp(/.*\/(index.md)/g);

// require the script
const remark = require('remark');

const styleguideWritability = require('remark-preset-lint-styleguide/writability');

const styleguideConsistent = require('remark-preset-lint-consistent');

const styleguide = require('remark-preset-lint-styleguide');

const styleguideLint = require('remark-preset-lint-markdown-style-guide');

const report = require('vfile-reporter');

// script that lints markdown files
// async parallel recursive loop
function walk(dir, done) {
  let results = [];
  // let validate;

  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;

    if (!pending) return done(null, results);

    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            // check in mdv for any image link broken
            results.forEach((value) => {
              // check for all the image links, codeblocks, etc
              if (value.match(fileRX) !== null) {
                const output = remark()
                  .use(styleguideLint)
                  .process(tovfile.readSync(value), (err, file) => {
                    // report all the errors per file
                    console.error(vreporter(file));
                  });
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
}

walk(dir, () => {});

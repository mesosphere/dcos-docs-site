#!/bin/node
// Usage: Script to validate the images markdown
// Description: Images need to be written correctly, so this scripts will scan the files for any
// broken image checker.
//
const fs = require('graceful-fs');

const path = require('path');

const dir = process.argv[2];

const readLine = require('readline');
// expression to identify the files we want to process
const fileRX = new RegExp(/.*\/(index.md)/g);
const imageExp = new RegExp(/(jpeg|png|svg|gif|jpg)/i);
// mdv is the library we want to use for it
const mdv = require('mdv');

// we activate the options
const options = { debug: true };

// script that checks for broken image links in markdown files
function walk(dir, done) {
  let results = [];
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
            // Now use all the value = files in the system
            results.forEach((value) => {
              // match just the index.md files
              if (value.match(fileRX) !== null) {
                // Create streams of lines from that files
                const lineReader = readLine.createInterface({
                  input: fs.createReadStream(value),
                });
                lineReader.on('line', (line) => {
                  line = line.trim();

                  // Find all the lines that contain images in them, and lint them
                  if (line.match(imageExp)) {
                    const validateError = (validate) => {
                      if (validate.imagesWithMissingAlt > 0) {
                        return `${line} : Image needs Alt. in ${value}`;
                      } else if (validate.missingAnchors.length > 0) {
                        return `${line} : Image is missing anchors.`;
                      } else if (validate.duplicatedAnchors.length > 0) {
                        return `${line} : Image has duplicated anchors.`;
                      } else if (validate.anchorsWithHash.length > 0) {
                        return `${line} : Image has anchors with hash.`;
                      } else if (validate.anchorsWithEmptyText.length > 0) {
                        return `${line} : Image has anchors with empty text.`;
                      } else if (validate.localRefNoHash.length > 0) {
                        return `${line} : Image local ref has no hash.`;
                      }
                        return;

                    };

                    const lineCheck = mdv.validate(line, options);

                    const resultError = validateError(lineCheck);
                    if (resultError) {
                      console.log(resultError);
                    }
                  }
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
